/*
  Simple Express dev server to mount the Node API handler during local development.
  - Loads .env.local via dotenv
  - CORS enabled for Vite dev server
  - Mounts POST /api/submit -> src/api/submit.js handler
  Run: `node dev-server.js`
*/
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import submitHandler from "./src/api/submit.js";

dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(
  cors({ origin: process.env.VITE_DEV_ORIGIN || "http://localhost:5175" }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// multer will parse multipart/form-data into req.body
const upload = multer();

app.post("/api/submit", upload.none(), async (req, res) => {
  // The existing handler expects (req, res) similar to express signature
  try {
    await submitHandler(req, res);
  } catch (err) {
    console.error("dev-server handler error", err);
    res.status(500).json({ error: "dev-server internal error" });
  }
});

app.get("/_health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Dev API server running: http://localhost:${PORT}`);
});
