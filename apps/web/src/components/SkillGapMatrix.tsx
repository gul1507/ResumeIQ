import React from 'react';
import { SkillGap } from '../types';
import { CheckCircle2, AlertTriangle, Lightbulb, Zap } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      
      {/* Action Banner for Candidates */}
      {missingSkills.length > 0 && onTailorClick && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r from-teal-950/60 to-slate-900 border border-teal-800/40 rounded-xl gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Optimize Resume for Missing Keywords</h4>
              <p className="text-xs text-slate-300">
                Generate an AI-tailored resume version addressing {missingSkills.length} missing skills without altering facts.
              </p>
            </div>
          </div>
          <button
            onClick={onTailorClick}
            className="w-full sm:w-auto px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
          >
            <Zap className="h-4 w-4 fill-slate-950" />
            Generate Tailored Version
          </button>
        </div>
      )}

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matched Skills Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Matched Skills ({matchedSkills.length})
            </h3>
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
              Strong Coverage
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                {skill}
              </span>
            ))}
            {matchedSkills.length === 0 && (
              <p className="text-xs text-slate-500 italic">No exact skill matches detected yet.</p>
            )}
          </div>
        </div>

        {/* Missing Skills Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Missing Skills ({missingSkills.length})
            </h3>
            <span className="text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-full">
              Gap Analysis
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
              >
                <AlertTriangle className="h-3 w-3 text-amber-400" />
                {skill}
              </span>
            ))}
            {missingSkills.length === 0 && (
              <p className="text-xs text-emerald-400 italic">Perfect coverage! All required skills matched.</p>
            )}
          </div>
        </div>

      </div>

      {/* Detailed Skill Improvement Suggestion List */}
      {skillGaps.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-teal-400" />
            Actionable Improvement Guidance
          </h4>
          <div className="space-y-2.5">
            {skillGaps.map((gap, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${
                  gap.status === 'matched'
                    ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-200'
                    : 'bg-amber-950/20 border-amber-900/30 text-amber-200'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {gap.status === 'matched' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white">{gap.skill}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                      gap.importance === 'must_have' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {gap.importance === 'must_have' ? 'Must Have' : 'Nice to Have'}
                    </span>
                  </div>
                  <p className="text-slate-300">{gap.suggestionText}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
