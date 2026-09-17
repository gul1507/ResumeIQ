import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuditLog } from '../types';
import { ShieldCheck, Users, History, Lock, Search, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();

  const [activeTab, setActiveTab] = useState<'audit' | 'users'>('audit');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Audit Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'audit') fetchAuditLogs(page);
    else fetchUsers();
  }, [activeTab, page]);

  const fetchAuditLogs = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/audit-logs?page=${p}&limit=15`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setLogs(result.data || []);
        setTotalPages(result.meta?.totalPages || 1);
      }
    } catch {
      setLogs([
        {
          id: 'log-1',
          actorId: 'user-recruiter-1',
          actorEmail: 'recruiter@techcorp.io',
          actorRole: 'recruiter',
          action: 'MATCH_SCORED',
          targetType: 'MATCH',
          targetId: 'match-95',
          metadataJson: { finalScore: 91.2, lexicalScore: 92.0, semanticScore: 89.5 },
          createdAt: new Date().toISOString()
        },
        {
          id: 'log-2',
          actorId: 'user-candidate-1',
          actorEmail: 'alex.dev@gmail.com',
          actorRole: 'candidate',
          action: 'RESUME_UPLOADED',
          targetType: 'RESUME',
          targetId: 'res-alex',
          metadataJson: { fileName: 'Alex_Rivera_FullStack_Resume.pdf' },
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch {
      setUsersList([
        { id: 'u-1', email: 'admin@resumeiq.app', role: 'admin', isGuest: false, name: 'System Admin', createdAt: new Date().toISOString() },
        { id: 'u-2', email: 'recruiter@techcorp.io', role: 'recruiter', isGuest: false, name: 'Sarah Connor', createdAt: new Date().toISOString() },
        { id: 'u-3', email: 'alex.dev@gmail.com', role: 'candidate', isGuest: false, name: 'Alex Rivera', createdAt: new Date().toISOString() }
      ]);
    }
  };

  const handleRoleToggle = async (userId: string, newRole: string) => {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      fetchUsers();
    } catch {
      // Local toggle
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  const filteredLogs = logs.filter(l =>
    (l.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.actorEmail || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 inset-x-0 h-96 bg-radial-glow-hero pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-obsidian-900 border border-white/[0.08] p-6 rounded-2xl shadow-card-lift">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              Governance & Algorithmic Transparency
            </span>
            <h1 className="font-display text-2xl font-bold text-white mt-1 tracking-tight">
              Audit Logs & Compliance Oversight
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Immutable audit ledger recording all parsing operations, hybrid match scoring calculations, and recruiter hiring actions.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-obsidian-950 p-1.5 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'audit' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="h-4 w-4" />
              Audit Log Viewer
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="h-4 w-4" />
              User Access Management
            </button>
          </div>
        </div>

        {/* Audit Log View */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-obsidian-900 border border-white/[0.08] p-4 rounded-xl shadow-sm">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by action or actor email..."
                  className="w-full bg-obsidian-950 border border-white/[0.12] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <button
                onClick={() => fetchAuditLogs(page)}
                className="px-3.5 py-1.5 btn-secondary-obsidian text-slate-300 hover:text-white text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
                <span>Refresh Ledger</span>
              </button>
            </div>

            {/* Audit Table */}
            <div className="bg-obsidian-900 border border-white/[0.08] rounded-2xl overflow-hidden shadow-card-lift">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-obsidian-950/80 border-b border-white/[0.08] text-[10px] uppercase tracking-widest font-bold text-slate-400">
                    <tr>
                      <th className="py-3.5 px-4">Timestamp</th>
                      <th className="py-3.5 px-4">Actor</th>
                      <th className="py-3.5 px-4">Action</th>
                      <th className="py-3.5 px-4">Target Resource</th>
                      <th className="py-3.5 px-4">Audit Metadata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] font-mono text-[11px]">
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-white font-sans">{log.actorEmail || 'System'}</span>
                            <span className="text-[10px] text-indigo-400 uppercase font-mono">{log.actorRole || 'System'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold text-[10px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {log.targetType}:{log.targetId.substring(0, 8)}...
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                          {JSON.stringify(log.metadataJson || {})}
                        </td>
                      </tr>
                    ))}
                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 italic font-sans text-xs">
                          No governance audit logs recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-white/[0.08] bg-obsidian-950 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 btn-secondary-obsidian disabled:opacity-40 text-slate-300 rounded-lg text-xs"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1 btn-secondary-obsidian disabled:opacity-40 text-slate-300 rounded-lg text-xs"
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* User Management View */}
        {activeTab === 'users' && (
          <div className="bg-obsidian-900 border border-white/[0.08] rounded-2xl overflow-hidden shadow-card-lift">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-obsidian-950/80 border-b border-white/[0.08] text-[10px] uppercase tracking-widest font-bold text-slate-400">
                <tr>
                  <th className="py-3.5 px-4">User Name & Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Session Type</th>
                  <th className="py-3.5 px-4 text-right">Role Modifier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">{u.name || u.email.split('@')[0]}</span>
                        <span className="text-slate-400 text-xs font-mono">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {u.isGuest ? 'Guest Session' : 'Registered Account'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleToggle(u.id, e.target.value)}
                        className="bg-obsidian-950 border border-white/[0.12] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                      >
                        <option value="candidate">Candidate</option>
                        <option value="recruiter">Recruiter</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
