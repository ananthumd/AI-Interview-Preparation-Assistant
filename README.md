 Project Structure

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
### install

```bash
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

