import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Sparkles, 
  FileText, 
  Briefcase, 
  ShieldCheck, 
  LogOut, 
  User as UserIcon,
  ChevronDown,
  Activity,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Check backend heartbeat
  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch('/api/jobs', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (isMounted) setBackendOnline(res.ok);
      } catch {
        if (isMounted) setBackendOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!user) return null;

  const handleRoleSwitch = (newRole: UserRole) => {
    setRoleMenuOpen(false);
    if (user.role === newRole) return;
    
    // Switch role in user state
    const updatedUser = { ...user, role: newRole };
    localStorage.setItem('resumeiq_user', JSON.stringify(updatedUser));
    window.location.href = newRole === 'recruiter' ? '/recruiter' : (newRole === 'admin' ? '/admin' : '/candidate');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#080C14]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Status */}
        <div className="flex items-center gap-6">
          <Link 
            to={user.role === 'recruiter' ? '/recruiter' : (user.role === 'admin' ? '/admin' : '/candidate')} 
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 group-hover:shadow-glow-indigo transition-all duration-300">
              <Sparkles className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-1">
                Resume<span className="text-indigo-400">IQ</span>
              </span>
            </div>
          </Link>

          {/* Backend Status Indicator Pill */}
          <div className="hidden md:flex items-center">
            {backendOnline === true ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>API Connected</span>
              </div>
            ) : (
              <div 
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-300"
                title="API is currently running in offline fallback mode with simulated AI embeddings"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>Demo Mode (Active Fallback)</span>
              </div>
            )}
          </div>
        </div>

        {/* Primary Role Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/candidate"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              location.pathname.startsWith('/candidate')
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Candidate Studio</span>
          </Link>

          <Link
            to="/recruiter"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              location.pathname.startsWith('/recruiter')
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Recruiter Pipeline</span>
          </Link>

          <Link
            to="/admin"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              location.pathname.startsWith('/admin')
                ? 'bg-white/[0.08] text-white border border-white/[0.12] shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Audit Logs</span>
          </Link>
        </nav>

        {/* Right Actions: Role Switcher Dropdown & User Menu */}
        <div className="flex items-center gap-3">
          
          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-850 border border-white/[0.08] hover:border-white/[0.16] text-xs font-medium text-slate-200 transition-all shadow-sm active:scale-[0.98]"
              title="Quickly switch simulated persona"
            >
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span className="capitalize text-slate-300 font-semibold">{user.role}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-obsidian-900 border border-white/[0.12] shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in-50 zoom-in-95">
                <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-white/[0.06] mb-1">
                  Switch Active Role
                </div>
                {(['candidate', 'recruiter', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSwitch(r)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      user.role === r
                        ? 'bg-indigo-500/15 text-indigo-300 font-semibold'
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <span className="capitalize">{r}</span>
                    {user.role === r && <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Sign Out Button */}
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-white/[0.08] hover:border-white/[0.16] text-xs font-medium text-slate-300 hover:text-white transition-all active:scale-[0.98]"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-400" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>

      </div>
    </header>
  );
};
