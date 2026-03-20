import { ArrowRight, Sparkles } from "lucide-react";
import logo from "../assets/logo.png";

export function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Professional offset for fixed navbars
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
        block: 'center',
      });
    }
  };
  return (
    <section className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-20 overflow-hidden bg-black text-white">

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Soft Background Orbs */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto w-full relative z-10 py-20">
        {/* RESPONSIVE GRID - Left content, Right image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-8 lg:space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300 tracking-wide">
                AI-POWERED VERIFICATION
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                <span className="block text-white"> News</span>
                <span className="block mt-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                 Credibilitizer
                </span>
              </h1>

              <p className="text-lg md:text-xl text-zinc-400 max-w-lg leading-relaxed">
                Stop guessing. Get an instant credibility score based on source
                provenance, emotional bias, and cross-reference verification.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => scrollToSection('scanner-section')} className="group px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  Start Analyzing
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button onClick={() => scrollToSection('architecture-section')} className="px-8 py-4 border border-zinc-700 text-white font-semibold rounded-full hover:bg-zinc-900 hover:border-zinc-600 transition-all duration-300">
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-6 border-t border-zinc-800">
              <div>
                <div className="text-2xl font-bold text-white">99.2%</div>
                <div className="text-sm text-zinc-500">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">10M+</div>
                <div className="text-sm text-zinc-500">Articles Verified</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">Real-time</div>
                <div className="text-sm text-zinc-500">Analysis</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg">
              <img
               src={logo}
                alt="News credibility preview"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}