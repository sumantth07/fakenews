import React from 'react';
import { Globe, Brain, Database, Target, ArrowRight, Layers, Cpu, ShieldCheck,BarChart3 } from 'lucide-react';

/**
 * High-Grade System Architecture
 * Font: Space Grotesk
 * Aesthetic: Technical, Minimalist, Precision-Engineered
 */
export function Architecture() {
  const steps = [
    {
      icon: Globe,
      title: "Ingestion",
      subtitle: "Data Extraction",
      description:
        "Article text submitted via POST request. Keywords extracted and dispatched in parallel to 3 live news APIs.",
      tag: "HTTPS/POST",
    },
    {
      icon: BarChart3,
      title: "Language",
      subtitle: "Linguistic Risk",
      description:
        "Rule-based NLP scan for sensationalist phrases, ALL-CAPS density, exclamation abuse, and conspiracy framing patterns.",
      tag: "RULE-BASED",
    },
    {
      icon: Database,
      title: "Validation",
      subtitle: "3-API Cross-Reference",
      description:
        "Claim corroborated across MediaStack (7,500+ sources), NewsData.io (84,000+ sources), and NewsAPI (150,000+ sources).",
      tag: "API-SYNC",
    },
    {
      icon: Brain,
      title: "AI Reasoning",
      subtitle: "LLM Analysis",
      description:
        "Independent credibility verdict from a free OpenRouter LLM — catches nuanced bias and framing rules cannot detect.",
      tag: "LLM-FREE",
    },
    {
      icon: Target,
      title: "Synthesis",
      subtitle: "Weighted Scoring",
      description:
        "LLM (30%) + Cross-Reference (25%) + Source (20%) + Fact-Check (15%) + Language (10%) combined into a final trust score.",
      tag: "RESULT",
    },
    
  ];

  return (
    <section id="architecture-section" className="relative px-6 py-32 bg-black font-['Space_Grotesk'] antialiased overflow-hidden">
      {/* Structural Background Element */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-24">
          <div className="inline-flex items-center gap-2 border border-slate-800 px-3 py-1 rounded-full mb-6">
            <Layers className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500">Processing Pipeline</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-medium text-white tracking-tight mb-6">
            System Architecture
          </h2>
          <div className="h-[2px] w-24 bg-emerald-500 mb-8"></div>
          <p className="max-w-2xl text-slate-400 text-lg leading-relaxed">
            A linear four-stage verification protocol engineered for high-fidelity 
            content analysis and automated truth-state determination.
          </p>
        </div>

        {/* Pipeline Flow */}
        <div className="relative">
          {/* Subtle Background Connector Line */}
          <div className="hidden lg:block absolute top-[45px] left-0 right-0 h-[1px] bg-slate-800 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col">
                {/* Header/Icon Area */}
                <div className="flex items-center mb-8">
                  <div className="w-24 h-24 bg-[#0a0a0a] border border-slate-800 flex items-center justify-center relative group-hover:border-slate-600 transition-colors">
                    <step.icon className="w-8 h-8 text-white" />
                    {/* Stage Number Badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black flex items-center justify-center text-[10px] font-bold">
                      0{index + 1}
                    </div>
                  </div>
                  {index !== steps.length - 1 && (
                    <div className="hidden lg:flex flex-1 justify-center">
                      <ArrowRight className="w-4 h-4 text-slate-700" />
                    </div>
                  )}
                </div>

                {/* Content Card */}
                <div className="bg-[#0f1115] border border-slate-800 p-8 h-full flex flex-col justify-between hover:bg-[#16191f] transition-all duration-300">
                  <div>
                    <div className="text-[10px] font-bold text-emerald-500 tracking-[0.2em] uppercase mb-2">
                      {step.subtitle}
                    </div>
                    <h3 className="text-2xl font-medium text-white mb-4 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-8">
                      {step.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                    <span className="text-[10px] font-mono text-slate-600">{step.tag}</span>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`w-1 h-1 rounded-full ${i <= index ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specifications Bar */}
        <div className="mt-24 pt-12 border-t border-slate-900 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Cpu className="w-5 h-5 text-slate-700" />
            <span className="text-xs font-bold tracking-widest text-slate-600 uppercase">Tech Stack Integrity</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {['React Framework', 'OpenAI Neural Engine', 'Linguistic Heuristics', 'Truth-API v2'].map((tech) => (
              <div key={tech} className="flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-emerald-900" />
                <span className="text-xs text-slate-400 font-medium">{tech}</span>
              </div>
            ))}
          </div>

          <div className="text-[10px] font-mono text-slate-700">
            SYSTEM_STATUS: <span className="text-emerald-500">OPERATIONAL</span>
          </div>
        </div>
      </div>
    </section>
  );
}