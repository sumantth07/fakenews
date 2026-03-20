export function TrustScore({ score }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  // Determine color based on score
  const getColor = () => {
    if (score >= 70) return { from: '#10b981', to: '#059669' }; // emerald
    if (score >= 50) return { from: '#f59e0b', to: '#d97706' }; // amber
    return { from: '#ef4444', to: '#dc2626' }; // red
  };

  const colors = getColor();

  return (
    <div className="relative w-56 h-56">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(51, 65, 85, 0.5)"
          strokeWidth="16"
        />
        
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
          
          {/* Glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          filter="url(#glow)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-bold text-white">{score}%</div>
        <div className="text-sm text-slate-400 mt-1 uppercase tracking-wider">Trust Score</div>
      </div>

      {/* Decorative rings */}
      <div className="absolute inset-0 rounded-full border border-slate-700/30 animate-ping" style={{ animationDuration: '3s' }}></div>
    </div>
  );
}
