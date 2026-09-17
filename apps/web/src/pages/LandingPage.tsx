import React, { useState } from 'react';
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
  Briefcase,
  TrendingUp,
  Cpu,
  ChevronRight,
  Code2,
  Users
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { continueAsGuest } = useAuth();
  const navigate = useNavigate();

  // Interactive Live Demo widget state
  const [demoScore, setDemoScore] = useState(88.4);
  const [selectedDemoTab, setSelectedDemoTab] = useState<'backend' | 'aiml' | 'fullstack'>('backend');

  const handleGuest = async () => {
    await continueAsGuest();
    navigate('/candidate');
  };

  const handleDemoPresetSwitch = (tab: 'backend' | 'aiml' | 'fullstack') => {
    setSelectedDemoTab(tab);
    if (tab === 'backend') setDemoScore(91.2);
    else if (tab === 'aiml') setDemoScore(84.6);
    else setDemoScore(88.4);
  };

  return (
    <div className="relative overflow-hidden space-y-24 pb-24">
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-radial-glow-hero pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 text-center">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Micro-Label Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/25 px-4 py-1.5 text-xs font-semibold text-indigo-300 shadow-glow-indigo">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="font-mono text-[11px] tracking-wide uppercase">Next-Gen Hybrid Matching</span>
            <span className="text-slate-500">•</span>
            <span>Lexical NER + Vector Embeddings</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Applicant Tracking & Tailoring <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-400 to-teal-300">
              Without the Black Box
            </span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Bridge the gap between candidate resumes and recruiter hiring bars. Powered by explainable dual-channel scoring (0.6 lexical + 0.4 semantic), deterministic skill matrices, and instant bullet rephrasing diffs.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleGuest}
              className="w-full sm:w-auto px-7 py-3.5 btn-primary-glow text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <span>Instant Test Drive (Continue as Guest)</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3.5 btn-secondary-obsidian text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>Create Recruiter / Candidate Account</span>
            </Link>
          </div>

          {/* Interactive Live ATS Demo Widget Mockup */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-obsidian-900 border border-white/[0.12] p-6 shadow-2xl shadow-indigo-950/40 relative overflow-hidden">
              
              {/* Window Controls Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-slate-400">resumeiq-evaluator.app/diagnostics</span>
                </div>

                <div className="flex bg-obsidian-950 p-1 rounded-xl border border-white/[0.06] text-xs">
                  <button
                    onClick={() => handleDemoPresetSwitch('backend')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      selectedDemoTab === 'backend' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Senior Backend
                  </button>
                  <button
                    onClick={() => handleDemoPresetSwitch('aiml')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      selectedDemoTab === 'aiml' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    GenAI Specialist
                  </button>
                  <button
                    onClick={() => handleDemoPresetSwitch('fullstack')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      selectedDemoTab === 'fullstack' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Full-Stack
                  </button>
                </div>
              </div>

              {/* Interactive Split Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                
                {/* Metric Pillar */}
                <div className="bg-obsidian-950 border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Calculated Fit Index
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-mono text-4xl font-extrabold text-white">{demoScore}%</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">Strong Alignment</span>
                    </div>
                  </div>

                  <div className="space-y-2 mt-6">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Lexical Overlap (60%)</span>
                      <span className="font-mono text-cyan-300 font-bold">92.0%</span>
                    </div>
                    <div className="h-1.5 w-full bg-obsidian-900 rounded-full overflow-hidden border border-white/[0.06]">
                      <div className="h-full bg-cyan-400 rounded-full w-[92%]" />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                      <span>Semantic Similarity (40%)</span>
                      <span className="font-mono text-indigo-300 font-bold">86.4%</span>
                    </div>
                    <div className="h-1.5 w-full bg-obsidian-900 rounded-full overflow-hidden border border-white/[0.06]">
                      <div className="h-full bg-indigo-400 rounded-full w-[86%]" />
                    </div>
                  </div>
                </div>

                {/* Live Skills Breakdown */}
                <div className="md:col-span-2 bg-obsidian-950 border border-white/[0.08] rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Cpu className="h-4 w-4 text-indigo-400" />
                      Dynamic Competency Match Matrix
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      Auto-NER
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1.5">
                      Verified Requisition Matches
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Distributed Systems', 'Kafka', 'PostgreSQL', 'Redis', 'Docker', 'AWS'].map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1.5">
                      Recommended Keyword Injections
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['gRPC Architecture', 'Terraform CI/CD'].map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/25 text-xs font-medium">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Feature Value Propositions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
            Platform Capabilities
          </span>
          <h2 className="font-display text-3xl font-bold text-white tracking-tight">
            Engineered for Precision, Trust & Compliance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="glass-card-interactive p-6 rounded-2xl space-y-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-glow-indigo">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Explainable Dual-Score Index</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              No arbitrary AI percentages. ResumeIQ clearly decouples lexical keyword density (exact match) from Gemini vector semantic similarity so candidates and recruiters know the exact reason behind every ranking.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card-interactive p-6 rounded-2xl space-y-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-glow-indigo">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Factual Tailoring Diff Studio</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Rephrase bullet points to emphasize relevant experience without hallucinating false credentials, fraudulent job titles, or unearned degrees. View side-by-side synchronized diffs before downloading.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card-interactive p-6 rounded-2xl space-y-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-glow-indigo">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Auditable Bias Governance</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Demographic signals, candidate gender, and graduation years are isolated before scoring execution. Backed by immutable audit log records for complete HR compliance and transparency.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
