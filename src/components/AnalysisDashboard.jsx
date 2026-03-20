import React, { useMemo } from "react";
import { TrustScore } from "./TrustScore";
import { BarChart3, CheckCircle2, Globe, ShieldCheck, Zap, Search, ArrowUpRight, Brain, AlertTriangle, ThumbsUp } from "lucide-react";

export function AnalysisDashboard({ result }) {
  const auditId = useMemo(() => {
    if (!result) return "—";
    const seed = `${result?.verdict ?? ""}|${result?.score ?? ""}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
    return String(Math.abs(hash)).slice(-8).padStart(8, "0");
  }, [result]);

  const score       = result?.score ?? 0;
  const sourceScore = result?.breakdown?.source?.score ?? 0;
  const langScore   = result?.breakdown?.language?.score ?? 0;
  const crossScore  = result?.breakdown?.cross_reference?.score ?? 0;
  const factScore   = result?.breakdown?.fact_check?.score ?? 0;
  const jourScore   = result?.breakdown?.journalism?.score ?? 0;
  const verdict     = result?.verdict ?? "—";
  const langExplain   = result?.breakdown?.language?.explanation ?? "Awaiting analysis...";
  const sourceExplain = result?.breakdown?.source?.explanation ?? "Awaiting analysis...";
  const factExplain   = result?.breakdown?.fact_check?.explanation ?? "Awaiting analysis...";
  const elapsedMs   = result?.elapsed_ms;

  const llm           = result?.llm_analysis;
  const llmScore      = llm?.score ?? 0;
  const llmVerdict    = llm?.verdict ?? "Awaiting...";
  const llmReasoning  = llm?.reasoning ?? "No analysis yet.";
  const llmRedFlags   = llm?.red_flags ?? [];
  const llmPositive   = llm?.positive_signals ?? [];
  const llmConfidence = llm?.confidence ?? "—";
  const llmModel      = llm?.model_used ?? "—";
  const llmError      = llm?.error;

  const factPassed   = factScore >= 60;
  const crossDisplay = String(Math.round(crossScore / 10)).padStart(2, "0");
  const sourceColor  = sourceScore>=70?"bg-emerald-500":sourceScore>=40?"bg-yellow-500":"bg-red-500";
  const langLabel    = langScore>=80?"Neutral / Factual":langScore>=60?"Mild Risk Detected":langScore>=40?"Exaggerated Content":"High Risk Language";
  const langColor    = langScore>=80?"text-emerald-500":langScore>=60?"text-blue-400":langScore>=40?"text-yellow-500":"text-red-500";
  const llmScoreColor= llmScore>=80?"text-emerald-400":llmScore>=60?"text-yellow-400":llmScore>=40?"text-orange-400":"text-red-400";
  const confidenceBadge = llmConfidence==="high"?"bg-emerald-500/10 text-emerald-400 border-emerald-500/20":llmConfidence==="medium"?"bg-yellow-500/10 text-yellow-400 border-yellow-500/20":"bg-slate-500/10 text-slate-400 border-slate-500/20";

  return (
    <section id="dashboard-section" className="px-6 py-24 bg-black font-['Space_Grotesk'] antialiased">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-800 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">Verification Engine v5.0</span>
            </div>
            <h2 className="text-5xl font-medium text-white tracking-tight">Analysis Dashboard</h2>
          </div>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            Multi-layer credibility assessment: 5 analytical modules + OpenAI GPT-4o-mini reasoning across 150,000+ live sources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          {/* Trust Score */}
          <div className="md:col-span-12 lg:col-span-4 bg-[#0f1115] border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Trust Score</h3>
                <Zap className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex flex-col items-center py-4">
                <TrustScore score={score} />
                <div className="mt-8 text-center">
                  <span className="text-4xl font-light text-white">{score.toFixed(1)}</span>
                  <span className="text-slate-500 ml-1">/100</span>
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-slate-800/50 pb-2">
                <span className="text-slate-500 uppercase tracking-tighter">Verdict</span>
                <span className="text-emerald-400 font-bold uppercase tracking-wider">{verdict}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-800/50 pb-2">
                <span className="text-slate-500 uppercase tracking-tighter">Status</span>
                <span className="text-white font-medium">{result?"Complete":"Awaiting Input"}</span>
              </div>
              {elapsedMs && (
                <div className="flex justify-between items-center text-xs border-b border-slate-800/50 pb-2">
                  <span className="text-slate-500 uppercase tracking-tighter">Analysis Time</span>
                  <span className="text-slate-300 font-mono">{(elapsedMs/1000).toFixed(1)}s</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[{label:"Lang",val:langScore},{label:"Source",val:sourceScore},{label:"Cross",val:crossScore},{label:"Fact",val:factScore},{label:"Journ",val:jourScore},{label:"AI",val:llmScore}].map(({label,val})=>(
                  <div key={label} className="bg-slate-900/50 rounded p-2">
                    <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-1">{label}</div>
                    <div className={`text-sm font-bold ${val>=70?"text-emerald-400":val>=40?"text-yellow-400":"text-red-400"}`}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source */}
            <div className="bg-[#0f1115] border border-slate-800 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-slate-400" /><h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Source Authority</h3></div>
                <ArrowUpRight className="w-4 h-4 text-slate-600" />
              </div>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs mb-2"><span className="text-slate-300">SOURCE SCORE</span><span className="text-emerald-500 font-bold">{sourceScore} / 100</span></div>
                  <div className="h-[2px] bg-slate-800 w-full"><div className={`h-full ${sourceColor} transition-all duration-700`} style={{width:`${sourceScore}%`}} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2"><span className="text-slate-300">CREDIBILITY SIGNAL</span><span className="text-white font-bold">{sourceScore>=70?"STRONG":sourceScore>=40?"MODERATE":"WEAK"}</span></div>
                  <div className="h-[2px] bg-slate-800 w-full"><div className={`h-full ${sourceColor} transition-all duration-700`} style={{width:`${sourceScore}%`}} /></div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{sourceExplain}</p>
              </div>
            </div>

            {/* Language */}
            <div className="bg-[#0f1115] border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4 text-slate-400" /><h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Linguistic Risk</h3></div>
              </div>
              <div className="py-2">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-widest">Sentiment Detected</div>
                <div className={`text-2xl font-medium tracking-tight underline underline-offset-8 ${langColor}`}>{langLabel}</div>
                <p className="mt-6 text-xs text-slate-400 leading-relaxed">{langExplain}</p>
              </div>
            </div>

            {/* Cross Reference */}
            <div className="bg-[#0f1115] border border-slate-800 p-6 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-6"><Search className="w-4 h-4 text-slate-400" /><h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Cross-Reference</h3></div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-light text-white">{crossDisplay}</span>
                <span className="text-slate-600 text-xl font-light">/ 10</span>
              </div>
              <div className="mt-4 text-[10px] text-slate-500 uppercase tracking-[0.2em]">Consensus via Independent Nodes</div>
            </div>

            {/* Fact Check */}
            <div className="bg-[#0f1115] border border-slate-800 p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2"><CheckCircle2 className={`w-4 h-4 ${factPassed?"text-emerald-500":"text-red-500"}`} /><h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Validation</h3></div>
              </div>
              <div className={`py-3 px-4 flex justify-between items-center border ${factPassed?"bg-emerald-500/5 border-emerald-500/20":"bg-red-500/5 border-red-500/20"}`}>
                <span className={`text-xs font-bold tracking-widest uppercase ${factPassed?"text-emerald-500":"text-red-500"}`}>Verified Status</span>
                <span className={`text-xs font-bold ${factPassed?"text-emerald-500":"text-red-500"}`}>{factPassed?"PASSED":"FLAGGED"}</span>
              </div>
              <div className="mt-4 text-xs text-slate-400">{factExplain}</div>
            </div>
          </div>
        </div>

        {/* LLM Panel */}
        <div className="bg-[#0f1115] border border-slate-700 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">AI Reasoning Layer</h3>
              <span className="text-[10px] text-violet-400 border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 rounded-full tracking-widest uppercase">Independent Analysis</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[10px] font-mono text-slate-500 border border-slate-800 px-2 py-1">MODEL: {llmModel}</span>
              <span className={`text-[10px] font-bold tracking-widest uppercase border px-2 py-1 ${confidenceBadge}`}>CONFIDENCE: {llmConfidence}</span>
            </div>
          </div>

          {llmError && !llm?.score ? (
            <div className="border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-500">LLM analysis unavailable: {llmError}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-3 flex flex-col justify-between">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">AI Score</div>
                <div className={`text-6xl font-light ${llmScoreColor}`}>{llmScore}</div>
                <div className="text-[10px] text-slate-600 uppercase tracking-widest mt-2">/100</div>
                <div className={`mt-4 text-xs font-bold uppercase tracking-wider ${llmScoreColor}`}>{llmVerdict}</div>
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">vs Algorithmic</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{score}</span>
                    <span className="text-slate-700">→</span>
                    <span className={`text-xs font-mono ${llmScoreColor}`}>{llmScore}</span>
                    <span className={`text-[10px] ${Math.abs(score-llmScore)<=10?"text-emerald-600":"text-yellow-600"}`}>{Math.abs(score-llmScore)<=10?"ALIGNED":"DIVERGED"}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 border-l border-slate-800 pl-6">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-3">AI Reasoning</div>
                <p className="text-sm text-slate-300 leading-relaxed">{llmReasoning||"No reasoning provided."}</p>
              </div>

              <div className="md:col-span-5 border-l border-slate-800 pl-6 grid grid-cols-1 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-3 h-3 text-red-500" /><span className="text-xs text-slate-500 uppercase tracking-widest">Red Flags</span></div>
                  {llmRedFlags.length===0?<p className="text-xs text-slate-600 italic">None detected</p>:(
                    <div className="space-y-2">{llmRedFlags.map((flag,i)=>(
                      <div key={i} className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" /><span className="text-xs text-slate-400 leading-relaxed">{flag}</span></div>
                    ))}</div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3"><ThumbsUp className="w-3 h-3 text-emerald-500" /><span className="text-xs text-slate-500 uppercase tracking-widest">Positive Signals</span></div>
                  {llmPositive.length===0?<p className="text-xs text-slate-600 italic">None detected</p>:(
                    <div className="space-y-2">{llmPositive.map((sig,i)=>(
                      <div key={i} className="flex items-start gap-2"><div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" /><span className="text-xs text-slate-400 leading-relaxed">{sig}</span></div>
                    ))}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between items-center text-[10px] text-slate-700 uppercase tracking-[0.3em]">
          <span>Audit ID: {auditId}</span>
          <span>5 Modules · OpenAI GPT-4o-mini · Node.js — 2026</span>
        </div>
      </div>
    </section>
  );
}
