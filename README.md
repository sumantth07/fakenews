# FakeNews Credibility Checker

## Quick Start

### 1. Install dependencies
```
npm install
```

### 2. Add your API keys
Edit `.env.local` and fill in your keys:
```
OPENAI_API_KEY=sk-your-key
NEWS_DATA_IO=your-key
MEDIA_STACK=your-key
NEWS_API=your-key
OPEN_ROUTER=your-key
```

### 3. Add your logo
Put your `logo.png` inside `src/assets/`

### 4. Run locally (2 terminals)

Terminal 1 - Backend:
```
node dev-server.js
```

Terminal 2 - Frontend:
```
npm run dev
```

Open http://localhost:5173

---

## Deploy to Vercel

1. Push this folder to GitHub
2. Go to vercel.com → New Project → Import repo
3. Add all env vars in Vercel Dashboard → Settings → Environment Variables
4. Deploy

---

## File Structure
```
fakenews/
├── api/
│   └── analyze.js        ← Node.js backend (auto-deployed by Vercel)
├── src/
│   ├── assets/
│   │   └── logo.png      ← ADD YOUR LOGO HERE
│   ├── components/
│   │   ├── Scanner.jsx
│   │   ├── AnalysisDashboard.jsx
│   │   ├── Hero.jsx
│   │   ├── Footer.jsx
│   │   ├── Architecture.jsx
│   │   └── TrustScore.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── dev-server.js         ← local backend runner
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── .env.local            ← your API keys (never commit this)
```
