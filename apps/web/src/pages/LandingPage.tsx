import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Scale, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  FileText, 
  Briefcase 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleGuest = async () => {
    await continueAsGuest();
    navigate('/candidate');
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 text-center">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-950/80 border border-teal-800/60 px-4 py-1 text-xs font-semibold text-teal-300">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            Hybrid Matching Engine (Lexical + Gemini Vector Embeddings)
          </div>

          {/* Editorial Headline */}
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Applicant Tracking & Resume Optimization <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-400 to-indigo-400">
              Powered by Explainable AI
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Bridge candidate experience and recruiter decision-making with transparent scoring (0.6 * lexical + 0.4 * semantic), skill gap matrix diagnostics, and bullet rephrasing diffs.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleGuest}
              className="w-full sm:w-auto px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 group"
            >
              Analyze Resume Now (Continue as Guest)
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
            </button>

            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-xl border border-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Sign Up for Account
            </Link>
          </div>

        </div>
      </section>

      {/* Feature Differentiation Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Explainable Hybrid Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Combines skill NER overlap index with Gemini vector embeddings. Every score shows explicit lexical vs semantic contribution breakdown.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">AI Resume Tailoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates tailored versions of bullet points highlighting missing keywords with side-by-side before/after diffs without hallucinating facts.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Governance & Bias Review</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Demographics are isolated from scoring metrics, backed by a complete paginated audit log tracking all evaluation events.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
