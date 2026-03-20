// Local dev server — run with: node dev-server.js
// This file is NOT deployed to Vercel
require("dotenv").config({ path: ".env.local" });
const express = require("express");
const cors = require("cors");
const handler = require("./api/analyze.js");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.post("/api/analyze", handler);
app.options("/api/analyze", (req, res) => res.status(204).end());

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n✅ Backend running → http://localhost:${PORT}/api/analyze\n`);
  console.log("API Keys status:");
  ["OPENAI_API_KEY","NEWS_DATA_IO","MEDIA_STACK","NEWS_API","OPEN_ROUTER"].forEach(k => {
    console.log(`  ${k.padEnd(20)} ${process.env[k] ? "✅ set" : "❌ missing"}`);
  });
  console.log("\n▶  Now run:  npm run dev  (in a second terminal)\n");
});
