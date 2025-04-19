import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import FileStore from "session-file-store";
import {
  classfying_with_fallback,
  summarizeAndReplyWithFallback,
} from "./agents/agent_api.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FileSessionStore = FileStore(session);

// ----------------------------- OAuth Client Initialization -----------------------------
let oAuth2Client;

function initializeOAuth() {
  oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URIS
  );
  return oAuth2Client;
}

// Initialize OAuth client
initializeOAuth();

// ----------------------------- Middleware -----------------------------
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(
  session({
    store: new FileSessionStore({ 
      path: "./sessions", 
      retries: 1,
      ttl: 7 * 24 * 60 * 60 // 7 days in seconds
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true, // Refresh session expiry on every request
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // Set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// ----------------------------- Auth Middleware -----------------------------
async function ensureValidToken(req, res, next) {
  if (!req.session?.tokens) {
    console.log("No tokens found in session");
    return res.status(401).json({ error: "Not logged in" });
  }

  // Check if token is expired
  const expiryDate = req.session.tokens.expiry_date;
  if (expiryDate && expiryDate <= Date.now()) {
    try {
      console.log("Token expired, attempting to refresh");
      oAuth2Client.setCredentials(req.session.tokens);
      const { credentials } = await oAuth2Client.refreshAccessToken();
      req.session.tokens = credentials;
      console.log("Token refreshed successfully");
    } catch (err) {
      console.error("Failed to refresh token:", err);
      return res.status(401).json({ error: "Session expired, please login again" });
    }
  }
  
  next();
}

// ----------------------------- Helper Functions -----------------------------
function decodeBase64(encoded) {
  const cleaned = encoded.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(cleaned, "base64").toString("utf-8");
}

function extractEmailBody(payload) {
  if (payload.body?.data) return decodeBase64(payload.body.data);

  if (payload.parts) {
    const plain = payload.parts.find((p) => p.mimeType === "text/plain");
    if (plain?.body?.data) return decodeBase64(plain.body.data);

    const html = payload.parts.find((p) => p.mimeType === "text/html");
    if (html?.body?.data) return decodeBase64(html.body.data);
  }

  return "No body content found.";
}

// ----------------------------- Auth Routes -----------------------------
app.get("/auth/login", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "", // Always show consent screen to get refresh token
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
    const userInfo = await oauth2.userinfo.get();

    req.session.tokens = tokens;
    req.session.email = userInfo.data.email;
    
    console.log("Authentication successful for:", userInfo.data.email);
    console.log("Token expiry:", new Date(tokens.expiry_date));
    
    res.redirect("http://localhost:8080/dashboard");
  } catch (err) {
    console.error("Auth callback error:", err);
    res.status(500).send("Authentication failed");
  }
});

app.get("/auth/status", (req, res) => {
  console.log("Session check:", { 
    hasTokens: !!req.session?.tokens,
    hasEmail: !!req.session?.email,
    sessionID: req.sessionID
  });
  
  if (req.session?.tokens && req.session?.email) {
    return res.json({ loggedIn: true, email: req.session.email });
  }
  res.status(401).json({ loggedIn: false });
});

app.get("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ success: true });
  });
});

// ----------------------------- API Routes -----------------------------
app.get("/api/emails", ensureValidToken, async (req, res) => {
  try {
    oAuth2Client.setCredentials(req.session.tokens);
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    
    const { data } = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      labelIds: ["INBOX"],
    });

    const messages = data.messages || [];
    const emails = [];

    for (const msg of messages) {
      const { data: fullMsg } = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "full",
      });

      const headers = fullMsg.payload.headers;
      const subject = headers.find((h) => h.name === "Subject")?.value || "No subject";
      const from = headers.find((h) => h.name === "From")?.value || "Unknown sender";
      const body = extractEmailBody(fullMsg.payload);
      const classification = await classfying_with_fallback(subject, body);

      emails.push({
        id: msg.id,
        subject,
        from,
        snippet: fullMsg.snippet,
        classification,
      });
    }

    res.json(emails);
  } catch (err) {
    console.error("Error fetching emails:", err);
    res.status(500).json({ error: "Failed to fetch emails", message: err.message });
  }
});

app.get("/api/emails/:id", ensureValidToken, async (req, res) => {
  const emailId = req.params.id;
  if (!emailId) return res.status(400).json({ error: "Missing email ID" });

  try {
    oAuth2Client.setCredentials(req.session.tokens);
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    
    const { data: fullMsg } = await gmail.users.messages.get({
      userId: "me",
      id: emailId,
      format: "full",
    });

    const headers = fullMsg.payload.headers;
    const subject = headers.find((h) => h.name === "Subject")?.value || "No subject";
    const from = headers.find((h) => h.name === "From")?.value || "Unknown sender";
    const date = headers.find((h) => h.name === "Date")?.value || "Unknown date";
    const body = extractEmailBody(fullMsg.payload);

    const summaryReply = await summarizeAndReplyWithFallback(body);

    res.json({
      id: emailId,
      subject,
      from,
      date,
      body,
      snippet: fullMsg.snippet,
      summary: summaryReply.summary,
      reply: summaryReply.reply,
      source: summaryReply.source,
    });
  } catch (err) {
    console.error("❌ Failed to fetch email:", err);
    res.status(500).json({ error: "Failed to fetch email", message: err.message });
  }
});

// Standalone Classify
app.post("/api/classify", async (req, res) => {
  const { subject, body } = req.body;
  if (!subject || !body) return res.status(400).json({ error: "Missing subject or body" });

  try {
    const result = await classfying_with_fallback(subject, body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Classification failed", message: err.message });
  }
});

// Standalone Summarize
app.post("/api/summarize", async (req, res) => {
  const { body } = req.body;
  if (!body) return res.status(400).json({ error: "Missing email body" });

  try {
    const result = await summarizeAndReplyWithFallback(body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Summarization failed", message: err.message });
  }
});

// ----------------------------- Server Start -----------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});