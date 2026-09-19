import React from 'react';
import { MatchResult } from '../types';
import { X, CheckCircle2, AlertTriangle, Sparkles, FileText, UserCheck, Scale, Award } from 'lucide-react';

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
    if (score >= 80) return { label: 'Strong Fit (Tier 1)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 60) return { label: 'Moderate Fit (Tier 2)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'Significant Gap (Tier 3)', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const band = getScoreBand(match.finalScore);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-obsidian-950/80 backdrop-blur-md flex justify-end animate-in fade-in-50 duration-200">
      <div className="w-full max-w-xl bg-obsidian-900 border-l border-white/[0.12] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-obsidian-850">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <h2 className="font-display text-lg font-bold text-white tracking-tight">
                Candidate Dossier & Explainability
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Candidate: <span className="text-white font-semibold">{match.candidateName || 'Candidate'}</span> • Role: <span className="text-slate-300">{match.jobTitle || 'Target Position'}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Hybrid ATS Score Card */}
          <div className="bg-obsidian-950 border border-white/[0.08] rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Overall Hybrid Match Score</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-mono text-4xl font-extrabold text-white">{match.finalScore.toFixed(1)}</span>
                <span className="text-sm font-semibold text-slate-400 font-mono">/ 100</span>
              </div>
              <div className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold border ${band.bg} ${band.color}`}>
                {band.label}
              </div>
            </div>

            {/* Split Metrics */}
            <div className="space-y-3 border-l border-white/[0.08] pl-6 text-right">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Lexical Keyword Overlap (60%)</span>
                <span className="font-mono text-lg font-bold text-cyan-300">{match.lexicalScore.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Semantic Context Match (40%)</span>
                <span className="font-mono text-lg font-bold text-indigo-300">{match.semanticScore.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* AI Evaluator Natural Language Rationale Box */}
          <div className="bg-obsidian-950 border border-white/[0.08] rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <Scale className="h-4 w-4" />
              Algorithmic Evaluation Rationale
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-sans bg-obsidian-900 p-3.5 rounded-lg border border-white/[0.06]">
              {match.explanation}
            </p>
          </div>

          {/* Matched Skills */}
          <div className="bg-obsidian-950 border border-white/[0.08] rounded-xl p-4 space-y-2.5">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Verified Competencies ({match.matchedSkills.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {match.matchedSkills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
                  {skill}
                </span>
              ))}
              {match.matchedSkills.length === 0 && <span className="text-xs text-slate-500 italic">No skills matched.</span>}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-obsidian-950 border border-white/[0.08] rounded-xl p-4 space-y-2.5">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              Requisition Gaps ({match.missingSkills.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {match.missingSkills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium">
                  {skill}
                </span>
              ))}
              {match.missingSkills.length === 0 && <span className="text-xs text-emerald-400 font-medium">Full skill requirement satisfaction!</span>}
            </div>
          </div>

          {/* Bias Governance Statement */}
          <div className="p-3.5 bg-obsidian-950 border border-white/[0.06] rounded-xl text-[11px] text-slate-400 flex items-center gap-2.5">
            <UserCheck className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Bias Mitigation Guardrail:</strong> Demographic indicators, names, and graduation years are stripped prior to scoring tensor calculation.
            </span>
          </div>

        </div>

        {/* Action Footer */}
        {onSendFeedbackClick && (
          <div className="p-4 border-t border-white/[0.08] bg-obsidian-850 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Current Status: <strong className="text-white capitalize">{match.feedbackStatus || 'Pending'}</strong>
            </span>
            <button
              onClick={onSendFeedbackClick}
              className="px-4 py-2 btn-primary-glow text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Send Structured Feedback</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
