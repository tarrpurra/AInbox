const loginBtn = document.getElementById("loginBtn");
const emailList = document.getElementById("emailList");
const emailsSection = document.getElementById("emails");

loginBtn.addEventListener("click", () => {
  // Redirect to backend for OAuth login
  window.location.href = "http://localhost:5000/auth/login";
});

// On dashboard (after login), try to load emails
async function fetchEmails() {
  try {
    const res = await fetch("http://localhost:5000/api/emails", {
      credentials: "include", // Important: include session cookie
    });

    if (!res.ok) {
      throw new Error("Not authorized or failed to fetch emails.");
    }

    const emails = await res.json();
    emailsSection.style.display = "block";
    emailList.innerHTML = "";

    emails.forEach((email) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>From:</strong> ${email.from}<br>
        <strong>Subject:</strong> ${email.subject}<br>
        <p>Body:</p> ${email.body}<br>
        <strong>Snippet:</strong> ${email.snippet}<br>
        <strong>Agent:</strong> ${email.result}<br>
      `;
      emailList.appendChild(li);
    });
  } catch (err) {
    console.log(err.message);
  }
}

// Call it on load to check if user is already logged in
window.onload = fetchEmails;
