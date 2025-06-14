require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const brevo = require("sib-api-v3-sdk");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize the default client from sib-api-v3-sdk
let defaultClient = brevo.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const emailApi = new brevo.TransactionalEmailsApi();

app.post("/send-email", async (req, res) => {
  let sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.subject = `New Service Request from ${req.body.firstName} ${req.body.lastName}`;
  sendSmtpEmail.htmlContent = `<html><body>
    <h2>New Service Request for ${req.body.firstName} ${req.body.lastName}</h2>
    <p><strong>Name:</strong> ${req.body.firstName} ${req.body.lastName}</p>
    <p><strong>Preferred Contact Method:</strong> ${req.body.contactMethod.toString().toUpperCase()}</p>
    <p>${req.body.contactMethod === "phone" ? `<strong>Phone:</strong> ${req.body.phone}` : `<strong>Email:</strong> ${req.body.email}`}</p>
    <p><strong>Services Requested:</strong> ${req.body.servicesRequested.join(", ")}</p>
    <p><strong>Description:</strong> ${req.body.description || "No additional details provided"}</p>
  </body></html>`;
  sendSmtpEmail.sender = { 
    name: process.env.SENDER_NAME, 
    email: process.env.SENDER_EMAIL 
  };
  sendSmtpEmail.to = [{ email: process.env.RECEIVER_EMAIL, name: "Admin" }];
  sendSmtpEmail.replyTo = { email: process.env.RECEIVER_EMAIL, name: "Admin" };

  try {
    let data = await emailApi.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully:", data);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Brevo API error:", error);
    res.status(500).json({ message: "Failed to send email", error: error.toString() });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
