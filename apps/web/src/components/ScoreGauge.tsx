import React, { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  finalScore: number;
  lexicalScore: number;
  semanticScore: number;
  size?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  finalScore,
  lexicalScore,
  semanticScore,
  size = 230
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(start + (finalScore - start) * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [finalScore]);

  const getScoreBand = (score: number) => {
    if (score >= 85) return { label: 'Strong Alignment', color: '#10b981', glow: 'rgba(16, 185, 129, 0.35)', badge: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' };
    if (score >= 70) return { label: 'Moderate Fit', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.35)', badge: 'bg-amber-500/10 border-amber-500/40 text-amber-400' };
    return { label: 'Weak Fit', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.35)', badge: 'bg-rose-500/10 border-rose-500/40 text-rose-400' };
  };

  const band = getScoreBand(finalScore);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const strokeDashoffset = circumference - (animatedScore / 100) * arcLength;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden group">
      
      {/* Background Radial Glow */}
      <div 
        className="absolute -top-16 -left-16 w-52 h-52 rounded-full blur-3xl opacity-25 transition-all duration-700 pointer-events-none"
        style={{ backgroundColor: band.color }}
      />

      {/* SVG Arc Gauge */}
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} viewBox="0 0 200 200" className="transform -rotate-90">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={band.color} stopOpacity="1" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#1e293b"
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={`${arcLength} ${circumference * 0.25}`}
            strokeLinecap="round"
          />

          {/* Glowing Animated Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#glow)"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Center Score Counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            {animatedScore.toFixed(1)}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            ATS Score
          </span>
        </div>
      </div>

      {/* Score Band Badge */}
      <div className={`mt-2 px-4 py-1 rounded-full text-xs font-bold border backdrop-blur-md transition-all shadow-md ${band.badge}`}>
        {band.label}
      </div>

      {/* Contribution Breakdown */}
      <div className="mt-6 w-full space-y-3 pt-4 border-t border-slate-800/80">
        <div>
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-slate-400">Lexical Skill Overlap (60%)</span>
            <span className="font-bold text-teal-300">{lexicalScore.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(lexicalScore, 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-slate-400">Semantic Context Match (40%)</span>
            <span className="font-bold text-indigo-300">{semanticScore.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(semanticScore, 100)}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
};
