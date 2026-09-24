import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Scale,
  ShieldCheck,
  ArrowRight,
  Zap,
  Cpu,
  TrendingUp,
  FileCheck,
  Users,
  Activity,
  CheckCircle2,
  Star,
  Target,
  Terminal,
  Binary,
  Compass,
  Radar
} from 'lucide-react';

/* ─── Animated Counter ─── */
const AnimatedCounter: React.FC<{ target: number; suffix?: string; prefix?: string; duration?: number }> = ({
  target,
  suffix = '',
  prefix = '',
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

/* ─── Main Landing Page ─── */
export const LandingPage: React.FC = () => {
  const { continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const [selectedDemoTab, setSelectedDemoTab] = useState<'backend' | 'aiml' | 'fullstack'>('backend');
  const [demoScore, setDemoScore] = useState(91.2);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleGuest = async () => {
    await continueAsGuest();
    navigate('/candidate');
  };

  const handleDemoTab = (tab: 'backend' | 'aiml' | 'fullstack') => {
    setSelectedDemoTab(tab);
    setDemoScore(tab === 'backend' ? 91.2 : tab === 'aiml' ? 84.6 : 88.4);
  };

  /* ─── Skill data for demo ─── */
  const demoSkills = {
    backend: {
      title: 'Principal Distributed Systems Engineer',
      matched: ['Distributed Systems', 'Kafka', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
      gap: ['gRPC Architecture', 'Terraform CI/CD'],
      lexical: 92.0,
      semantic: 86.4,
    },
    aiml: {
      title: 'Generative AI & LLM Systems Engineer',
      matched: ['PyTorch', 'Transformers', 'LangChain', 'Python', 'MLflow'],
      gap: ['Vertex AI', 'A/B Testing Framework'],
      lexical: 87.5,
      semantic: 80.2,
    },
    fullstack: {
      title: 'Senior Frontend & Platform Architect',
      matched: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
      gap: ['Next.js App Router', 'Nx Monorepo'],
      lexical: 90.1,
      semantic: 84.7,
    },
  };
  const demo = demoSkills[selectedDemoTab];

  return (
    <div className="relative overflow-hidden bg-[#070A10] text-[#E2E8F0]">
      
      {/* ── Atmospheric Geometry & Telemetry Grid ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Subtle engineering grid */}
        <div className="absolute inset-0 bg-tactical-grid opacity-60" />
        
        {/* Warm Vermilion & Amber Atmospheric Light Leaks */}
        <div
          className="absolute top-[-10%] right-[5%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF5C00 0%, transparent 70%)' }}
        />
        {/* Cool Electric Cyan Radar Flare */}
        <div
          className="absolute top-[35%] left-[-10%] w-[550px] h-[550px] rounded-full blur-[130px] opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #00C9FF 0%, transparent 70%)' }}
        />
        {/* Signal Emerald Micro-Aura */}
        <div
          className="absolute bottom-[-15%] right-[25%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #00F5A0 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Top Hairline Telemetry Sweep ── */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5C00]/40 to-transparent" />

      {/* ── Hero Cockpit Section ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-20 pb-20 px-4 sm:px-6">
        
        <div className={`mx-auto max-w-5xl text-center space-y-8 transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          {/* Precision Aerospace Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2.5 rounded-full bg-[#0B1019] border border-white/[0.12] px-4 py-1.5 text-xs font-medium text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl group hover:border-[#FF5C00]/50 transition-all duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5C00]"></span>
            </span>
            <span className="font-mono text-[11px] font-bold tracking-wider text-[#FFA133] uppercase">
              RADAR ATS ENGINE
            </span>
            <span className="text-white/20">•</span>
            <span className="text-slate-300 font-sans text-xs">Deterministic Lexical NER + Gemini Vectors</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#00F5A0]/15 text-[#00F5A0] border border-[#00F5A0]/30 font-semibold">
              0.6 + 0.4
            </span>
          </div>

          {/* Headline with Sculptural Syne Typography */}
          <h1 className="animate-fade-in-up animation-delay-100 font-display text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-white leading-[1.04]">
            Resume Scoring
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#FFA133] to-[#FF5C00] drop-shadow-sm">
              Without the Black Box.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="animate-fade-in-up animation-delay-200 mx-auto max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            Recruiting algorithms shouldn't be an impenetrable enigma. ResumeIQ replaces opaque AI guessing with{' '}
            <span className="text-white font-semibold underline decoration-[#FF5C00]/50 decoration-2 underline-offset-4">
              explainable dual-channel telemetry
            </span>
            —verifiable skill overlap, vector cosine similarity, and instant bullet tailoring diffs.
          </p>

          {/* High-Impact CTA Cockpit */}
          <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleGuest}
              className="group w-full sm:w-auto px-8 py-4 btn-primary-glow text-white font-bold text-sm rounded-2xl transition-all shadow-[0_10px_30px_rgba(255,92,0,0.35)] flex items-center justify-center gap-3"
            >
              <Zap className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
              <span>Instant Test Drive — Zero Setup</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-4 btn-secondary-obsidian text-slate-200 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2.5 group shadow-sm"
            >
              <Users className="h-4 w-4 text-[#FFA133] group-hover:scale-110 transition-transform" />
              <span>Create Recruiter / Candidate Account</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="animate-fade-in-up animation-delay-400 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-slate-400 pt-3">
            {[
              { icon: ShieldCheck, text: 'Zero Hallucinated Credentials', color: 'text-[#00F5A0]' },
              { icon: Activity, text: 'Deterministic 60/40 Math', color: 'text-[#00C9FF]' },
              { icon: CheckCircle2, text: 'Demographic Bias Stripped', color: 'text-[#FFA133]' },
              { icon: Terminal, text: 'Full Audit Trail Included', color: 'text-[#FF5C00]' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="font-mono text-[11px]">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Live Interactive Telemetry Terminal HUD ── */}
        <div className="animate-fade-in-up animation-delay-500 mt-14 w-full max-w-4xl mx-auto">
          <div className="rounded-2xl bg-[#0B1019]/90 border border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-xl">

            {/* Window Chrome / Telemetry Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/[0.08] px-5 py-3.5 bg-[#05070B]/70 gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#FF2E63]/80 border border-[#FF2E63]" />
                  <div className="h-3 w-3 rounded-full bg-[#FFA133]/80 border border-[#FFA133]" />
                  <div className="h-3 w-3 rounded-full bg-[#00F5A0]/80 border border-[#00F5A0]" />
                </div>
                <span className="font-mono text-[11px] text-slate-400 font-semibold tracking-wider">
                  TELEMETRY_HUD // {demo.title}
                </span>
              </div>

              {/* Role Preset Tabs */}
              <div className="flex items-center bg-[#070A10] p-1 rounded-xl border border-white/[0.08] text-xs gap-1">
                {(['backend', 'aiml', 'fullstack'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleDemoTab(tab)}
                    className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-all ${
                      selectedDemoTab === tab
                        ? 'bg-[#FF5C00] text-white shadow-[0_0_12px_rgba(255,92,0,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {tab === 'backend' ? 'Distributed Backend' : tab === 'aiml' ? 'GenAI Lead' : 'Platform FullStack'}
                  </button>
                ))}
              </div>
            </div>

            {/* Telemetry Core Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">

              {/* Pillar 1: Concentric Score Engine */}
              <div className="p-6 flex flex-col justify-between gap-5 bg-gradient-to-b from-[#0F1623]/50 to-transparent">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-1">
                    ATS Composite Score
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                      {demoScore}
                    </span>
                    <div>
                      <span className="text-sm font-mono font-bold text-slate-400">%</span>
                      <span
                        className={`block text-[10px] font-mono uppercase font-bold tracking-wider ${
                          demoScore >= 80 ? 'text-[#00F5A0]' : 'text-[#FFA133]'
                        }`}
                      >
                        {demoScore >= 80 ? 'Tier 1 Strong' : 'Tier 2 Fit'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mathematical Split Breakdown */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00C9FF]" />
                        Lexical Overlap (60%)
                      </span>
                      <span className="text-[#00C9FF] font-bold">{demo.lexical}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#05070B] rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                      <div
                        className="h-full bg-gradient-to-r from-[#00C9FF] to-[#00F5A0] rounded-full transition-all duration-700"
                        style={{ width: `${demo.lexical}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5C00]" />
                        Vector Semantic (40%)
                      </span>
                      <span className="text-[#FFA133] font-bold">{demo.semantic}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#05070B] rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF5C00] to-[#FFA133] rounded-full transition-all duration-700"
                        style={{ width: `${demo.semantic}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500 border-t border-white/[0.06] pt-2">
                  FORMULA: (0.6 × L) + (0.4 × S)
                </div>
              </div>

              {/* Pillar 2 & 3: Real-Time Competency Matrix */}
              <div className="md:col-span-2 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span className="text-xs font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#FFA133]" />
                    Skill Gap Diagnostics
                  </span>
                  <span className="text-[10px] font-mono text-[#00F5A0] bg-[#00F5A0]/10 px-2.5 py-0.5 rounded-full border border-[#00F5A0]/20 font-bold">
                    ACTIVE PARSER
                  </span>
                </div>

                {/* Verified Matches */}
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00F5A0] block mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Matches (Resume ↔ Requisition)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {demo.matched.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/25 text-xs font-mono font-medium hover:bg-[#00F5A0]/20 transition-colors cursor-default"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keyword Gaps */}
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFA133] block mb-2 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" />
                    High-Priority Gap Injections
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {demo.gap.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-[#FFA133]/10 text-[#FFA133] border border-[#FFA133]/25 text-xs font-mono font-medium hover:bg-[#FFA133]/20 transition-colors cursor-default"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Tailoring Micro Callout */}
                <div className="mt-2 p-3.5 rounded-xl bg-[#FF5C00]/10 border border-[#FF5C00]/25 flex items-center gap-3">
                  <Cpu className="h-4 w-4 text-[#FF5C00] shrink-0" />
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    <strong>Tailoring Engine:</strong> Rephrases candidate experience bullet points to integrate missing skills without inventing past roles or fraudulent achievements.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Metric Performance Band ── */}
      <section className="relative py-14 border-y border-white/[0.08] bg-[#05070B]/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Scored Applications', value: 18450, suffix: '+', prefix: '' },
              { label: 'ATS Correlation Index', value: 98, suffix: '%', prefix: '' },
              { label: 'Average Score Boost', value: 34, suffix: '%', prefix: 'Avg +' },
              { label: 'Demographic Bias Events', value: 0, suffix: ' recorded', prefix: '' },
            ].map(({ label, value, suffix, prefix }) => (
              <div key={label} className="text-center group">
                <div className="font-mono text-3xl md:text-4xl font-extrabold text-white mb-1 group-hover:text-[#FFA133] transition-colors duration-300">
                  <AnimatedCounter target={value} suffix={suffix} prefix={prefix} />
                </div>
                <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Matrix Cockpit ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#FF5C00]">
            Bespoke Architecture
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered for Precision,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA133] via-[#FF5C00] to-[#FF2E63]">
              Auditability & Trust.
            </span>
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-sans">
            Every feature provides unambiguous insight for both hiring managers and applicants—no hidden rules, no opaque rejections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Scale,
              badge: 'Dual-Engine Math',
              title: 'Explainable Scoring Dual-Channel',
              desc: 'Never wonder why an applicant scored 72%. ResumeIQ cleanly isolates normalized skill lexical overlap from vector semantic cosine similarity with full mathematical visibility.',
              borderHover: 'hover:border-[#00C9FF]/50',
              accent: 'text-[#00C9FF]',
              bg: 'bg-[#00C9FF]/10',
            },
            {
              icon: Zap,
              badge: 'Zero Hallucinations',
              title: 'Interactive Bullet Tailoring Diff',
              desc: 'Generate tailored bullet revisions that specifically target missing job keywords using context from your existing career milestones—without inventing unearned experiences.',
              borderHover: 'hover:border-[#FF5C00]/50',
              accent: 'text-[#FF5C00]',
              bg: 'bg-[#FF5C00]/10',
            },
            {
              icon: ShieldCheck,
              badge: 'HR Compliance',
              title: 'Demographic Bias Governance',
              desc: 'Candidate names, gender indicators, and graduation dates are stripped prior to scoring tensors. An immutable audit trail guarantees bias mitigation for enterprise teams.',
              borderHover: 'hover:border-[#00F5A0]/50',
              accent: 'text-[#00F5A0]',
              bg: 'bg-[#00F5A0]/10',
            },
          ].map(({ icon: Icon, badge, title, desc, borderHover, accent, bg }, i) => (
            <div
              key={title}
              className={`glass-card-interactive p-8 rounded-2xl space-y-5 animate-fade-in-up ${borderHover}`}
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg} ${accent} border border-white/[0.1] shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${bg} ${accent} border border-white/[0.08] uppercase tracking-wider`}>
                  {badge}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-white leading-snug">{title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{desc}</p>
              <div className="pt-3 border-t border-white/[0.06]">
                <button
                  onClick={handleGuest}
                  className={`text-xs font-semibold ${accent} flex items-center gap-1.5 group transition-colors`}
                >
                  <span>Experience Interactive Demo</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4-Stage Telemetry Workflow ── */}
      <section className="relative py-20 border-t border-white/[0.08]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-16 space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#00F5A0]">
              The Processing Pipeline
            </span>
            <h2 className="font-display text-4xl font-extrabold text-white">From Raw Document to Tailored Resume</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
            {[
              { n: '01', icon: FileCheck, label: 'Document Ingestion', desc: 'PDF, DOCX parsing with entity extraction', color: '#00C9FF' },
              { n: '02', icon: Binary, label: 'NER Entity Parse', desc: 'Normalized keyword mapping & synonym resolution', color: '#00F5A0' },
              { n: '03', icon: Activity, label: 'Vector Similarity', desc: 'Gemini embedding cosine alignment scoring', color: '#FFA133' },
              { n: '04', icon: TrendingUp, label: 'Tailored Diff', desc: 'Side-by-side bullet enhancement & export', color: '#FF5C00' },
            ].map(({ n, icon: Icon, label, desc, color }, i) => (
              <div
                key={n}
                className="relative flex flex-col items-center text-center gap-3.5 p-6 rounded-2xl bg-[#0B1019]/80 border border-white/[0.08] hover:border-white/[0.2] transition-all duration-300 group"
              >
                <div 
                  className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.1] shadow-lg transition-all duration-300"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  <Icon className="h-6 w-6" />
                  <span 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-white text-[10px] font-mono font-bold flex items-center justify-center shadow-md"
                    style={{ backgroundColor: color }}
                  >
                    {n}
                  </span>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm mb-1">{label}</div>
                  <div className="text-xs text-slate-400 leading-relaxed font-sans">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final Call to Action Cockpit ── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <div className="relative rounded-3xl overflow-hidden border border-[#FF5C00]/30 p-10 sm:p-12 text-center bg-gradient-to-br from-[#0F1623] via-[#070A10] to-[#0B1019] shadow-[0_24px_60px_rgba(0,0,0,0.8)]">
          {/* Inner amber rim light */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF5C00] to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#FF5C00]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5C00]/20 border border-[#FF5C00]/40 text-[#FF5C00] shadow-[0_0_24px_rgba(255,92,0,0.35)] mx-auto">
              <Cpu className="h-7 w-7" />
            </div>
            
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to command your ATS score?
            </h2>
            
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-sans">
              Test your resume against real job specifications instantly. Get transparent, actionable gap analysis with zero commitment.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={handleGuest}
                className="w-full sm:w-auto px-8 py-4 btn-primary-glow text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2.5 shadow-[0_10px_30px_rgba(255,92,0,0.4)]"
              >
                <Zap className="h-4 w-4" />
                <span>Launch Interactive Candidate Studio</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-4 btn-secondary-obsidian text-slate-200 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2"
              >
                <span>Sign In with Demo Credentials</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
