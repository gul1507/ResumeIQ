import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, UserCheck, Mail, Lock, Zap } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, continueAsGuest, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      if (email.includes('recruiter')) navigate('/recruiter');
      else if (email.includes('admin')) navigate('/admin');
      else navigate('/candidate');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleGuest = async () => {
    await continueAsGuest();
    navigate('/candidate');
  };

  const quickLogins = [
    { label: 'Candidate', email: 'candidate@demo.com', role: '/candidate' },
    { label: 'Recruiter', email: 'recruiter@demo.com', role: '/recruiter' },
    { label: 'Admin', email: 'admin@demo.com', role: '/admin' },
  ];

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="relative inline-flex">
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/20 blur-xl animate-glow-pulse" />
            <div className="relative h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/12 text-indigo-400 border border-indigo-500/30 inline-flex">
              <Sparkles className="h-6 w-6 stroke-[2.2]" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">Welcome back</h1>
            <p className="text-xs text-slate-400 mt-1">Sign in to your ResumeIQ workspace</p>
          </div>
        </div>

        {/* Guest Banner */}
        <div
          onClick={handleGuest}
          className="group mb-5 flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-obsidian-900 border border-indigo-500/25 cursor-pointer hover:border-indigo-500/50 hover:from-indigo-950/80 transition-all duration-200 shadow-glow-indigo"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Zap className="h-4 w-4 text-indigo-300" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Instant Demo Access</div>
              <div className="text-[11px] text-indigo-300/70">No account needed — explore as candidate</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </div>

        <div className="bg-obsidian-900 border border-white/[0.10] rounded-2xl p-6 shadow-card-lift space-y-5">

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[11px] text-slate-500 font-medium">or sign in with credentials</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2.5">
              <div className="h-4 w-4 shrink-0 rounded-full bg-rose-500/30 border border-rose-500 flex items-center justify-center">
                <span className="text-[10px] font-bold">!</span>
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-slate-500" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full bg-obsidian-950 border border-white/[0.10] rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-slate-500" />
                  Password
                </label>
                <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer text-[11px] font-medium transition-colors">
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-obsidian-950 border border-white/[0.10] rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 btn-primary-glow text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98] group"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Quick demo logins */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">Quick Demo</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {quickLogins.map(({ label, email: qEmail }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setEmail(qEmail);
                    setPassword('demo1234');
                  }}
                  className="px-2 py-1.5 rounded-lg bg-obsidian-950 border border-white/[0.07] hover:border-indigo-500/30 hover:bg-indigo-500/8 text-[11px] text-slate-400 hover:text-indigo-300 font-medium transition-all"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sign up link */}
          <div className="text-center border-t border-white/[0.07] pt-4">
            <p className="text-xs text-slate-500">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
