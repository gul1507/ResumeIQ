import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle, AlertCircle, TrendingUp, HelpCircle, Activity, Target } from 'lucide-react';

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
  size = 250
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Snappy cubic deceleration
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
        label: 'Tier 1 • High Target Alignment',
        color: '#00F5A0',
        strokeGradient: 'url(#emeraldRadarGradient)',
        glowColor: 'rgba(0, 245, 160, 0.28)',
        badgeClass: 'bg-[#00F5A0]/10 border-[#00F5A0]/30 text-[#00F5A0] shadow-[0_0_12px_rgba(0,245,160,0.15)]'
      };
    }
    if (score >= 55) {
      return {
        label: 'Tier 2 • Moderate Alignment',
        color: '#FFA133',
        strokeGradient: 'url(#amberFlameGradient)',
        glowColor: 'rgba(255, 161, 51, 0.28)',
        badgeClass: 'bg-[#FFA133]/10 border-[#FFA133]/30 text-[#FFA133] shadow-[0_0_12px_rgba(255,161,51,0.15)]'
      };
    }
    return {
      label: 'Tier 3 • Critical Skill Gaps',
      color: '#FF2E63',
      strokeGradient: 'url(#crimsonSignalGradient)',
      glowColor: 'rgba(255, 46, 99, 0.28)',
      badgeClass: 'bg-[#FF2E63]/10 border-[#FF2E63]/30 text-[#FF2E63] shadow-[0_0_12px_rgba(255,46,99,0.15)]'
    };
  };

  const band = getScoreBand(finalScore);

  // SVG Gauge calculations
  const radius = 80;
  const strokeWidth = 11;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const arcPercentage = 0.72;
  const arcLength = circumference * arcPercentage;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, animatedScore)) / 100) * arcLength;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-[#0B1019]/80 border border-white/[0.09] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] overflow-hidden group">
      
      {/* Background Reticle Ambient Glow */}
      <div 
        className="absolute -top-10 inset-x-0 h-44 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: band.color }}
      />

      {/* Header Telemetry Label */}
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-[#FF5C00]" />
          ATS Hybrid Diagnostic
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300">
          <Activity className="h-3 w-3 text-[#00C9FF]" />
          Gemini + NER
        </span>
      </div>

      {/* SVG Arc Gauge with Precision Radar Ring */}
      <div className="relative flex items-center justify-center my-1">
        <svg 
          width={size} 
          height={size - 30} 
          viewBox="0 0 200 180" 
          className="transform"
        >
          <defs>
            {/* Emerald Radar Gradient */}
            <linearGradient id="emeraldRadarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00C9FF" />
              <stop offset="60%" stopColor="#00F5A0" />
              <stop offset="100%" stopColor="#10E773" />
            </linearGradient>

            {/* Amber Flame Gradient */}
            <linearGradient id="amberFlameGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF5C00" />
              <stop offset="70%" stopColor="#FFA133" />
              <stop offset="100%" stopColor="#FFC837" />
            </linearGradient>

            {/* Crimson Signal Gradient */}
            <linearGradient id="crimsonSignalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF5C00" />
              <stop offset="60%" stopColor="#FF2E63" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>

            {/* Subtle Arc Drop Glow */}
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Precision Outer Reticle Ring */}
          <circle
            cx="100"
            cy="105"
            r={radius + 6}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            strokeDasharray="2 6"
            fill="transparent"
            transform="rotate(140 100 105)"
          />

          {/* Background Track Arc */}
          <circle
            cx="100"
            cy="105"
            r={normalizedRadius}
            stroke="#101726"
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
            <span className="font-mono text-5xl font-extrabold tracking-tight text-white drop-shadow-lg">
              {animatedScore.toFixed(1)}
            </span>
            <span className="text-sm font-semibold text-slate-400 font-mono">%</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-0.5">
            Compatibility Score
          </span>
        </div>
      </div>

      {/* Alignment Band Pill */}
      <div className={`mt-1 px-4 py-1 rounded-full text-xs font-semibold border backdrop-blur-md transition-all shadow-sm ${band.badgeClass}`}>
        {band.label}
      </div>

      {/* Sub-Score Breakdown Bars */}
      <div className="mt-6 w-full space-y-3.5 pt-4 border-t border-white/[0.08]">
        
        {/* Metric 1: Normalized Lexical Overlap */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-slate-300 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C9FF] shadow-[0_0_6px_#00C9FF]" />
              Skill Lexical Overlap (60%)
            </span>
            <span className="font-mono font-bold text-[#00C9FF]">{lexicalScore.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-[#05070B] rounded-full overflow-hidden p-0.5 border border-white/[0.08]">
            <div 
              className="h-full bg-gradient-to-r from-[#00C9FF] to-[#00F5A0] rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,201,255,0.4)]" 
              style={{ width: `${Math.min(lexicalScore, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Gemini Vector Semantic Score */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-slate-300 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C00] shadow-[0_0_6px_#FF5C00]" />
              Semantic Embedding Cosine (40%)
            </span>
            <span className="font-mono font-bold text-[#FFA133]">{semanticScore.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-[#05070B] rounded-full overflow-hidden p-0.5 border border-white/[0.08]">
            <div 
              className="h-full bg-gradient-to-r from-[#FF5C00] to-[#FFA133] rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,92,0,0.4)]" 
              style={{ width: `${Math.min(semanticScore, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Experience Matrix Alignment */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-medium">
            <span className="text-slate-300 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00F5A0] shadow-[0_0_6px_#00F5A0]" />
              Seniority & Level Alignment
            </span>
            <span className="font-mono font-bold text-[#00F5A0]">{experienceScore.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full bg-[#05070B] rounded-full overflow-hidden p-0.5 border border-white/[0.08]">
            <div 
              className="h-full bg-gradient-to-r from-[#00F5A0] to-[#10E773] rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,245,160,0.4)]" 
              style={{ width: `${Math.min(experienceScore, 100)}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
