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
} from 'lucide-react';

/* ─── Floating Particle Layer ─── */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  opacity: number;
}

const PARTICLE_COLORS = [
  'rgba(99,102,241,0.6)',
  'rgba(20,184,166,0.5)',
  'rgba(16,185,129,0.4)',
  'rgba(129,140,248,0.5)',
  'rgba(45,212,191,0.4)',
  'rgba(255,255,255,0.15)',
];

function genParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    duration: 5 + Math.random() * 8,
    delay: Math.random() * 4,
    opacity: 0.3 + Math.random() * 0.5,
  }));
}

const ParticleField: React.FC = () => {
  const particles = useRef(genParticles(40)).current;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            '--duration': `${p.duration}s`,
            '--delay': `-${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

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
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

/* ─── Main Component ─── */
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
      matched: ['Distributed Systems', 'Kafka', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
      gap: ['gRPC Architecture', 'Terraform CI/CD'],
      lexical: 92.0,
      semantic: 86.4,
    },
    aiml: {
      matched: ['PyTorch', 'Transformers', 'LangChain', 'Python', 'MLflow'],
      gap: ['Vertex AI', 'A/B Testing Framework'],
      lexical: 87.5,
      semantic: 80.2,
    },
    fullstack: {
      matched: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
      gap: ['Next.js App Router', 'Nx Monorepo'],
      lexical: 90.1,
      semantic: 84.7,
    },
  };
  const demo = demoSkills[selectedDemoTab];

  return (
    <div className="relative overflow-hidden">
      {/* ── Deep Space Background ── */}
      <div className="fixed inset-0 -z-10 bg-[#080C14]">
        {/* Animated orbs */}
        <div
          className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full animate-orb"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            '--orb-duration': '18s',
          } as React.CSSProperties}
        />
        <div
          className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full animate-orb"
          style={{
            background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)',
            '--orb-duration': '14s',
            animationDelay: '-6s',
          } as React.CSSProperties}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full animate-orb"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
            '--orb-duration': '22s',
            animationDelay: '-10s',
          } as React.CSSProperties}
        />
      </div>

      {/* ── Hero Section ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-16 pb-20 px-4">
        <ParticleField />

        {/* Gradient sweep at top */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        <div className={`mx-auto max-w-5xl text-center space-y-8 transition-all duration-700 ${heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          {/* Product Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/25 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md cursor-default group hover:border-indigo-500/50 hover:bg-indigo-500/15 transition-all duration-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-mono text-[11px] tracking-wide uppercase">Next-Gen Hybrid ATS</span>
            <span className="text-slate-500">•</span>
            <span>Lexical NER + Vector Embeddings</span>
            <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up animation-delay-100 font-display text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-white leading-[1.05]">
            Resume Scoring
            <br />
            <span
              className="text-transparent bg-clip-text animate-gradient-x"
              style={{
                backgroundImage: 'linear-gradient(90deg, #a5b4fc, #6366f1, #14b8a6, #818cf8, #a5b4fc)',
                backgroundSize: '300% 100%',
              }}
            >
              Without the Black Box
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="animate-fade-in-up animation-delay-200 mx-auto max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed">
            Bridge the gap between candidate resumes and recruiter hiring bars.
            Powered by{' '}
            <span className="text-indigo-300 font-semibold">explainable dual-channel scoring</span>
            {' '}— 0.6 lexical + 0.4 semantic — with deterministic skill matrices and instant bullet rephrasing diffs.
          </p>

          {/* CTA Row */}
          <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGuest}
              className="group w-full sm:w-auto px-8 py-4 btn-primary-glow text-white font-bold text-sm rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2.5"
            >
              <Zap className="h-4 w-4 text-indigo-200 group-hover:scale-110 transition-transform" />
              <span>Instant Test Drive — No Signup</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-4 btn-secondary-obsidian text-slate-200 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 group"
            >
              <Users className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Create Account</span>
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="animate-fade-in-up animation-delay-400 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            {[
              { icon: ShieldCheck, text: 'No fake credentials' },
              { icon: Activity, text: 'Explainable AI' },
              { icon: CheckCircle2, text: 'Bias-audited scoring' },
              { icon: Star, text: 'Open source' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-slate-400">
                <Icon className="h-3.5 w-3.5 text-indigo-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Interactive Demo Widget ── */}
        <div className="animate-fade-in-up animation-delay-500 mt-14 w-full max-w-4xl mx-auto">
          <div className="rounded-2xl bg-obsidian-900/90 border border-white/[0.10] shadow-2xl shadow-indigo-950/50 overflow-hidden backdrop-blur-sm">

            {/* Window chrome */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5 bg-obsidian-950/50">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors cursor-default" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors cursor-default" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-default" />
                <span className="ml-3 font-mono text-[11px] text-slate-500">resumeiq — live diagnostics</span>
              </div>
              {/* Tab switcher */}
              <div className="flex items-center bg-obsidian-950 p-1 rounded-xl border border-white/[0.06] text-xs gap-0.5">
                {(['backend', 'aiml', 'fullstack'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleDemoTab(tab)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      selectedDemoTab === tab
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {tab === 'backend' ? 'Senior Backend' : tab === 'aiml' ? 'GenAI Specialist' : 'Full-Stack'}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">

              {/* Score Pillar */}
              <div className="p-6 flex flex-col justify-between gap-5 bg-gradient-to-b from-obsidian-950/40 to-transparent">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">
                    Calculated Fit Index
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-5xl font-extrabold text-white">{demoScore}</span>
                    <div>
                      <span className="text-lg font-mono font-bold text-slate-400">%</span>
                      <span
                        className={`block text-xs font-bold font-mono ${
                          demoScore >= 80 ? 'text-emerald-400' : demoScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                        }`}
                      >
                        {demoScore >= 80 ? 'Strong' : demoScore >= 60 ? 'Moderate' : 'Weak'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Lexical (60%)</span>
                      <span className="font-mono text-cyan-300 font-bold">{demo.lexical}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-obsidian-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-700"
                        style={{ width: `${demo.lexical}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Semantic (40%)</span>
                      <span className="font-mono text-indigo-300 font-bold">{demo.semantic}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-obsidian-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-400 rounded-full transition-all duration-700"
                        style={{ width: `${demo.semantic}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Matrix */}
              <div className="md:col-span-2 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-indigo-400" />
                    Competency Match Matrix
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    Auto-NER
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-2">
                    ✓ Verified Matches
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {demo.matched.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium hover:bg-emerald-500/20 transition-colors cursor-default"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-2">
                    + Recommended Injections
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {demo.gap.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium hover:bg-amber-500/20 transition-colors cursor-default"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    AI Tailoring will rephrase your bullet points to naturally incorporate the missing keywords — verified, factual, no hallucinations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="relative py-16 border-y border-white/[0.05]">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/20 via-transparent to-teal-950/20 pointer-events-none" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Resumes Analyzed', value: 12400, suffix: '+', prefix: '' },
              { label: 'ATS Accuracy Rate', value: 96, suffix: '%', prefix: '' },
              { label: 'Score Improvement', value: 31, suffix: '%', prefix: 'Avg +' },
              { label: 'Bias Violations', value: 0, suffix: ' detected', prefix: '' },
            ].map(({ label, value, suffix, prefix }) => (
              <div key={label} className="text-center group">
                <div className="font-mono text-3xl md:text-4xl font-extrabold text-white mb-1 group-hover:text-indigo-300 transition-colors duration-300">
                  <AnimatedCounter target={value} suffix={suffix} prefix={prefix} />
                </div>
                <div className="text-xs text-slate-500 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-3 mb-14">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Platform Capabilities</span>
          <h2 className="font-display text-4xl font-bold text-white tracking-tight">
            Engineered for Precision,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-teal-300">
              Trust & Compliance
            </span>
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Every feature is designed to give candidates and recruiters complete clarity — no black boxes, no guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Scale,
              color: 'indigo',
              title: 'Explainable Dual-Score Index',
              desc: 'No arbitrary AI percentages. ResumeIQ decouples lexical keyword density from Gemini vector semantic similarity so everyone knows the exact reason behind every ranking.',
              badge: 'Dual-Channel',
              iconGradient: 'from-indigo-500/20 to-indigo-600/10',
            },
            {
              icon: Zap,
              color: 'teal',
              title: 'Factual Tailoring Diff Studio',
              desc: 'Rephrase bullet points to emphasize relevant experience without hallucinating false credentials or unearned degrees. Side-by-side synchronized diffs before downloading.',
              badge: 'AI-Powered',
              iconGradient: 'from-teal-500/20 to-teal-600/10',
            },
            {
              icon: ShieldCheck,
              color: 'emerald',
              title: 'Auditable Bias Governance',
              desc: 'Demographic signals, candidate gender, and graduation years are isolated before scoring execution. Immutable audit log records for complete HR compliance.',
              badge: 'EEOC Safe',
              iconGradient: 'from-emerald-500/20 to-emerald-600/10',
            },
          ].map(({ icon: Icon, color, title, desc, badge, iconGradient }, i) => (
            <div
              key={title}
              className={`glass-card-interactive p-7 rounded-2xl space-y-4 animate-fade-in-up`}
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${iconGradient} text-${color}-400 border border-${color}-500/20 shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-${color}-500/10 text-${color}-400 border border-${color}-500/20 uppercase tracking-wider`}>
                  {badge}
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-white leading-tight">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              <div className="pt-2 border-t border-white/[0.05]">
                <button
                  onClick={handleGuest}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group transition-colors"
                >
                  Try it free <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/10 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-14 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">How It Works</span>
            <h2 className="font-display text-4xl font-bold text-white">Four steps to a stronger resume</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

            {[
              { n: '01', icon: FileCheck, label: 'Upload Resume', desc: 'PDF, DOCX, or pick a demo preset for instant analysis', color: 'indigo' },
              { n: '02', icon: Cpu, label: 'NER Extraction', desc: 'Lexical entity extraction identifies exact skills and keywords', color: 'teal' },
              { n: '03', icon: Activity, label: 'Vector Scoring', desc: 'Gemini embeddings compute semantic similarity beyond keywords', color: 'violet' },
              { n: '04', icon: TrendingUp, label: 'Tailored Output', desc: 'AI-rephrased bullet points with side-by-side diff view', color: 'emerald' },
            ].map(({ n, icon: Icon, label, desc, color }, i) => (
              <div
                key={n}
                className={`relative flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-obsidian-900/60 border border-white/[0.06] hover:border-${color}-500/30 transition-all duration-300 group animate-fade-in-up`}
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 group-hover:shadow-glow-indigo transition-all duration-300`}>
                  <Icon className="h-6 w-6" />
                  <span className={`absolute -top-2 -right-2 h-5 w-5 rounded-full bg-${color}-600 text-white text-[10px] font-bold flex items-center justify-center`}>
                    {n.slice(1)}
                  </span>
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm mb-1">{label}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA Banner ── */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <div className="relative rounded-3xl overflow-hidden border border-indigo-500/25 p-10 text-center bg-gradient-to-br from-indigo-950/60 via-obsidian-900 to-teal-950/30 shadow-2xl">
          {/* Inner glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-5">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 shadow-glow-indigo mx-auto">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white">
              Ready to beat the ATS?
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Join thousands of candidates who use ResumeIQ to get actionable, transparent feedback and consistently land more interviews.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleGuest}
                className="group px-8 py-3.5 btn-primary-glow text-white font-bold text-sm rounded-2xl flex items-center gap-2.5"
              >
                <Zap className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Start Free — No Account Needed</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/register"
                className="px-6 py-3.5 btn-secondary-obsidian text-slate-200 font-semibold text-sm rounded-2xl flex items-center gap-2 group"
              >
                <Users className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>Create Full Account</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
