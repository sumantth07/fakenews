const axios = require("axios");

function setCORS(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");
}

function getVerdict(score) {
  if (score >= 80) return "High Credibility";
  if (score >= 60) return "Moderate Credibility";
  if (score >= 40) return "Low Credibility";
  if (score >= 20) return "Very Low Credibility";
  return "Likely Misinformation";
}

function extractKeywords(text, max = 6) {
  const stop = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","are","was","were","be","been","have","has","had","do","does","did","will","would","could","should","may","might","this","that","these","those","it","its","as","up","out","about","into","than","then","so","if","when","there","their","they","we","he","she","i","you","not","also","can","said","says","after","before","just","more","very","even","still","each","such","both","over","while","what","who","how","where","which","been","being","between","through","during"]);
  return text.replace(/[^a-zA-Z\s]/g," ").split(/\s+/).filter(w=>w.length>3&&!stop.has(w.toLowerCase())).slice(0,max).join(" ");
}

const CREDIBLE = ["reuters","bbc","associated press","ap news","npr","guardian","new york times","washington post","bloomberg","the economist","wall street journal","financial times","abc news","cbs news","nbc news","pbs","time","newsweek","the atlantic","politico","al jazeera","france 24","dw news","the independent","sky news"];
const isCredible = name => CREDIBLE.some(o => name.toLowerCase().includes(o));

function analyzeLanguage(text) {
  const evidence = {};
  const sensationalPatterns = [
    /\b(shocking|unbelievable|mind-blowing|jaw-dropping|you won't believe)\b/gi,
    /\b(BREAKING|URGENT|ALERT|EXCLUSIVE|BOMBSHELL)\b/g,
    /\b(secret(ly)?|they don't want you to know|hidden truth|exposed|cover.?up)\b/gi,
    /\b(miracle|cure(s)? cancer|100% effective|guaranteed|doctors hate)\b/gi,
    /\b(wake up|sheeple|mainstream media won't tell you|they're hiding)\b/gi,
  ];
  const conspiracyPatterns = [
    /\b(deep state|new world order|illuminati|shadow government)\b/gi,
    /\b(false flag|crisis actor|staged event|hoax|psyop)\b/gi,
  ];
  const emotionalPatterns = [
    /\b(outrage|disgusting|horrifying|terrifying|appalling|shameful)\b/gi,
    /\b(you must|everyone should|share this now|spread the word)\b/gi,
  ];

  let sensCount=0,consCount=0,emotCount=0;
  const foundSens=[],foundCons=[],foundEmot=[];
  for(const p of sensationalPatterns){const m=text.match(p)||[];sensCount+=m.length;foundSens.push(...m.map(s=>s.toLowerCase()));}
  for(const p of conspiracyPatterns){const m=text.match(p)||[];consCount+=m.length;foundCons.push(...m.map(s=>s.toLowerCase()));}
  for(const p of emotionalPatterns){const m=text.match(p)||[];emotCount+=m.length;foundEmot.push(...m.map(s=>s.toLowerCase()));}

  const words=text.split(/\s+/);
  const capsRatio=words.filter(w=>w.length>3&&w===w.toUpperCase()&&/[A-Z]/.test(w)).length/Math.max(words.length,1);
  const excDensity=(text.match(/!/g)||[]).length/Math.max(words.length,1);
  const hedges=text.match(/\b(allegedly|reportedly|according to|sources say|officials said|experts suggest|studies show|research indicates)\b/gi)||[];
  const attributions=text.match(/\b(said|stated|confirmed|announced|reported|revealed|according to)\b/gi)||[];

  let score=100;
  score-=Math.min(35,sensCount*7);
  score-=Math.min(30,consCount*12);
  score-=Math.min(15,emotCount*5);
  score-=Math.min(20,capsRatio*200);
  score-=Math.min(15,excDensity*300);
  score+=Math.min(12,hedges.length*3);
  score+=Math.min(8,attributions.length*1);
  if(text.length<200)score-=15;
  if(text.length>1000)score+=5;
  score=Math.round(Math.min(100,Math.max(0,score)));

  evidence.sensationalist_phrases=[...new Set(foundSens)];
  evidence.conspiracy_phrases=[...new Set(foundCons)];
  evidence.emotional_manipulation=[...new Set(foundEmot)];
  evidence.caps_ratio=parseFloat(capsRatio.toFixed(3));
  evidence.exclamation_density=parseFloat(excDensity.toFixed(3));
  evidence.hedge_words_found=hedges.map(m=>m.toLowerCase());
  evidence.attribution_count=attributions.length;
  evidence.article_length_chars=text.length;

  return {
    score,
    explanation: score>=80?"Language is neutral and measured. Professional journalistic tone detected.":score>=60?"Mostly neutral with some minor sensationalist elements.":score>=40?"Multiple sensationalist or conspiracy-adjacent phrases detected.":"Heavy sensationalism or conspiracy framing. Very low credibility.",
    evidence
  };
}

async function analyzeSource(text) {
  const evidence={};
  const credPat=[/\b(reuters|associated press|ap news|bbc|npr|pbs|the guardian|al jazeera)\b/gi,/\b(nature\.com|pubmed|ncbi|who\.int|cdc\.gov|nih\.gov|science\.org)\b/gi,/\b(new york times|washington post|wall street journal|the economist|financial times)\b/gi,/\b(university|research center|peer.reviewed|journal of|proceedings of)\b/gi];
  const lowPat=[/\b(naturalnews|infowars|beforeitsnews|worldnewsdailyreport)\b/gi,/\b(anonymous source|can't reveal|our insider|secret whistleblower)\b/gi,/\b(rumor has it|word on the street|i heard that|my friend told me)\b/gi];
  const citePat=[/\b(according to|cited by|published in|sourced from|referenced in)\b/gi,/\bhttps?:\/\/[^\s]+/gi,/\b\d{4}\b.*\b(study|research|report|survey|analysis)\b/gi];

  let credHits=0;const credFound=[];
  let lowHits=0;const lowFound=[];
  let citeHits=0;
  for(const p of credPat){const m=text.match(p)||[];credHits+=m.length;credFound.push(...m.map(s=>s.toLowerCase()));}
  for(const p of lowPat){const m=text.match(p)||[];lowHits+=m.length;lowFound.push(...m.map(s=>s.toLowerCase()));}
  for(const p of citePat)citeHits+=(text.match(p)||[]).length;

  let score=50;
  score+=Math.min(25,credHits*10);
  score+=Math.min(15,citeHits*4);
  score-=Math.min(45,lowHits*15);
  evidence.credible_sources_in_text=[...new Set(credFound)];
  evidence.low_credibility_indicators=[...new Set(lowFound)];
  evidence.citation_count=citeHits;

  try {
    const apiKey=process.env.NEWS_DATA_IO;
    if(apiKey){
      const keywords=extractKeywords(text,4);
      const params=new URLSearchParams({apikey:apiKey,q:keywords,language:"en",size:"5"});
      const res=await axios.get(`https://newsdata.io/api/1/latest?${params}`,{timeout:8000});
      if(res.data.status==="success"){
        const articles=(res.data.results||[]).map(a=>({title:a.title||"",source:a.source_id||"",category:a.category||[],sentiment:a.sentiment||"neutral"}));
        const categories=[...new Set(articles.flatMap(a=>a.category))];
        const sentiments={positive:0,negative:0,neutral:0};
        articles.forEach(a=>{const s=(a.sentiment||"neutral").toLowerCase();sentiments[s in sentiments?s:"neutral"]++;});
        evidence.newsdata_status="success";
        evidence.newsdata_total=res.data.totalResults||0;
        evidence.newsdata_categories=categories;
        evidence.newsdata_sentiments=sentiments;
        evidence.newsdata_articles=articles;
        const total=res.data.totalResults||0;
        if(total>=10)score+=15;else if(total>=5)score+=10;else if(total>=2)score+=5;else if(total===0)score-=10;
        const {positive=0,negative=0,neutral=0}=sentiments;
        const tot=positive+negative+neutral;
        if(tot>0){const nr=neutral/tot;if(nr>=0.6)score+=8;else if(nr>=0.4)score+=4;}
        for(const cat of categories){if(["science","health","technology","world","business"].includes(cat))score+=3;if(["entertainment","politics"].includes(cat))score-=1;}
      }
    }else{evidence.newsdata_status="key not configured";}
  }catch(e){evidence.newsdata_status=`error: ${e.message}`;}

  score=Math.round(Math.min(100,Math.max(0,score)));
  return {score,explanation:score>=80?"Strong source signals. Multiple credible outlets cover this topic.":score>=60?"Moderate source credibility. Some corroborating coverage found.":score>=40?"Limited source attribution. Few news sources cover this claim.":"Weak source signals. No credible outlets found.",evidence};
}

async function analyzeCrossReference(text) {
  const evidence={};
  const datePat=[/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,/\b\d{4}-\d{2}-\d{2}\b/g];
  let dateCount=0;
  for(const p of datePat)dateCount+=(text.match(p)||[]).length;
  const entities=[...new Set(text.match(/\b[A-Z][a-z]+ (?:[A-Z][a-z]+ ?)+/g)||[])].slice(0,15);
  const numeric=text.match(/\b\d+(?:\.\d+)?%|\b\d{1,3}(?:,\d{3})+|\b\d+ (?:million|billion|thousand)\b/gi)||[];
  const vague=text.match(/\b(many people|some say|experts believe|it is said|reportedly|apparently|could be|might be)\b/gi)||[];

  let score=50;
  score+=Math.min(15,dateCount*6);
  score+=Math.min(10,entities.length*1.5);
  score+=Math.min(12,numeric.length*3);
  score-=Math.min(20,vague.length*3);
  evidence.date_count=dateCount;
  evidence.named_entities=entities;
  evidence.numeric_count=numeric.length;
  evidence.vague_count=vague.length;

  try {
    const apiKey=process.env.MEDIA_STACK;
    if(apiKey){
      const keywords=extractKeywords(text,5);
      const params=new URLSearchParams({access_key:apiKey,keywords,languages:"en",limit:"5",sort:"published_desc"});
      const res=await axios.get(`http://api.mediastack.com/v1/news?${params}`,{timeout:8000});
      if(!res.data.error){
        const articles=(res.data.data||[]).map(a=>({title:a.title||"",source:a.source||"Unknown",url:a.url||"",published_at:a.published_at||""}));
        const total=res.data.pagination?.total||0;
        evidence.mediastack_status="success";
        evidence.mediastack_total=total;
        evidence.mediastack_articles=articles;
        if(total>=10)score+=20;else if(total>=5)score+=12;else if(total>=2)score+=6;else if(total===1)score+=2;else score-=10;
        for(const a of articles)if(isCredible(a.source))score+=4;
      }else{evidence.mediastack_status=`error: ${res.data.error.message}`;}
    }else{evidence.mediastack_status="key not configured";}
  }catch(e){evidence.mediastack_status=`error: ${e.message}`;}

  score=Math.round(Math.min(100,Math.max(0,score)));
  return {score,explanation:score>=80?"Strong corroboration. Multiple independent sources cover this story.":score>=60?"Moderate corroboration. Some independent coverage found.":score>=40?"Limited corroboration. Few sources independently verify this.":"No corroborating coverage found.",evidence};
}

async function analyzeFactCheck(text) {
  const evidence={};
  const misinfoPat=[
    /\b(vaccines? (?:cause|causes|caused) autism)\b/gi,
    /\b(5G (?:causes?|spreads?) (?:covid|cancer|radiation))\b/gi,
    /\b(the earth is flat|flat earth)\b/gi,
    /\b(climate change is (?:a hoax|fake|not real))\b/gi,
    /\b(chemtrails)\b/gi,
    /\b(election (?:was|is) (?:stolen|rigged|fraudulent))\b/gi,
    /\b(covid.19 (?:was|is) (?:a hoax|man.made|fake|planned))\b/gi,
    /\b(microchip(?:s|ped)? (?:in|via) (?:vaccine|injection))\b/gi,
    /\b(moon landing (?:was|is) (?:fake|staged|hoax))\b/gi,
    /\b(qanon|pizzagate|adrenochrome)\b/gi,
  ];
  const fcAttr=text.match(/\b(fact.check(?:ed)?|politifact|snopes|factcheck\.org|reuters fact check|ap fact check|verified by|debunked by)\b/gi)||[];
  const expertQuotes=text.match(/\b(dr\.|professor|researcher|scientist|expert)\s+[A-Z][a-z]+/gi)||[];

  let misinfoHits=0;const misinfoFound=[];
  for(const p of misinfoPat){const m=text.match(p)||[];misinfoHits+=m.length;misinfoFound.push(...m.map(s=>s.toLowerCase()));}

  let score=70;
  score-=Math.min(55,misinfoHits*20);
  score+=Math.min(12,fcAttr.length*4);
  score+=Math.min(8,expertQuotes.length*2);
  evidence.misinfo_patterns_matched=[...new Set(misinfoFound)];
  evidence.misinfo_count=misinfoHits;
  evidence.fact_check_attributions=fcAttr.map(m=>m.toLowerCase());
  evidence.expert_quotes_count=expertQuotes.length;

  try {
    const apiKey=process.env.NEWS_API;
    if(apiKey){
      const keywords=extractKeywords(text,5);
      const params=new URLSearchParams({q:keywords,language:"en",sortBy:"relevancy",pageSize:"5",apiKey});
      const res=await axios.get(`https://newsapi.org/v2/everything?${params}`,{timeout:8000});
      if(res.data.status==="ok"){
        const articles=(res.data.articles||[]).map(a=>({title:a.title||"",source:a.source?.name||"Unknown",url:a.url||"",publishedAt:a.publishedAt||""}));
        const credibleCount=articles.filter(a=>isCredible(a.source)).length;
        const total=res.data.totalResults||0;
        evidence.newsapi_status="success";
        evidence.newsapi_total=total;
        evidence.newsapi_credible_count=credibleCount;
        evidence.newsapi_articles=articles;
        if(credibleCount>=3)score+=20;else if(credibleCount===2)score+=13;else if(credibleCount===1)score+=7;
        if(total>=20)score+=10;else if(total>=5)score+=5;else if(total===0)score-=15;
        if(total>=10&&credibleCount===0){score-=10;evidence.newsapi_warning="High volume but zero credible outlets — possible viral misinformation";}
      }
    }else{evidence.newsapi_status="key not configured";}
  }catch(e){evidence.newsapi_status=`error: ${e.message}`;}

  score=Math.round(Math.min(100,Math.max(0,score)));
  return {score,explanation:score>=80?"No known misinfo patterns. Credible outlets confirm coverage.":score>=60?"No explicit misinfo found. Some presence in real news sources.":score>=40?"Some misinfo patterns or lack of credible coverage. Treat with caution.":"Strong misinfo signals. High likelihood of false information.",evidence};
}

function analyzeJournalismStandards(text) {
  const evidence={};
  const sentences=text.split(/[.!?]+/).filter(s=>s.trim().length>10);
  const wordList=text.split(/\s+/).filter(w=>w.length>0);
  const avgWords=wordList.length/Math.max(sentences.length,1);
  const directQuotes=(text.match(/"[^"]{10,150}"/g)||[]).length;
  const bylinePresent=/\b(by [A-Z][a-z]+ [A-Z][a-z]+|staff reporter|correspondent|wire service)\b/i.test(text);
  const perspectives=text.match(/\b(however|on the other hand|critics argue|opponents say|supporters claim|in contrast|meanwhile)\b/gi)||[];
  const sources=text.match(/\b(according to|[A-Z][a-z]+ (?:said|stated|told|confirmed|announced))\b/g)||[];
  const uniqueSources=new Set(sources.map(s=>s.toLowerCase())).size;

  let score=50;
  if(avgWords>=15&&avgWords<=30)score+=10;
  score+=Math.min(15,directQuotes*5);
  if(bylinePresent)score+=10;
  score+=Math.min(10,perspectives.length*3);
  score+=Math.min(10,uniqueSources*2);
  if(sentences.length<3)score-=15;
  if(sentences.length>10)score+=5;
  score=Math.round(Math.min(100,Math.max(0,score)));

  evidence.avg_words_per_sentence=parseFloat(avgWords.toFixed(1));
  evidence.direct_quotes_count=directQuotes;
  evidence.byline_detected=bylinePresent;
  evidence.multiple_perspectives=perspectives.length;
  evidence.unique_source_count=uniqueSources;
  evidence.sentence_count=sentences.length;

  return {score,explanation:score>=80?"Meets professional journalism standards: quotes, attributions, multiple perspectives.":score>=60?"Some journalism standards present but could be more rigorous.":score>=40?"Limited journalism standards. Few quotes or diverse perspectives.":"Does not meet basic journalism standards.",evidence};
}

async function analyzeWithLLM(text) {
  const fallback = {
    score: 0, verdict: "Unavailable", reasoning: "",
    red_flags: [], positive_signals: [], confidence: "none",
    model_used: "none", error: "",
  };

  try {
    const apiKey = process.env.OPEN_ROUTER;
    if (!apiKey) return { ...fallback, error: "OPEN_ROUTER key not configured" };

    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.3-70b-instruct:free",
        temperature: 0.1,
        max_tokens: 600,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are a professional fact-checker. Analyze news articles for misinformation, bias, and credibility. Always respond with ONLY a raw JSON object. No markdown fences. No explanation outside the JSON."
          },
          {
            role: "user",
            content: `Analyze this article for credibility.

Return ONLY this JSON:
{
  "score": <0-100>,
  "verdict": "<High Credibility|Moderate Credibility|Low Credibility|Very Low Credibility|Likely Misinformation>",
  "confidence": "<high|medium|low>",
  "reasoning": "<2-3 sentences>",
  "red_flags": ["<issue1>", "<issue2>"],
  "positive_signals": ["<signal1>", "<signal2>"]
}

Article:
"""
${text.slice(0, 3000)}
"""`
          }
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://fakenews-checker.app",
          "X-Title": "FakeNews Credibility Checker",
        },
        timeout: 15000,
      }
    );

    const rawText = res.data.choices?.[0]?.message?.content || "";
    if (!rawText) return { ...fallback, error: "Empty response from OpenRouter" };

    const cleaned = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else return { ...fallback, error: "JSON parse failed" };
    }

    return {
      score:            Math.round(Math.min(100, Math.max(0, Number(parsed.score) || 50))),
      verdict:          parsed.verdict   || "Unknown",
      confidence:       ["high","medium","low"].includes(parsed.confidence) ? parsed.confidence : "medium",
      reasoning:        parsed.reasoning || "",
      red_flags:        Array.isArray(parsed.red_flags)        ? parsed.red_flags.slice(0, 5)        : [],
      positive_signals: Array.isArray(parsed.positive_signals) ? parsed.positive_signals.slice(0, 5) : [],
      model_used:       res.data.model || "meta-llama/llama-3.3-70b-instruct:free",
      error:            null,
    };

  } catch (e) {
    const msg = e.response?.data?.error?.message || e.message;
    return { ...fallback, error: `OpenRouter error: ${msg}` };
  }
}

function validateInput(body) {
  if(!body||typeof body!=="object")return{valid:false,error:"Body must be JSON."};
  const{text}=body;
  if(!text)return{valid:false,error:"Missing field: 'text'."};
  if(typeof text!=="string")return{valid:false,error:"'text' must be a string."};
  if(text.trim().length<50)return{valid:false,error:`Text too short. Min 50 chars. Got: ${text.trim().length}.`};
  if(text.trim().length>50000)return{valid:false,error:"Text too long. Max 50,000 chars."};
  return{valid:true};
}

module.exports = async function handler(req, res) {
  setCORS(res);
  if(req.method==="OPTIONS")return res.status(204).end();
  if(req.method!=="POST")return res.status(405).json({error:`Method ${req.method} not allowed.`});

  let body=req.body;
  if(typeof body==="string"){try{body=JSON.parse(body);}catch{return res.status(400).json({error:"Invalid JSON body."});}}

  const v=validateInput(body);
  if(!v.valid)return res.status(422).json({error:v.error});

  const text=body.text.trim();
  const startTime=Date.now();

  try {
    const [language,source,cross_reference,fact_check,journalism,llm_analysis]=await Promise.all([
      Promise.resolve(analyzeLanguage(text)),
      analyzeSource(text),
      analyzeCrossReference(text),
      analyzeFactCheck(text),
      Promise.resolve(analyzeJournalismStandards(text)),
      analyzeWithLLM(text),
    ]);

    const breakdown={language,source,cross_reference,fact_check,journalism};
    const rawScore=language.score*0.15+source.score*0.20+cross_reference.score*0.25+fact_check.score*0.25+journalism.score*0.15;
    const score=Math.round(Math.min(100,Math.max(0,rawScore)));
    const verdict=getVerdict(score);
    const elapsed=Date.now()-startTime;

    console.log(`[analyze] score=${score} llm=${llm_analysis.score} time=${elapsed}ms`);
    return res.status(200).json({score,verdict,elapsed_ms:elapsed,llm_analysis,breakdown});
  }catch(err){
    console.error("[analyze] Fatal:",err);
    return res.status(500).json({error:"Internal analysis error."});
  }
};
