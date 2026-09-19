import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, AlertCircle, TrendingUp, HelpCircle } from 'lucide-react';

interface ScoreGaugeProps {
  finalScore: number;
  lexicalScore: number;
  semanticScore: number;
  experienceScore?: number;
  size?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  finalScore,
  lexicalScore,
  semanticScore,
  experienceScore = Math.min(100, Math.round((lexicalScore * 0.5 + semanticScore * 0.5) * 10) / 10),
  size = 240
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo curve for snappy finish
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setAnimatedScore(start + (finalScore - start) * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [finalScore]);

  const getScoreBand = (score: number) => {
    if (score >= 80) {
      return {
        label: 'Tier 1 Strong Alignment',
        color: '#10b981',
        strokeGradient: 'url(#emeraldGradient)',
        glowColor: 'rgba(16, 185, 129, 0.25)',
        badgeClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
      };
    }
    if (score >= 55) {
      return {
        label: 'Tier 2 Moderate Fit',
        color: '#f59e0b',
        strokeGradient: 'url(#amberGradient)',
        glowColor: 'rgba(245, 158, 11, 0.25)',
        badgeClass: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
      };
    }
    return {
      label: 'Tier 3 Critical Gaps',
      color: '#f43f5e',
      strokeGradient: 'url(#crimsonGradient)',
      glowColor: 'rgba(244, 63, 94, 0.25)',
      badgeClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
    };
  };

  const band = getScoreBand(finalScore);

  // SVG Gauge calculations (semi-circle / 260 degree arc)
  const radius = 78;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Arc spans 260 degrees (leaving a 100 degree gap at bottom)
  const arcPercentage = 0.72;
  const arcLength = circumference * arcPercentage;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, animatedScore)) / 100) * arcLength;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-obsidian-900 border border-white/[0.08] rounded-2xl shadow-card-lift overflow-hidden group">
      
      {/* Background Radial Glow */}
      <div 
        className="absolute -top-12 inset-x-0 h-44 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: band.color }}
      />

      {/* Header Micro-label */}
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Match Diagnostic
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-400">
          <TrendingUp className="h-3 w-3 text-indigo-400" />
          Hybrid v2.4
        </span>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative flex items-center justify-center my-2">
        <svg 
          width={size} 
          height={size - 25} 
          viewBox="0 0 200 180" 
          className="transform"
        >
          <defs>
            {/* Emerald Gradient */}
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            {/* Amber Gradient */}
            <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>

            {/* Crimson Gradient */}
            <linearGradient id="crimsonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Arc */}
          <circle
            cx="100"
            cy="105"
            r={normalizedRadius}
            stroke="#151D30"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(140 100 105)"
          />

          {/* Active Animated Arc */}
          <circle
            cx="100"
            cy="105"
            r={normalizedRadius}
            stroke={band.strokeGradient}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(140 100 105)"
            filter="url(#gaugeGlow)"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Center Score Counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 text-center pointer-events-none">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
              {animatedScore.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-slate-400 font-mono">%</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            Composite ATS Score
          </span>
        </div>
      </div>

      {/* Alignment Band Pill */}
      <div className={`mt-1 px-3.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md transition-all shadow-sm ${band.badgeClass}`}>
        {band.label}
      </div>

      {/* Sub-Score Breakdown Bars */}
      <div className="mt-6 w-full space-y-3 pt-4 border-t border-white/[0.08]">
        
        {/* Metric 1: Required Skills Density */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Required Skills Density (40%)
            </span>
            <span className="font-mono font-bold text-cyan-300">{lexicalScore.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full bg-obsidian-950 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(lexicalScore, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Semantic Relevance */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Semantic Relevance (40%)
            </span>
            <span className="font-mono font-bold text-indigo-300">{semanticScore.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full bg-obsidian-950 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(semanticScore, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Experience Alignment */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Experience Alignment (20%)
            </span>
            <span className="font-mono font-bold text-emerald-300">{experienceScore.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 w-full bg-obsidian-950 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(experienceScore, 100)}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
