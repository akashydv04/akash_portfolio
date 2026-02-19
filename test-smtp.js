import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: ".env.local" });

async function test() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log("SMTP verify: OK");
  } catch (err) {
    console.error("SMTP verify failed:", err && err.message);
    process.exitCode = 2;
  }
}

test();
