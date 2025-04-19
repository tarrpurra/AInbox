import dotenv from "dotenv";
dotenv.config();

import Together from "together-ai";
import fetch from "node-fetch";


console.log(process.env.TOGETHER_API_KEY)
// Initialize Together AI Client
const client = new Together({
  apiKey: process.env.TOGETHER_API || "tgp_v1_cuSyUFiwWqPRVtm4WF3xG6-7ameLtqZHF85aQpqTshU",
});

function extractJSON(text) {
  if (!text || typeof text !== "string") return null;
  const match = text.match(/\{[\s\S]*?\}/);
  return match ? match[0] : null;
}

function truncateText(text, maxLength = 2000) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

/* ----------------------------- TOGETHER AGENTS ----------------------------- */
async function analyzeEmailMeta(subject, body) {
  const firstLine = body.split("\n").filter(Boolean)[0] || "";
  const input = `Subject: ${subject}\nFirst line of body: ${firstLine}`;
  const prompt = `
You are a classification agent for email triage. Return a valid JSON:

{
  "priority": "high" | "medium" | "low",
  "sentiment": "positive" | "neutral" | "negative",
  "label": "otp" | "work" | "meeting" | "personal" | "transaction" | "support" | "marketing" | "other",
  "intent": "inform" | "request" | "confirm" | "escalate" | "notify"
}

Input:
${input}`;

  try {
    const response = await client.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: [
        { role: "system", content: "Respond with valid JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 300,
    });

    const content = response.choices?.[0]?.message?.content?.trim();
    const jsonText = extractJSON(content);
    if (!jsonText) throw new Error("No JSON found in Together response.");

    const result = JSON.parse(jsonText);
    return { ...result, source: "together" };
  } catch (err) {
    console.error("🛑 Together Classification Error:", err.message);
    throw err;
  }
}

async function summarizeAndReply(body, count = 5, replycount = 5) {
  const prompt = `
You are an email assistant. Respond with valid JSON:
{
  "summary": "...",
  "reply": "..."
}
Email:
"""
${truncateText(body)}
"""
`;

  try {
    const response = await client.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: [
        { role: "system", content: "Respond with valid JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 700,
    });

    const content = response.choices?.[0]?.message?.content?.trim();
    const jsonText = extractJSON(content);
    if (!jsonText) throw new Error("No JSON found in Together reply.");

    const result = JSON.parse(jsonText);
    return { ...result, source: "together" };
  } catch (err) {
    console.error("🛑 Together Summarization Error:", err.message);
    throw err;
  }
}

/* ----------------------------- OPENROUTER FALLBACK ----------------------------- */
async function classifyEmailOpenRouter(subject, body) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const firstLine = body.split("\n").filter(Boolean)[0] || "";
  const prompt = `
You are a classification assistant. Respond only in this format:
{
  "priority": "high" | "medium" | "low",
  "sentiment": "positive" | "neutral" | "negative",
  "label": "otp" | "work" | "meeting" | "personal" | "transaction" | "support" | "marketing" | "other",
  "intent": "inform" | "request" | "confirm" | "escalate" | "notify"
}
Subject: ${subject}
First line: ${firstLine}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          { role: "system", content: "Respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 300,
      }),
    });

    const content = (await response.json()).choices?.[0]?.message?.content?.trim();
    const jsonText = extractJSON(content);
    if (!jsonText) throw new Error("No JSON found in fallback classification.");

    const result = JSON.parse(jsonText);
    return { ...result, source: "openrouter" };
  } catch (err) {
    console.error("🛑 OpenRouter Classification Error:", err.message);
    throw err;
  }
}

async function summarizeAndReplyOpenRouter(body, count = 5, replycount = 5) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const prompt = `
You are a helpful email assistant. Respond ONLY with:
{
  "summary": "...",
  "reply": "..."
}
Email:
"""
${truncateText(body)}
"""
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          { role: "system", content: "Respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 700,
      }),
    });

    const content = (await response.json()).choices?.[0]?.message?.content?.trim();
    const jsonText = extractJSON(content);
    if (!jsonText) throw new Error("No JSON found in fallback reply.");

    const result = JSON.parse(jsonText);
    return { ...result, source: "openrouter" };
  } catch (err) {
    console.error("🛑 OpenRouter Reply Error:", err.message);
    throw err;
  }
}

/* ----------------------------- FALLBACK WRAPPERS ----------------------------- */
export async function classfying_with_fallback(subject, body) {
  try {
    return await analyzeEmailMeta(subject, body);
  } catch {
    return await classifyEmailOpenRouter(subject, body);
  }
}

export async function summarizeAndReplyWithFallback(body, summaryLength = 5, replyLength = 5) {
  try {
    return await summarizeAndReply(body, summaryLength, replyLength);
  } catch {
    return await summarizeAndReplyOpenRouter(body, summaryLength, replyLength);
  }
}

// ----------------------------- Test Runner -----------------------------
// ----------------------------- Test Runner -----------------------------
// async function test() {
//   const subject = "Reminder: Design Review Meeting Tomorrow";
//   const body = `
// Hi team,

// Just a quick reminder that our design review meeting is scheduled for tomorrow at 10 AM in Room B.
// Please bring any mockups, materials, or updates you want to present.

// Thanks,
// Alex`;

//   console.log("📌 Running classification with fallback...");
//   const classification = await classfying_with_fallback(subject, body);
//   console.log("📊 Classification Result:", classification);

//   console.log("\n📌 Running summarization + reply with fallback...");
//   const summaryReply = await summarizeAndReplyWithFallback(body);
//   console.log("🧠 Summary + Reply:", summaryReply);
// }

// // ✅ Run the test if this file is executed directly
// test()
