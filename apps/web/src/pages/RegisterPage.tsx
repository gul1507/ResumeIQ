import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('candidate');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password, role, name);
      if (role === 'recruiter') navigate('/recruiter');
      else if (role === 'admin') navigate('/admin');
      else navigate('/candidate');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-obsidian-900 border border-white/[0.12] rounded-2xl p-8 shadow-card-lift space-y-6 relative z-10">
        
        <div className="text-center space-y-2">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-glow-indigo">
            <Sparkles className="h-5 w-5 stroke-[2.2]" />
          </div>
          <h2 className="font-display text-xl font-bold text-white tracking-tight">Create ResumeIQ Account</h2>
          <p className="text-xs text-slate-400">Select your persona to start</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Alex Rivera"
              className="w-full bg-obsidian-950 border border-white/[0.12] rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="alex.dev@gmail.com"
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

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Account Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-obsidian-950 border border-white/[0.12] rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors font-medium"
            >
              <option value="candidate">Candidate (Resume Diagnostics & Tailoring)</option>
              <option value="recruiter">Recruiter (Post Jobs & Rank Candidates)</option>
              <option value="admin">Admin (Compliance & Audit Logs)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 btn-primary-glow text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <span>Create Account</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline font-semibold">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};
