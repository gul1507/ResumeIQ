import React from 'react';
import { FileSearch, Briefcase, Sparkles, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  variant: 'no-resume' | 'no-results' | 'no-candidates' | 'no-jobs';
  onAction?: () => void;
  actionLabel?: string;
}

const variants = {
  'no-resume': {
    icon: FileSearch,
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    title: 'Start Your ATS Analysis',
    description:
      'Select a demo preset or upload your resume to instantly see how well you match any role — with a full explainability breakdown.',
    actionLabel: 'Choose a Demo Preset',
    illustration: (
      <svg viewBox="0 0 200 160" fill="none" className="w-48 h-36 opacity-60">
        {/* Document base */}
        <rect x="60" y="20" width="80" height="110" rx="8" fill="url(#doc-grad)" />
        <defs>
          <linearGradient id="doc-grad" x1="60" y1="20" x2="140" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* Document lines */}
        <rect x="72" y="40" width="56" height="4" rx="2" fill="url(#line-grad)" />
        <rect x="72" y="52" width="40" height="3" rx="1.5" fill="#334155" />
        <rect x="72" y="63" width="48" height="3" rx="1.5" fill="#334155" />
        <rect x="72" y="74" width="36" height="3" rx="1.5" fill="#334155" />
        <rect x="72" y="85" width="44" height="3" rx="1.5" fill="#334155" />
        <rect x="72" y="96" width="32" height="3" rx="1.5" fill="#334155" />
        {/* Upload arrow */}
        <circle cx="155" cy="50" r="18" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeOpacity="0.3" strokeWidth="1.5" />
        <path d="M155 58 L155 43 M150 48 L155 43 L160 48" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Sparkle */}
        <circle cx="45" cy="90" r="4" fill="#14b8a6" fillOpacity="0.5" />
        <circle cx="45" cy="90" r="2" fill="#14b8a6" />
      </svg>
    ),
  },
  'no-results': {
    icon: Sparkles,
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10 border-indigo-500/20',
    title: 'Analysis Ready',
    description:
      'Click "Compute Hybrid ATS Match Score" to run the full dual-channel pipeline: lexical NER extraction + Gemini vector embeddings.',
    actionLabel: 'Run Analysis',
    illustration: (
      <svg viewBox="0 0 200 160" fill="none" className="w-48 h-36 opacity-60">
        <defs>
          <radialGradient id="radar-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="80" r="60" fill="url(#radar-grad)" />
        <circle cx="100" cy="80" r="45" stroke="#6366f1" strokeOpacity="0.2" strokeWidth="1" fill="none" />
        <circle cx="100" cy="80" r="30" stroke="#6366f1" strokeOpacity="0.3" strokeWidth="1" fill="none" />
        <circle cx="100" cy="80" r="15" stroke="#6366f1" strokeOpacity="0.5" strokeWidth="1" fill="none" />
        <circle cx="100" cy="80" r="5" fill="#6366f1" />
        <path d="M100 80 L145 35" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        {/* Dots */}
        <circle cx="125" cy="50" r="4" fill="#14b8a6" />
        <circle cx="75" cy="60" r="3" fill="#f59e0b" />
        <circle cx="118" cy="85" r="3.5" fill="#10b981" />
      </svg>
    ),
  },
  'no-candidates': {
    icon: Briefcase,
    iconColor: 'text-teal-400',
    iconBg: 'bg-teal-500/10 border-teal-500/20',
    title: 'No Candidates Yet',
    description:
      'Candidates who apply for this requisition will appear here with full ATS scoring, skill gap analysis, and explainability reports.',
    actionLabel: 'Post a New Job',
    illustration: (
      <svg viewBox="0 0 200 160" fill="none" className="w-48 h-36 opacity-60">
        <rect x="50" y="50" width="100" height="70" rx="8" fill="#1e293b" />
        <rect x="80" y="38" width="40" height="18" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
        <rect x="62" y="70" width="34" height="3" rx="1.5" fill="#334155" />
        <rect x="62" y="80" width="24" height="3" rx="1.5" fill="#6366f1" fillOpacity="0.5" />
        <circle cx="142" cy="45" r="14" fill="#14b8a6" fillOpacity="0.15" stroke="#14b8a6" strokeOpacity="0.3" strokeWidth="1.5" />
        <path d="M137 45 L141 49 L148 41" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  'no-jobs': {
    icon: Briefcase,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    title: 'No Active Requisitions',
    description: 'Post your first job listing to start receiving and evaluating candidates through the ATS pipeline.',
    actionLabel: 'Create Requisition',
    illustration: (
      <svg viewBox="0 0 200 160" fill="none" className="w-48 h-36 opacity-60">
        <rect x="40" y="40" width="120" height="85" rx="8" fill="#1e293b" />
        <rect x="40" y="40" width="120" height="28" rx="8" fill="#f59e0b" fillOpacity="0.12" />
        <circle cx="60" cy="54" r="7" fill="#f59e0b" fillOpacity="0.4" />
        <rect x="72" y="50" width="50" height="3.5" rx="1.75" fill="#f59e0b" fillOpacity="0.6" />
        <rect x="72" y="57" width="32" height="2.5" rx="1.25" fill="#475569" />
        <rect x="52" y="80" width="96" height="2.5" rx="1.25" fill="#334155" />
        <rect x="52" y="89" width="72" height="2.5" rx="1.25" fill="#334155" />
        <rect x="52" y="98" width="84" height="2.5" rx="1.25" fill="#334155" />
        <circle cx="148" cy="130" r="16" fill="#6366f1" />
        <path d="M148 124 L148 136 M142 130 L154 130" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({ variant, onAction, actionLabel }) => {
  const v = variants[variant];
  const Icon = v.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in-up">
      {/* Illustration */}
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-3xl scale-150 pointer-events-none" />
        {v.illustration}
      </div>

      {/* Icon Badge */}
      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${v.iconBg} ${v.iconColor} mb-4 shadow-glow-indigo`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Text */}
      <h3 className="font-display text-lg font-bold text-white mb-2">{v.title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed max-w-sm">{v.description}</p>

      {/* Action */}
      {onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2.5 btn-primary-glow text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 active:scale-[0.98]"
        >
          <span>{actionLabel || v.actionLabel}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
