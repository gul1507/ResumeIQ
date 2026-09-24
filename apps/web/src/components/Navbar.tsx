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
  ChevronDown,
  Activity,
  CheckCircle2,
  Terminal,
  Cpu
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#070A10]/85 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Telemetry Tag */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link 
            to={user.role === 'recruiter' ? '/recruiter' : (user.role === 'admin' ? '/admin' : '/candidate')} 
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF5C00]/20 via-[#FF5C00]/10 to-transparent border border-[#FF5C00]/40 text-[#FF5C00] shadow-[0_0_20px_-3px_rgba(255,92,0,0.3)] group-hover:scale-105 group-hover:border-[#FF5C00] group-hover:shadow-[0_0_25px_0_rgba(255,92,0,0.5)] transition-all duration-300">
              <Cpu className="h-5 w-5 stroke-[2.2]" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#00F5A0] shadow-[0_0_6px_#00F5A0]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Resume<span className="text-[#FF5C00]">IQ</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono tracking-widest font-semibold uppercase bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                  v2.6 ATS
                </span>
              </span>
            </div>
          </Link>

          {/* Backend Telemetry Pulse */}
          <div className="hidden lg:flex items-center">
            {backendOnline === true ? (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#00F5A0]/10 border border-[#00F5A0]/25 text-[#00F5A0]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5A0] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F5A0]"></span>
                </span>
                <span>ENGINE ONLINE</span>
              </div>
            ) : (
              <div 
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 border border-amber-500/25 text-amber-300"
                title="API running with local simulated weights"
              >
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>STANDBY MODE</span>
              </div>
            )}
          </div>
        </div>

        {/* Primary Navigation Cockpit */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/candidate"
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              location.pathname.startsWith('/candidate')
                ? 'bg-white/[0.09] text-white border border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <FileText className={`h-3.5 w-3.5 ${location.pathname.startsWith('/candidate') ? 'text-[#FF5C00]' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Candidate Studio</span>
            {location.pathname.startsWith('/candidate') && (
              <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#FF5C00] to-transparent rounded-full" />
            )}
          </Link>

          <Link
            to="/recruiter"
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              location.pathname.startsWith('/recruiter')
                ? 'bg-white/[0.09] text-white border border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Briefcase className={`h-3.5 w-3.5 ${location.pathname.startsWith('/recruiter') ? 'text-[#00C9FF]' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Recruiter Pipeline</span>
            {location.pathname.startsWith('/recruiter') && (
              <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#00C9FF] to-transparent rounded-full" />
            )}
          </Link>

          <Link
            to="/admin"
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              location.pathname.startsWith('/admin')
                ? 'bg-white/[0.09] text-white border border-white/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <ShieldCheck className={`h-3.5 w-3.5 ${location.pathname.startsWith('/admin') ? 'text-[#00F5A0]' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Audit Logs</span>
            {location.pathname.startsWith('/admin') && (
              <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#00F5A0] to-transparent rounded-full" />
            )}
          </Link>
        </nav>

        {/* Right Actions: Persona Switcher & Sign Out */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1019] border border-white/[0.09] hover:border-white/[0.2] text-xs font-medium text-slate-200 transition-all shadow-sm active:scale-[0.98]"
              title="Quickly switch simulated persona"
            >
              <span className="h-2 w-2 rounded-full bg-[#FF5C00] shadow-[0_0_8px_#FF5C00]" />
              <span className="capitalize text-slate-200 font-semibold">{user.role}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0B1019] border border-white/[0.14] shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 z-50 backdrop-blur-2xl animate-fade-in-up">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-white/[0.08] mb-1.5 flex items-center justify-between">
                  <span>Switch Workspace</span>
                  <Terminal className="h-3 w-3 text-slate-500" />
                </div>
                {(['candidate', 'recruiter', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSwitch(r)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                      user.role === r
                        ? 'bg-[#FF5C00]/15 text-[#FF5C00] font-semibold border border-[#FF5C00]/25'
                        : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <span className="capitalize">{r === 'candidate' ? 'Candidate Studio' : (r === 'recruiter' ? 'Recruiter Pipeline' : 'Governance & Audit')}</span>
                    {user.role === r && <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5C00]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Sign Out Button */}
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B1019] hover:bg-[#141D2E] border border-white/[0.09] hover:border-[#FF2E63]/40 text-xs font-medium text-slate-300 hover:text-white transition-all active:scale-[0.98]"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5 text-[#FF2E63]" />
            <span className="hidden md:inline">Exit</span>
          </button>
        </div>

      </div>
    </header>
  );
};
