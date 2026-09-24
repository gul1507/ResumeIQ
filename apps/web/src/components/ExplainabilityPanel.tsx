import React from 'react';
import { MatchResult } from '../types';
import { X, CheckCircle2, AlertTriangle, Sparkles, FileText, UserCheck, Scale, Award, Cpu, ShieldCheck } from 'lucide-react';

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
    if (score >= 80) return { label: 'High Alignment (Tier 1)', color: 'text-[#00F5A0]', bg: 'bg-[#00F5A0]/10 border-[#00F5A0]/30 shadow-[0_0_12px_rgba(0,245,160,0.15)]' };
    if (score >= 60) return { label: 'Moderate Fit (Tier 2)', color: 'text-[#FFA133]', bg: 'bg-[#FFA133]/10 border-[#FFA133]/30 shadow-[0_0_12px_rgba(255,161,51,0.15)]' };
    return { label: 'Critical Gap (Tier 3)', color: 'text-[#FF2E63]', bg: 'bg-[#FF2E63]/10 border-[#FF2E63]/30 shadow-[0_0_12px_rgba(255,46,99,0.15)]' };
  };

  const band = getScoreBand(match.finalScore);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#05070B]/80 backdrop-blur-xl flex justify-end animate-fade-in-up">
      <div className="w-full max-w-xl bg-[#070A10] border-l border-white/[0.12] h-full flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#0B1019]">
          <div>
            <div className="flex items-center gap-2.5">
              <Cpu className="h-5 w-5 text-[#FF5C00]" />
              <h2 className="font-display text-lg font-bold text-white tracking-tight">
                Candidate Dossier & Explainability
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
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
          <div className="bg-[#0B1019] border border-white/[0.08] rounded-2xl p-5 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Overall ATS Score</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-mono text-4xl font-extrabold text-white">{match.finalScore.toFixed(1)}</span>
                <span className="text-sm font-semibold text-slate-400 font-mono">/ 100</span>
              </div>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${band.bg} ${band.color}`}>
                {band.label}
              </div>
            </div>

            {/* Split Metrics */}
            <div className="space-y-3 border-l border-white/[0.08] pl-6 text-right">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Lexical Keyword Overlap (60%)</span>
                <span className="font-mono text-lg font-bold text-[#00C9FF]">{match.lexicalScore.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">Semantic Embedding Match (40%)</span>
                <span className="font-mono text-lg font-bold text-[#FFA133]">{match.semanticScore.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* AI Evaluator Natural Language Rationale Box */}
          <div className="bg-[#0B1019] border border-white/[0.08] rounded-xl p-4 space-y-2">
            <h3 className="font-display text-xs font-bold text-[#FFA133] uppercase tracking-widest flex items-center gap-1.5">
              <Scale className="h-4 w-4" />
              Algorithmic Evaluation Rationale
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed font-sans bg-[#05070B] p-3.5 rounded-lg border border-white/[0.06]">
              {match.explanation}
            </p>
          </div>

          {/* Matched Skills */}
          <div className="bg-[#0B1019] border border-white/[0.08] rounded-xl p-4 space-y-2.5">
            <h3 className="font-display text-xs font-bold text-[#00F5A0] uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Verified Competencies ({match.matchedSkills.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {match.matchedSkills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/25 text-xs font-mono font-medium">
                  {skill}
                </span>
              ))}
              {match.matchedSkills.length === 0 && <span className="text-xs text-slate-500 italic">No skills matched.</span>}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-[#0B1019] border border-white/[0.08] rounded-xl p-4 space-y-2.5">
            <h3 className="font-display text-xs font-bold text-[#FFA133] uppercase tracking-widest flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              Requisition Gaps ({match.missingSkills.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {match.missingSkills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-[#FFA133]/10 text-[#FFA133] border border-[#FFA133]/25 text-xs font-mono font-medium">
                  {skill}
                </span>
              ))}
              {match.missingSkills.length === 0 && <span className="text-xs text-[#00F5A0] font-medium">Full skill requirement satisfaction!</span>}
            </div>
          </div>

          {/* Bias Governance Statement */}
          <div className="p-3.5 bg-[#0B1019] border border-white/[0.06] rounded-xl text-[11px] text-slate-400 flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[#FF5C00] shrink-0" />
            <span>
              <strong>Bias Mitigation Guardrail:</strong> Demographic indicators, names, and graduation years are stripped prior to scoring tensor calculation.
            </span>
          </div>

        </div>

        {/* Action Footer */}
        {onSendFeedbackClick && (
          <div className="p-4 border-t border-white/[0.08] bg-[#0B1019] flex items-center justify-between">
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
