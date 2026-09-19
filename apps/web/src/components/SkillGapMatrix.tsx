import React, { useState } from 'react';
import { SkillGap } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Zap, 
  Info, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';

interface SkillGapMatrixProps {
  matchedSkills: string[];
  missingSkills: string[];
  skillGaps: SkillGap[];
  onTailorClick?: () => void;
}

export const SkillGapMatrix: React.FC<SkillGapMatrixProps> = ({
  matchedSkills,
  missingSkills,
  skillGaps,
  onTailorClick
}) => {
  const [selectedSkillTip, setSelectedSkillTip] = useState<{
    skill: string;
    type: 'matched' | 'missing';
    impact: string;
    suggestion: string;
  } | null>(null);

  const handleChipClick = (skill: string, type: 'matched' | 'missing') => {
    const gapInfo = skillGaps.find(g => g.skill.toLowerCase() === skill.toLowerCase());
    if (type === 'matched') {
      setSelectedSkillTip({
        skill,
        type: 'matched',
        impact: '+8.5% ATS Boost',
        suggestion: gapInfo?.suggestionText || `Candidate resume contains direct, contextual verification of ${skill}.`
      });
    } else {
      setSelectedSkillTip({
        skill,
        type: 'missing',
        impact: '-12.0% Requisition Penalty',
        suggestion: gapInfo?.suggestionText || `Recruiter job description lists ${skill} as a key requirement. Consider highlighting equivalent projects or rephrasing related bullet points.`
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* High-End Action Banner for Candidates */}
      {missingSkills.length > 0 && onTailorClick && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/70 via-obsidian-900 to-obsidian-900 border border-indigo-500/30 p-5 shadow-card-lift">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-glow-indigo shrink-0">
                <Zap className="h-5 w-5 fill-indigo-400/30" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-bold text-white text-sm">
                    Rephrase Experience for {missingSkills.length} Missing Keywords
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AI Studio
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                  Generate contextually grounded bullet revisions incorporating missing technical terms without falsifying past roles or credentials.
                </p>
              </div>
            </div>

            <button
              onClick={onTailorClick}
              className="w-full sm:w-auto px-4 py-2.5 btn-primary-glow text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 group active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4 text-indigo-200" />
              <span>Launch AI Tailoring Studio</span>
              <ArrowRight className="h-3.5 w-3.5 text-indigo-200 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Interactive Chip Details Modal / Popover */}
      {selectedSkillTip && (
        <div className="p-4 rounded-xl bg-obsidian-850 border border-white/[0.12] shadow-2xl relative animate-in fade-in-50 duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${selectedSkillTip.type === 'matched' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
              <span className="font-bold text-xs text-white uppercase tracking-wider">
                Skill Diagnostic: {selectedSkillTip.skill}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                selectedSkillTip.type === 'matched' 
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
              }`}>
                {selectedSkillTip.impact}
              </span>
            </div>
            <button 
              onClick={() => setSelectedSkillTip(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
            {selectedSkillTip.suggestion}
          </p>
        </div>
      )}

      {/* Two Column Grid: Matched vs Missing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matched Skills Card */}
        <div className="bg-obsidian-900 border border-white/[0.08] rounded-2xl p-5 shadow-card-lift">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Matched Competencies
                </h3>
                <span className="text-[10px] text-slate-400">Verified in submitted resume text</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              {matchedSkills.length} Verified
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(skill, 'matched')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer group active:scale-[0.97]"
                title="Click to view impact details"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{skill}</span>
                <span className="text-[10px] text-emerald-500 group-hover:text-emerald-300 font-mono ml-0.5">✓</span>
              </button>
            ))}
            {matchedSkills.length === 0 && (
              <p className="text-xs text-slate-500 italic py-2">No direct keyword matches detected yet.</p>
            )}
          </div>
        </div>

        {/* Missing / Critical Gaps Card */}
        <div className="bg-obsidian-900 border border-white/[0.08] rounded-2xl p-5 shadow-card-lift">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Identified Skill Gaps
                </h3>
                <span className="text-[10px] text-slate-400">Required by job posting</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
              {missingSkills.length} Gaps
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(skill, 'missing')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 hover:border-amber-500/50 transition-all cursor-pointer group active:scale-[0.97]"
                title="Click for suggested action & impact"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>{skill}</span>
                <HelpCircle className="h-3 w-3 text-amber-400/60 group-hover:text-amber-300 ml-0.5" />
              </button>
            ))}
            {missingSkills.length === 0 && (
              <p className="text-xs text-emerald-400 italic py-2 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Complete coverage! All core requirements satisfied.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Actionable Improvement Guidance Drawer / Card */}
      {skillGaps.length > 0 && (
        <div className="bg-obsidian-900 border border-white/[0.08] rounded-2xl p-5 shadow-card-lift">
          <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-indigo-400" />
              Candidate Guidance & Impact Assessment
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">
              Deterministic Weights
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skillGaps.slice(0, 6).map((gap, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-xl border text-xs flex items-start gap-3 transition-all ${
                  gap.status === 'matched'
                    ? 'bg-emerald-950/15 border-emerald-900/30 text-emerald-200'
                    : 'bg-amber-950/15 border-amber-900/30 text-amber-200'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {gap.status === 'matched' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-white truncate">{gap.skill}</span>
                    <span className={`px-2 py-0.2 rounded text-[9px] uppercase font-bold tracking-wider ${
                      gap.importance === 'must_have' 
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60' 
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {gap.importance === 'must_have' ? 'Critical Requisite' : 'Preferred'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-2">
                    {gap.suggestionText}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
