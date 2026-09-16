import React from 'react';
import { MatchResult } from '../types';
import { X, CheckCircle2, AlertTriangle, Sparkles, FileText, UserCheck, Scale } from 'lucide-react';

interface ExplainabilityPanelProps {
  match: MatchResult | null;
  onClose: () => void;
  onSendFeedbackClick?: () => void;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  match,
  onClose,
  onSendFeedbackClick
}) => {
  if (!match) return null;

  const getScoreBand = (score: number) => {
    if (score >= 85) return { label: 'Strong Match', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 70) return { label: 'Moderate Match', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'Weak Match', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const band = getScoreBand(match.finalScore);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-[#090d16] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-400" />
              <h2 className="font-display text-lg font-bold text-white">
                Match Diagnostics & Explainability
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Candidate: <span className="text-white font-medium">{match.candidateName || 'Candidate'}</span> • Role: <span className="text-slate-200">{match.jobTitle || 'Target Position'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Hybrid ATS Score Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Overall Hybrid Match Score</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-4xl font-bold text-white">{match.finalScore.toFixed(1)}</span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>
              <div className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold border ${band.bg} ${band.color}`}>
                {band.label}
              </div>
            </div>

            {/* Split Metrics */}
            <div className="space-y-3 border-l border-slate-800 pl-6 text-right">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Lexical Skill Overlap (60%)</span>
                <span className="font-mono text-lg font-bold text-teal-300">{match.lexicalScore.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Semantic Similarity (40%)</span>
                <span className="font-mono text-lg font-bold text-indigo-300">{match.semanticScore.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* AI Natural Language Explanation Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Scale className="h-4 w-4" />
              AI Evaluator Rationale Summary
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
              {match.explanation}
            </p>
          </div>

          {/* Matched Tags */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Matched Skill Qualifications ({match.matchedSkills.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {match.matchedSkills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 text-xs font-medium">
                  {skill}
                </span>
              ))}
              {match.matchedSkills.length === 0 && <span className="text-xs text-slate-500 italic">No skills matched.</span>}
            </div>
          </div>

          {/* Missing Tags */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              Missing Skill Requirements ({match.missingSkills.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {match.missingSkills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 text-xs font-medium">
                  {skill}
                </span>
              ))}
              {match.missingSkills.length === 0 && <span className="text-xs text-emerald-400 font-medium">Complete skill match!</span>}
            </div>
          </div>

          {/* Bias Governance Statement */}
          <div className="p-3 bg-slate-900/40 border border-slate-800/60 rounded-lg text-[11px] text-slate-400 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-teal-400 shrink-0" />
            <span>Bias Governance Notice: Demographics, graduation dates, and names are explicitly isolated from scoring algorithm weights.</span>
          </div>

        </div>

        {/* Footer Action */}
        {onSendFeedbackClick && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Feedback Status: <strong className="text-white capitalize">{match.feedbackStatus || 'Pending'}</strong>
            </span>
            <button
              onClick={onSendFeedbackClick}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              Send Candidate Feedback
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
