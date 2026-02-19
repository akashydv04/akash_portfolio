import submitHandler from "../src/api/submit.js";

// Minimal Vercel function wrapper: forward requests to the existing handler
export default async function handler(req, res) {
  try {
    await submitHandler(req, res);
  } catch (err) {
    console.error("Wrapper handler error:", err && err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
