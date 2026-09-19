import React, { useEffect, useState } from 'react';
import { Sparkles, X, ChevronRight, FileText, Briefcase, Zap } from 'lucide-react';

interface OnboardingStep {
  icon: React.ElementType;
  title: string;
  body: string;
  cta?: string;
}

const STEPS: OnboardingStep[] = [
  {
    icon: Sparkles,
    title: 'Welcome to ResumeIQ',
    body: 'The first explainable ATS — combining lexical keyword matching and Gemini vector embeddings so you always know the exact reason behind every score.',
    cta: 'Got it →',
  },
  {
    icon: FileText,
    title: 'Pick a Resume Preset',
    body: 'Select one of our curated demo profiles or upload your own PDF/DOCX to benchmark against any live job posting.',
    cta: 'Next →',
  },
  {
    icon: Briefcase,
    title: 'Choose Your Target Role',
    body: 'Pick from real job requisitions or paste a custom JD. The hybrid scoring engine will compute your fit index in seconds.',
    cta: 'Next →',
  },
  {
    icon: Zap,
    title: 'Get Tailored Suggestions',
    body: 'After scoring, generate AI-rephrased bullet points that boost keyword density without hallucinating false credentials. Side-by-side diff included.',
    cta: "Let's go!",
  },
];

const STORAGE_KEY = 'resumeiq_onboarding_seen';

export const OnboardingTour: React.FC = () => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Small delay so the page renders first
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!visible || dismissed) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9998] w-80 animate-fade-in-up"
      role="dialog"
      aria-label="Onboarding tour"
    >
      <div className="bg-obsidian-900 border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-950/50 overflow-hidden">
        {/* Progress bar */}
        <div className="h-0.5 bg-obsidian-950">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-glow-indigo">
                <Icon className="h-4 w-4" />
              </div>
              <span className="font-display text-sm font-bold text-white">{current.title}</span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded-lg hover:bg-white/[0.05]"
              aria-label="Dismiss tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <p className="text-xs text-slate-400 leading-relaxed mb-4">{current.body}</p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === step
                      ? 'w-4 h-1.5 bg-indigo-400'
                      : i < step
                      ? 'w-1.5 h-1.5 bg-indigo-600'
                      : 'w-1.5 h-1.5 bg-obsidian-700'
                  }`}
                />
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-3.5 py-1.5 btn-primary-glow text-white font-bold text-xs rounded-xl transition-all active:scale-[0.98]"
            >
              <span>{current.cta}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
