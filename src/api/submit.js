import nodemailer from "nodemailer";

function extractFields(body) {
  // Accept multiple naming conventions from frontend
  return {
    name: body.name || body.fullName || "",
    email: body.email || body.workEmail || "",
    company: body.company || "",
    inquiry: body.inquiry || body.inquiryType || "",
    message: body.message || body.projectScopeOrJobRole || "",
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const { name, email, company, inquiry, message } = extractFields(body);

  // Detailed validation with helpful messages
  if (!name) return res.status(400).json({ error: "Missing full name" });
  if (!email) return res.status(400).json({ error: "Missing email" });
  if (!isValidEmail(email))
    return res.status(400).json({ error: "Invalid email format" });
  if (!inquiry) return res.status(400).json({ error: "Missing inquiry type" });
  if (!message)
    return res.status(400).json({ error: "Missing message / project scope" });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Verify transporter (will throw for auth/connectivity issues)
    await transporter.verify();

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_RECEIVER || process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Inquiry: ${inquiry} — from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "N/A"}\nInquiry: ${inquiry}\n\nMessage:\n${message}`,
      html: `<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<p><strong>Company:</strong> ${company || "N/A"}</p>
<p><strong>Inquiry Type:</strong> ${inquiry}</p>
<br/>
<p><strong>Message:</strong></p>
<p>${(message || "").replace(/\n/g, "<br/>")}</p>`,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent", {
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("SMTP/sendMail error:", {
      message: error && error.message,
      stack: error && error.stack,
    });
    return res
      .status(500)
      .json({ error: "Failed to send email. Server error logged." });
  }
}
