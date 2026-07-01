/**
 * backend/server.js
 * ─────────────────────────────────────────────────────────────
 * Express proxy server for the AI Interview Prep app.
 * Keeps your Anthropic API key on the server (never exposed to browser).
 *
 * Setup:
 *   cd backend
 *   npm install express cors dotenv node-fetch
 *   node server.js
 *
 * Then set VITE_API_URL=http://localhost:3001/api/chat in your .env
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error("❌  ANTHROPIC_API_KEY is missing. Add it to your .env file.");
  process.exit(1);
}

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173"] }));
app.use(express.json({ limit: "2mb" }));

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Main chat proxy
app.post("/api/chat", async (req, res) => {
  const { model, max_tokens, system, messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-6",
        max_tokens: max_tokens || 1000,
        system,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Anthropic API error:", err);
      return res.status(response.status).json({ error: err?.error?.message || "API error" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅  Backend running at http://localhost:${PORT}`);
  console.log(`   API key: ${ANTHROPIC_API_KEY.slice(0, 12)}...`);
});
