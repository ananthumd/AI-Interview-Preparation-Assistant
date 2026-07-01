const API_URL = import.meta.env.VITE_API_URL || "https://api.anthropic.com/v1/messages";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

/**
 * Call the Claude API directly (dev only) or via your backend proxy.
 * In production, set VITE_API_URL to your backend endpoint to keep the API key secret.
 */
export async function callClaude(systemPrompt, messages) {
  const headers = { "Content-Type": "application/json" };

  // Direct browser call (dev only — never expose key in production)
  if (API_KEY) headers["x-api-key"] = API_KEY;

  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: systemPrompt,
    messages,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  // Handle both direct Anthropic response and proxied response
  return data.content?.[0]?.text || data.reply || "";
}
