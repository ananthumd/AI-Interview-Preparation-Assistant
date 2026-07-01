# 🎯 AI Interview Preparation Assistant

A full-stack AI-powered mock interview app built with **React + Vite** and the **Anthropic Claude API**.  
Practice technical, behavioral, system design, and HR interviews — with real-time scoring and structured feedback.

---

## ✨ Features

| Feature | Details |
|---|---|
| **AI Question Generation** | Role-aware questions for 10+ job titles across 5 interview types |
| **Live Answer Evaluation** | Scores Relevance, Depth, and Clarity (1–10) after each response |
| **Structured Feedback** | Strengths and improvement suggestions per answer |
| **Voice Input** | Web Speech API (Chrome/Edge) for hands-free answering |
| **Session Progress** | Visual question progress bar and live score tracking |
| **Score Summary** | Running averages with grade labels in the sidebar |
| **Quick Actions** | One-click buttons for hints, ideal answers, rephrasing, and more |
| **Company-specific Mode** | Tailor questions for specific companies (Google, Amazon, etc.) |

---

## 🗂 Project Structure

```
interview-prep/
├── src/
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # React entry point
│   ├── components/
│   │   ├── Sidebar.jsx          # Config panel + score summary
│   │   ├── TopBar.jsx           # Session header + progress bar
│   │   ├── ChatArea.jsx         # Message list + evaluation cards
│   │   ├── InputArea.jsx        # Textarea + voice + quick actions
│   │   └── ScoreSummary.jsx     # Sidebar score breakdown widget
│   ├── hooks/
│   │   ├── useInterview.js      # Core state + API logic
│   │   └── useVoice.js          # Speech recognition hook
│   ├── utils/
│   │   ├── api.js               # Anthropic API client
│   │   ├── prompts.js           # System prompt builder
│   │   └── parser.js            # JSON evaluation parser + score helpers
│   └── styles/
│       └── app.css              # Full stylesheet
├── backend/
│   ├── server.js                # Express proxy (production)
│   └── package.json
├── index.html
├── vite.config.js
├── package.json
├── .env.example                 # Copy to .env and fill in your key
└── .gitignore
```

---

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd interview-prep
npm install
```

### 2. Set up your API key

```bash
cp .env.example .env
```

Open `.env` and add your Anthropic API key:

```env
VITE_ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

Get your key at: https://console.anthropic.com

### 3. Run the dev server

```bash
npm run dev
```

Open http://localhost:5173 and start practicing!

---

## 🔐 Production Setup (Secure API Key)

**Never expose your API key in the browser in production.**  
Use the included Express backend to proxy all API calls:

### Start the backend

```bash
cd backend
npm install
npm start
```

### Update `.env` to point to the proxy

```env
# Comment out or remove VITE_ANTHROPIC_API_KEY
# VITE_ANTHROPIC_API_KEY=...

# Use the backend proxy instead
VITE_API_URL=http://localhost:3001/api/chat
```

### Production `.env` for the backend

```env
# backend/.env (or set as server env vars)
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
PORT=3001
```

---

## 🎙 Voice Input

Voice input uses the browser's built-in Web Speech API — **no third-party service needed**.

- ✅ Works in **Chrome** and **Edge**
- ❌ Not supported in Firefox or Safari
- Click the microphone button to start/stop recording
- Transcription appears live in the text field
- Press Send (or Enter) to submit after speaking

For cross-browser support, you can integrate **OpenAI Whisper** or **AssemblyAI**:

```js
// Example: swap useVoice.js to use Whisper API
const formData = new FormData();
formData.append("file", audioBlob, "audio.webm");
formData.append("model", "whisper-1");

const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
  method: "POST",
  headers: { Authorization: `Bearer ${OPENAI_KEY}` },
  body: formData,
});
const { text } = await response.json();
```

---

## 🧠 How the AI Works

### System Prompt Architecture

The `buildSystemPrompt()` function in `utils/prompts.js` dynamically generates a context-rich prompt:

```
Role: Software Engineer
Type: Technical
Level: Senior
Company: Google
Questions: 5
```

This configures the AI interviewer's persona, question style, and evaluation criteria.

### Structured Evaluation

After each answer, Claude is instructed to return JSON:

```json
{
  "feedback": "Strong explanation of time complexity...",
  "scores": { "relevance": 8, "depth": 7, "clarity": 9 },
  "strengths": "Clear step-by-step reasoning",
  "improve": "Mention edge cases like empty input",
  "next_question": "Now explain space complexity..."
}
```

The `parseEvaluation()` utility extracts this from the response and renders it as the score card UI.

### Conversation Memory

The full message history (`apiMessages[]`) is passed to every API call, giving Claude complete context across the session — it can reference earlier answers and build on them.

---

## 🛠 Customization Guide

### Add a new role

In `Sidebar.jsx`, add to the `ROLES` array:
```js
const ROLES = [
  "Software Engineer",
  "Your New Role",   // ← add here
  ...
];
```

### Change question count limits

In `Sidebar.jsx`, modify `Q_COUNTS`:
```js
const Q_COUNTS = [3, 5, 7, 10, 15]; // ← add 15
```

### Tune scoring behavior

In `utils/prompts.js`, edit the scoring instructions in the system prompt to emphasize different criteria.

### Add a new quick action

In `InputArea.jsx`, add to `QUICK_ACTIONS`:
```js
{ label: "Simpler version", icon: "↓", text: "Can you ask a simpler version of this question?" },
```

---

## 📦 Build for Production

```bash
npm run build        # outputs to dist/
npm run preview      # preview the production build locally
```

Deploy `dist/` to Vercel, Netlify, or any static host. Run the backend on Railway, Render, or a VPS.

---

## 🧰 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite |
| AI | Anthropic Claude (`claude-sonnet-4-6`) |
| Voice | Web Speech API |
| Backend (optional) | Node.js + Express |
| Styling | Plain CSS (no Tailwind dependency) |

---

## 📄 License

MIT — use freely, deploy anywhere, add to your portfolio!
