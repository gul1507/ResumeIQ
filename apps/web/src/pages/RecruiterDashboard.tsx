import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { JobPosting, MatchResult } from '../types';
import { ExplainabilityPanel } from '../components/ExplainabilityPanel';
import { FeedbackModal } from '../components/FeedbackModal';
import { EmptyState } from '../components/EmptyState';
import { DEMO_JOBS, DEMO_RECRUITER_CANDIDATES } from '../mockData';
import { 
  Briefcase, 
  Plus, 
  Users, 
  Search, 
  Filter, 
  Sparkles, 
  Eye, 
  Send, 
  Building, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Scale,
  ArrowUpDown,
  Check
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { token } = useAuth();

  const [jobs, setJobs] = useState<JobPosting[]>(DEMO_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>(DEMO_JOBS[0].id);
  const [candidates, setCandidates] = useState<MatchResult[]>(DEMO_RECRUITER_CANDIDATES);
  
  // Search, Status Filter & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'shortlisted' | 'pending' | 'rejected'>('all');
  const [sortOrder, setSortOrder] = useState<'score_desc' | 'score_asc'>('score_desc');

  // Modals & Panels
  const [showPostModal, setShowPostModal] = useState(false);
  const [activeExplainMatch, setActiveExplainMatch] = useState<MatchResult | null>(null);
  const [activeFeedbackMatch, setActiveFeedbackMatch] = useState<MatchResult | null>(null);

  // Post Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('TechCorp Autonomous Systems');
  const [newLocation, setNewLocation] = useState('San Francisco, CA / Remote');
  const [newDesc, setNewDesc] = useState('');
  const [extractingReqs, setExtractingReqs] = useState(false);
  const [extractedReqs, setExtractedReqs] = useState<any[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchCandidates(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
          setSelectedJobId(data[0].id);
          return;
        }
      }
    } catch {
      // Fallback
      setJobs(DEMO_JOBS);
      setSelectedJobId(DEMO_JOBS[0].id);
    }
  };

  const fetchCandidates = async (jobId: string) => {
    try {
      const res = await fetch(`/api/matches/job/${jobId}/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCandidates(data);
          return;
        }
      }
    } catch {
      // Fallback
    }
    setCandidates(DEMO_RECRUITER_CANDIDATES);
  };

  const handleExtractRequirements = async () => {
    if (!newDesc) return;
    setExtractingReqs(true);
    try {
      const res = await fetch('/api/jobs/extract-requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ descriptionRaw: newDesc })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.requirements && data.requirements.length > 0) {
          setExtractedReqs(data.requirements);
          return;
        }
      }
    } catch {
      // Fallback parser
    }

    // Dynamic keyword extractor fallback
    const textLower = newDesc.toLowerCase();
    const knownConcepts = [
      ["distributed systems", "Distributed Systems"],
      ["microservices", "Microservices Architecture"],
      ["typescript", "TypeScript"],
      ["react", "React"],
      ["node.js", "Node.js"],
      ["python", "Python"],
      ["fastapi", "FastAPI"],
      ["vector db", "Vector DB"],
      ["kubernetes", "Kubernetes"],
      ["docker", "Docker"],
      ["aws", "AWS"],
      ["kafka", "Kafka"],
      ["redis", "Redis"],
      ["postgresql", "PostgreSQL"],
      ["security", "Threat Detection"]
    ];

    const detected: any[] = [];
    for (const [k, name] of knownConcepts) {
      if (textLower.includes(k)) {
        detected.push({
          skill: name,
          importance: detected.length < 4 ? 'must_have' : 'nice_to_have',
          confidence: 0.95
        });
      }
    }

    if (detected.length === 0) {
      detected.push(
        { skill: 'TypeScript', importance: 'must_have', confidence: 0.9 },
        { skill: 'Distributed Architecture', importance: 'must_have', confidence: 0.88 },
        { skill: 'REST APIs', importance: 'nice_to_have', confidence: 0.85 }
      );
    }
    setExtractedReqs(detected);
    setExtractingReqs(false);
  };

  const handlePostJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: JobPosting = {
      id: `job-custom-${Date.now()}`,
      recruiterId: 'recruiter-current',
      title: newTitle,
      companyName: newCompany,
      location: newLocation,
      descriptionRaw: newDesc,
      requirements: extractedReqs.length > 0 ? extractedReqs : [
        { skill: 'TypeScript', importance: 'must_have', confidence: 0.95 },
        { skill: 'React', importance: 'must_have', confidence: 0.90 }
      ],
      candidateCount: 0,
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newJob)
      });
    } catch {
      // Local state fallback
    }

    setJobs([newJob, ...jobs]);
    setSelectedJobId(newJob.id);
    setShowPostModal(false);
    setNewTitle('');
    setNewDesc('');
    setExtractedReqs([]);
  };

  const handleSendFeedbackSubmit = async (status: 'shortlisted' | 'rejected' | 'feedback_sent', message: string) => {
    if (!activeFeedbackMatch) return;
    
    // Update local state immediately for snappy response
    setCandidates(prev => prev.map(c => 
      c.id === activeFeedbackMatch.id ? { ...c, feedbackStatus: status as any, feedbackMessage: message } : c
    ));

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          matchId: activeFeedbackMatch.id,
          status,
          message
        })
      });
    } catch {
      // Handled via local state
    }
  };

  // Filtered & Sorted Candidates
  const filteredCandidates = candidates
    .filter(c => {
      const matchesQuery = 
        (c.candidateName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.matchedSkills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      if (statusFilter === 'shortlisted') return matchesQuery && c.feedbackStatus === 'shortlisted';
      if (statusFilter === 'pending') return matchesQuery && (!c.feedbackStatus || c.feedbackStatus === 'pending');
      if (statusFilter === 'rejected') return matchesQuery && c.feedbackStatus === 'rejected';
      return matchesQuery;
    })
    .sort((a, b) => {
      if (sortOrder === 'score_desc') return b.finalScore - a.finalScore;
      return a.finalScore - b.finalScore;
    });

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0] || DEMO_JOBS[0];

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 inset-x-0 h-96 bg-radial-glow-hero pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1019]/85 border border-white/[0.09] p-6 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#00C9FF]">
              Recruiter Talent Evaluation Command
            </span>
            <h1 className="font-display text-2xl font-bold text-white mt-1 tracking-tight">
              Candidate Pipeline & Explainable Ranking Grid
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl font-sans">
              Deterministic ranking of applicant pool weighted by lexical keyword coverage and semantic similarity. Audit every recommendation with explainable score breakdowns.
            </p>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="px-4 py-2.5 btn-primary-glow text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create Requisition</span>
          </button>
        </div>

        {/* Main Grid: Job Selector Sidebar + Candidates Table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar: Requisitions */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[#00C9FF]" />
                Active Requisitions ({jobs.length})
              </h3>
            </div>

            <div className="space-y-2">
              {jobs.map(j => (
                <button
                  key={j.id}
                  onClick={() => setSelectedJobId(j.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                    selectedJobId === j.id
                      ? 'bg-[#00C9FF]/15 border-[#00C9FF]/50 shadow-[0_0_15px_rgba(0,201,255,0.25)] text-white'
                      : 'bg-[#0B1019] border-white/[0.06] text-slate-300 hover:bg-[#0F1623] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-xs truncate max-w-[170px] font-display">{j.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#05070B] text-[#00C9FF] border border-white/[0.08]">
                      {j.candidateCount ?? 0}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {j.companyName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Table Area */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Filter & Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0B1019]/85 border border-white/[0.09] p-4 rounded-xl shadow-sm backdrop-blur-xl">
              
              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidate name or skill..."
                  className="w-full bg-[#05070B] border border-white/[0.12] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00C9FF] transition-colors font-sans"
                />
              </div>

              {/* Status Filter Pills & Sort Toggle */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-1 bg-[#05070B] p-1 rounded-lg border border-white/[0.06]">
                  {(['all', 'shortlisted', 'pending', 'rejected'] as const).map((filterKey) => (
                    <button
                      key={filterKey}
                      onClick={() => setStatusFilter(filterKey)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-all ${
                        statusFilter === filterKey
                          ? 'bg-[#FF5C00] text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filterKey}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSortOrder(sortOrder === 'score_desc' ? 'score_asc' : 'score_desc')}
                  className="p-1.5 rounded-lg btn-secondary-obsidian text-slate-300 hover:text-white"
                  title="Toggle score sort order"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </div>

            </div>

            {/* High Density Candidates Table */}
            <div className="bg-obsidian-900 border border-white/[0.08] rounded-2xl overflow-hidden shadow-card-lift">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-obsidian-950/80 border-b border-white/[0.08] text-[10px] uppercase tracking-widest font-bold text-slate-400">
                    <tr>
                      <th className="py-3.5 px-4">Candidate & Resume</th>
                      <th className="py-3.5 px-4">Hybrid Match Score</th>
                      <th className="py-3.5 px-4">Matched / Missing Skills</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {filteredCandidates.map((cand, idx) => (
                      <tr key={cand.id} className="hover:bg-white/[0.03] transition-colors">
                        
                        {/* Candidate Column */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm flex items-center gap-1.5">
                              {cand.candidateName}
                              <span className="text-[10px] font-mono font-normal text-slate-400">#{idx + 1}</span>
                            </span>
                            <span className="text-[11px] text-slate-400 mt-0.5">{cand.resumeFileName}</span>
                          </div>
                        </td>

                        {/* Hybrid Score Column */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-base text-white">
                                {cand.finalScore.toFixed(1)}%
                              </span>
                              <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold border ${
                                cand.finalScore >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                                (cand.finalScore >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' : 'bg-rose-500/10 text-rose-400 border-rose-500/25')
                              }`}>
                                {cand.finalScore >= 80 ? 'Tier 1' : (cand.finalScore >= 60 ? 'Tier 2' : 'Tier 3')}
                              </span>
                            </div>
                            
                            <div className="h-1.5 w-28 bg-obsidian-950 rounded-full mt-1.5 overflow-hidden border border-white/[0.06]">
                              <div 
                                className={`h-full ${cand.finalScore >= 80 ? 'bg-emerald-400' : (cand.finalScore >= 60 ? 'bg-amber-400' : 'bg-rose-400')}`} 
                                style={{ width: `${cand.finalScore}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Skills Column */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap gap-1">
                              {cand.matchedSkills.slice(0, 3).map((s, i) => (
                                <span key={i} className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded-md text-[10px] font-medium border border-emerald-500/20">
                                  {s}
                                </span>
                              ))}
                              {cand.matchedSkills.length > 3 && (
                                <span className="text-[10px] text-slate-400 font-mono">+{cand.matchedSkills.length - 3}</span>
                              )}
                            </div>
                            {cand.missingSkills.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {cand.missingSkills.slice(0, 2).map((s, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded-md text-[10px] font-medium border border-amber-500/20">
                                    Missing: {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Feedback Status */}
                        <td className="py-4 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize border inline-flex items-center gap-1 ${
                            cand.feedbackStatus === 'shortlisted' ? 'bg-[#00F5A0]/10 text-[#00F5A0] border-[#00F5A0]/30' :
                            (cand.feedbackStatus === 'rejected' ? 'bg-[#FF2E63]/10 text-[#FF2E63] border-[#FF2E63]/30' :
                            (cand.feedbackStatus === 'feedback_sent' ? 'bg-[#00C9FF]/10 text-[#00C9FF] border-[#00C9FF]/30' : 'bg-[#05070B] text-slate-400 border-white/[0.08]'))
                          }`}>
                            {cand.feedbackStatus || 'Pending'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setActiveExplainMatch(cand)}
                              className="px-3 py-1.5 btn-secondary-obsidian text-slate-200 hover:text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition-all"
                            >
                              <Eye className="h-3.5 w-3.5 text-[#00C9FF]" />
                              <span>Analyze</span>
                            </button>

                            <button
                              onClick={() => setActiveFeedbackMatch(cand)}
                              className="px-3 py-1.5 btn-primary-glow text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>Feedback</span>
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}

                    {filteredCandidates.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500 italic text-xs">
                          No candidates matching current search query or filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

        {/* Explainability Drawer */}
        <ExplainabilityPanel
          match={activeExplainMatch}
          onClose={() => setActiveExplainMatch(null)}
          onSendFeedbackClick={() => {
            if (activeExplainMatch) {
              setActiveFeedbackMatch(activeExplainMatch);
              setActiveExplainMatch(null);
            }
          }}
        />

        {/* Feedback Modal */}
        {activeFeedbackMatch && (
          <FeedbackModal
            matchId={activeFeedbackMatch.id}
            candidateName={activeFeedbackMatch.candidateName || 'Candidate'}
            onClose={() => setActiveFeedbackMatch(null)}
            onSubmit={handleSendFeedbackSubmit}
          />
        )}

        {/* Post Job Modal */}
        {showPostModal && (
          <div className="fixed inset-0 z-50 bg-[#05070B]/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in-up">
            <div className="w-full max-w-xl bg-[#0B1019] border border-white/[0.12] rounded-2xl p-6 shadow-[0_24px_60px_rgba(0,0,0,0.9)] space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h3 className="font-display text-lg font-bold text-white">Create New Job Posting</h3>
                <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handlePostJobSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Job Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    placeholder="e.g. Senior Distributed Systems Engineer"
                    className="w-full bg-[#05070B] border border-white/[0.12] rounded-xl p-2.5 text-white focus:outline-none focus:border-[#FF5C00] font-sans"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Raw Job Description Text</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={4}
                    required
                    placeholder="Paste responsibilities & required technical stack..."
                    className="w-full bg-[#05070B] border border-white/[0.12] rounded-xl p-3 text-slate-200 focus:outline-none focus:border-[#FF5C00] font-sans"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleExtractRequirements}
                    disabled={!newDesc || extractingReqs}
                    className="px-3.5 py-2 btn-secondary-obsidian text-[#FFA133] font-semibold rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#FF5C00]" />
                    <span>{extractingReqs ? 'Extracting Skills...' : 'Auto-Extract Requirements (NER)'}</span>
                  </button>
                </div>

                {extractedReqs.length > 0 && (
                  <div className="p-3 bg-[#05070B] border border-white/[0.08] rounded-xl space-y-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block font-mono">
                      Auto-Tagged Requisition Requirements ({extractedReqs.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {extractedReqs.map((req, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-[#FFA133]/10 text-[#FFA133] border border-[#FFA133]/25 text-[11px] font-mono font-medium">
                          {req.skill} ({req.importance === 'must_have' ? 'Required' : 'Nice to have'})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-4 py-2 btn-secondary-obsidian text-slate-300 font-medium rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 btn-primary-glow text-white font-bold rounded-xl shadow-md"
                  >
                    Publish Job Posting
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
