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
      setError(err.message || 'Login failed.');
    }
  };

  const handleGuest = async () => {
    await continueAsGuest();
    navigate('/candidate');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-bold text-white">Sign In to ResumeIQ</h2>
          <p className="text-xs text-slate-400">Access candidate optimization or recruiter ranking tools</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl text-center">
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
              placeholder="alex.dev@gmail.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500"
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
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            Sign In
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="relative border-t border-slate-800 pt-4 text-center space-y-3">
          <button
            onClick={handleGuest}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <UserCheck className="h-4 w-4" />
            Continue as Guest Candidate
          </button>

          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-400 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
