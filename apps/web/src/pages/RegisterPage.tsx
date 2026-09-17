import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Briefcase, 
  ShieldCheck,
  CheckCircle2,
  Zap
} from 'lucide-react';

const ROLES: { value: UserRole; icon: React.ElementType; label: string; desc: string; badge: string; color: string }[] = [
  {
    value: 'candidate',
    icon: FileText,
    label: 'Candidate',
    desc: 'Resume diagnostics, ATS scoring & AI tailoring',
    badge: 'Most Popular',
    color: 'indigo',
  },
  {
    value: 'recruiter',
    icon: Briefcase,
    label: 'Recruiter',
    desc: 'Post jobs, rank applicants & send feedback',
    badge: 'Hiring Manager',
    color: 'teal',
  },
  {
    value: 'admin',
    icon: ShieldCheck,
    label: 'Admin',
    desc: 'Audit logs, bias compliance & governance',
    badge: 'HR Compliance',
    color: 'violet',
  },
];

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
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const selectedRole = ROLES.find((r) => r.value === role)!;

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 relative">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/12 text-indigo-400 border border-indigo-500/30 shadow-glow-indigo mx-auto">
            <Sparkles className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">Create Your Account</h1>
            <p className="text-xs text-slate-400 mt-1">Choose your role to get started in seconds</p>
          </div>
        </div>

        <div className="bg-obsidian-900 border border-white/[0.10] rounded-2xl p-6 shadow-card-lift space-y-6">

          {/* Error */}
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2.5">
              <div className="h-4 w-4 rounded-full bg-rose-500/30 border border-rose-500 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold">!</span>
              </div>
              {error}
            </div>
          )}

          {/* Role Picker */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map(({ value, icon: Icon, label, desc, badge, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`relative flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all duration-200 ${
                    role === value
                      ? `bg-${color}-500/15 border-${color}-500/50 shadow-glow-indigo`
                      : 'bg-obsidian-950 border-white/[0.07] hover:border-white/[0.14] hover:bg-obsidian-850'
                  }`}
                >
                  {role === value && (
                    <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-indigo-500 flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-white stroke-[2.5]" />
                    </div>
                  )}
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                    role === value
                      ? `bg-${color}-500/25 text-${color}-300 border border-${color}-500/30`
                      : 'bg-obsidian-900 text-slate-400 border border-white/[0.07]'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className={`text-[11px] font-bold ${role === value ? `text-${color}-200` : 'text-white'}`}>
                      {label}
                    </div>
                    <div className={`text-[10px] mt-0.5 leading-tight ${role === value ? `text-${color}-300/70` : 'text-slate-500'}`}>
                      {desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Role description bar */}
            <div className={`flex items-center gap-2 p-2.5 rounded-xl bg-${selectedRole.color}-500/8 border border-${selectedRole.color}-500/15 text-xs`}>
              <Zap className={`h-3.5 w-3.5 text-${selectedRole.color}-400 shrink-0`} />
              <span className={`text-${selectedRole.color}-300/80 font-medium`}>
                <span className="font-bold text-white">{selectedRole.label}</span>: {selectedRole.desc}
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Alex Rivera"
                  className="w-full bg-obsidian-950 border border-white/[0.10] rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="alex@company.com"
                  className="w-full bg-obsidian-950 border border-white/[0.10] rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Choose a strong password"
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
                  Creating account...
                </span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-indigo-200" />
                  <span>Create {selectedRole.label} Account</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center border-t border-white/[0.07] pt-4">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-4 mt-5 text-[11px] text-slate-600">
          {['No credit card required', 'Free forever tier', 'Instant access'].map((t) => (
            <span key={t} className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-500/60" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
