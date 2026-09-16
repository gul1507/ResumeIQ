import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  FileText, 
  Briefcase, 
  ShieldCheck, 
  LogOut,
  User as UserIcon
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#090d16]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link 
          to={user.role === 'recruiter' ? '/recruiter' : (user.role === 'admin' ? '/admin' : '/candidate')} 
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 group-hover:bg-teal-500/20 transition-all">
            <Sparkles className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight text-white flex items-center gap-1">
              Resume<span className="text-teal-400">IQ</span>
              <span className="ml-2 uppercase tracking-wider rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-teal-400 border border-slate-800">
                {user.role} Portal
              </span>
            </span>
          </div>
        </Link>

        {/* Role Specific Navigation Links */}
        <nav className="flex items-center gap-2">
          {user.role === 'candidate' && (
            <Link
              to="/candidate"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                location.pathname.startsWith('/candidate')
                  ? 'bg-slate-800 text-teal-300 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <FileText className="h-4 w-4" />
              Candidate Workspace
            </Link>
          )}

          {user.role === 'recruiter' && (
            <Link
              to="/recruiter"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                location.pathname.startsWith('/recruiter')
                  ? 'bg-slate-800 text-teal-300 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Recruiter Dashboard & Job Management
            </Link>
          )}

          {user.role === 'admin' && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                location.pathname.startsWith('/admin')
                  ? 'bg-slate-800 text-teal-300 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Governance & Audit Logs
            </Link>
          )}
        </nav>

        {/* Logged In User Profile Badge & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <UserIcon className="h-3.5 w-3.5 text-teal-400" />
            <div className="flex flex-col text-xs">
              <span className="font-semibold text-white">{user.name || user.email.split('@')[0]}</span>
              <span className="text-[10px] text-slate-400 capitalize">{user.role} Account</span>
            </div>
          </div>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5 text-rose-400" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

      </div>
    </header>
  );
};
