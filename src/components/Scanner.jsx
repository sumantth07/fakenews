import { FileText, Clock, Shield, ArrowRight, Activity } from 'lucide-react';
import { useState } from 'react';

const API_URL = "/api/analyze";

export function Scanner({ onResult }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExecute = async () => {
    if (input.trim().length < 50) { setError('Please enter at least 50 characters.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
      onResult(data);
      document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      setError(err.message || 'Analysis failed. Check your connection and try again.');
    } finally { setLoading(false); }
  };

  return (
    <section id="scanner-section" className="relative px-6 py-32 bg-black font-['Space_Grotesk'] antialiased">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-500 mb-4">
              <Activity className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Input Terminal</span>
            </div>
            <h2 className="text-5xl font-medium text-white tracking-tight">Scan Article</h2>
          </div>
          <p className="text-slate-500 max-w-[280px] text-sm leading-relaxed border-l border-slate-800 pl-4">
            Initialize cryptographic and linguistic analysis on source data.
          </p>
        </div>

        <div className="bg-[#0f1115] border border-slate-800 rounded-none overflow-hidden">
          <div className="flex border-b border-slate-800">
            <div className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white text-black text-[11px] font-bold tracking-[0.2em]">
              <FileText className="w-4 h-4" />RAW TEXT INPUT
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-8">
            <div className="relative group">
              <div className="absolute top-0 left-0 w-[2px] h-full bg-slate-800 group-focus-within:bg-emerald-500 transition-colors" />
              <textarea value={input} onChange={e => setInput(e.target.value)}
                placeholder="INPUT_RAW_DATA: Paste article content here for linguistic auditing..."
                className="w-full pl-8 pr-6 py-6 bg-transparent text-white placeholder:text-slate-700 focus:outline-none text-lg font-light tracking-wide min-h-[220px] resize-none" />
            </div>
            <div className="flex justify-end">
              <span className={`text-[10px] font-mono ${input.length>=50?'text-emerald-600':'text-slate-700'}`}>
                {input.length} chars {input.length<50?`(${50-input.length} more needed)`:'✓'}
              </span>
            </div>
            {error && <p className="text-red-500 text-xs uppercase tracking-widest border border-red-900/30 bg-red-950/20 px-4 py-3">⚠ {error}</p>}
            <div className="flex flex-col md:flex-row gap-4">
              <button onClick={handleExecute} disabled={loading||input.trim().length<50}
                className="flex-1 group relative flex items-center justify-center gap-3 py-6 bg-white text-black font-bold text-sm tracking-[0.2em] uppercase hover:bg-emerald-500 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
                <Shield className="w-4 h-4" />
                {loading?"Analyzing...":"Execute Verification"}
                {!loading&&<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </div>

          <div className="px-8 py-4 bg-black/50 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Clock className="w-3 h-3" />
                <span className="uppercase tracking-widest">{loading?"Processing...":"Awaiting Input"}</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-500">
                <div className={`w-1 h-1 rounded-full ${loading?'bg-yellow-500 animate-pulse':'bg-emerald-500'}`} />
                <span className="uppercase tracking-widest">{loading?"6 Modules Running":"Encrypted Tunnel Active"}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-700">v5.0.0-NODE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
