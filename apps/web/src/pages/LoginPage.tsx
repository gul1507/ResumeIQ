import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';

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
      setError(err.message || 'Invalid credentials.');
    }
  };

  const handleGuest = async () => {
    await continueAsGuest();
    navigate('/candidate');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-obsidian-900 border border-white/[0.12] rounded-2xl p-8 shadow-card-lift space-y-6 relative z-10">
        
        <div className="text-center space-y-2">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-glow-indigo">
            <Sparkles className="h-5 w-5 stroke-[2.2]" />
          </div>
          <h2 className="font-display text-xl font-bold text-white tracking-tight">Sign In to ResumeIQ</h2>
          <p className="text-xs text-slate-400">Access candidate optimization studio or recruiter pipeline</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="candidate@resumeiq.app"
              className="w-full bg-obsidian-950 border border-white/[0.12] rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-obsidian-950 border border-white/[0.12] rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 btn-primary-glow text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="border-t border-white/[0.08] pt-4 text-center space-y-3">
          <button
            onClick={handleGuest}
            className="w-full py-2.5 btn-secondary-obsidian text-indigo-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <UserCheck className="h-4 w-4 text-indigo-400" />
            <span>Continue as Guest Candidate</span>
          </button>

          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
