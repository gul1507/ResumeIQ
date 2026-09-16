import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { JobPosting, MatchResult } from '../types';
import { ExplainabilityPanel } from '../components/ExplainabilityPanel';
import { FeedbackModal } from '../components/FeedbackModal';
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
  Scale
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { token } = useAuth();

  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [candidates, setCandidates] = useState<MatchResult[]>([]);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'strong' | 'moderate' | 'weak'>('all');

  // Modals & Panels
  const [showPostModal, setShowPostModal] = useState(false);
  const [activeExplainMatch, setActiveExplainMatch] = useState<MatchResult | null>(null);
  const [activeFeedbackMatch, setActiveFeedbackMatch] = useState<MatchResult | null>(null);

  // Post Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('TechCorp Innovation Labs');
  const [newLocation, setNewLocation] = useState('Remote / SF');
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
        setJobs(data);
        if (data.length > 0) setSelectedJobId(data[0].id);
      }
    } catch (e) {
      console.warn('Error fetching recruiter jobs:', e);
    }
  };

  const fetchCandidates = async (jobId: string) => {
    try {
      const res = await fetch(`/api/matches/job/${jobId}/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
      }
    } catch (e) {
      console.warn('Error fetching candidates:', e);
    }
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
      const data = await res.json();
      if (res.ok) {
        setExtractedReqs(data.requirements || []);
      }
    } catch (e) {
      const textLower = newDesc.toLowerCase();
      const dynamicReqs: any[] = [];
      const seen = new Set();

      const knownConcepts = [
        ["vulnerability assessment", "Vulnerability Assessment"],
        ["incident response", "Incident Response"],
        ["security monitoring", "Security Monitoring"],
        ["threat detection", "Threat Detection"],
        ["defensive controls", "Defensive Controls"],
        ["threat intelligence", "Threat Intelligence"],
        ["mitre att&ck", "MITRE ATT&CK"],
        ["cybersecurity", "Cybersecurity"],
        ["network security", "Network Security"],
        ["machine learning", "Machine Learning"],
        ["ai models", "AI Models"],
        ["data preprocessing", "Data Preprocessing"],
        ["model development", "Model Development"],
        ["model optimization", "Model Optimization"],
        ["model deployment", "Model Deployment"],
        ["performance monitoring", "Performance Monitoring"],
        ["firewalls", "Firewalls"],
        ["ids/ips", "IDS/IPS"],
        ["siem", "SIEM"],
        ["linux", "Linux"],
        ["python", "Python"],
        ["networking", "Networking"]
      ];

      for (const [key, display] of knownConcepts) {
        if (textLower.includes(key) && !seen.has(display.toLowerCase())) {
          seen.add(display.toLowerCase());
          dynamicReqs.push({
            skill: display,
            importance: dynamicReqs.length < 4 ? 'must_have' : 'nice_to_have',
            confidence: 0.95
          });
        }
      }

      if (dynamicReqs.length === 0) {
        const rawItems = newDesc.split(/[,;\n]+|\band\b/i).map(s => s.trim()).filter(Boolean);
        const invalidStandalone = new Set(['designs', 'implements', 'maintains', 'protect', 'role', 'involves', 'improving', 'applications', 'systems', 'networks', 'solutions']);
        for (let raw of rawItems) {
          if (/\b(designs|implements|maintains|protect|involves|improving)\b/i.test(raw)) continue;
          let clean = raw.replace(/^(such as|including|like|and|or|etc\.?|knowledge of|experience with)\s+/i, '').trim();
          clean = clean.replace(/[.:;!]+$/, '').trim();

          if (clean.length >= 2 && clean.length <= 35 && !invalidStandalone.has(clean.toLowerCase()) && !seen.has(clean.toLowerCase())) {
            seen.add(clean.toLowerCase());
            let formatted = clean;
            if (!/^[A-Z0-9\/& -]+$/.test(clean) && !/[A-Z]/.test(clean.substring(1))) {
              formatted = clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            }
            dynamicReqs.push({
              skill: formatted,
              importance: dynamicReqs.length < 4 ? 'must_have' : 'nice_to_have',
              confidence: 0.90
            });
          }
        }
      }

      setExtractedReqs(dynamicReqs);
    } finally {
      setExtractingReqs(false);
    }
  };

  const handlePostJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          companyName: newCompany,
          location: newLocation,
          descriptionRaw: newDesc,
          customRequirements: extractedReqs
        })
      });
      if (res.ok) {
        const postedJob = await res.json();
        fetchJobs();
        setSelectedJobId(postedJob.id);
        setShowPostModal(false);
        setNewTitle('');
        setNewDesc('');
        setExtractedReqs([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendFeedbackSubmit = async (status: 'shortlisted' | 'rejected' | 'feedback_sent', message: string) => {
    if (!activeFeedbackMatch) return;
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
      fetchCandidates(selectedJobId);
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered Candidates
  const filteredCandidates = candidates.filter(c => {
    const matchesQuery = 
      (c.candidateName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.matchedSkills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (scoreFilter === 'strong') return matchesQuery && c.finalScore >= 85;
    if (scoreFilter === 'moderate') return matchesQuery && c.finalScore >= 70 && c.finalScore < 85;
    if (scoreFilter === 'weak') return matchesQuery && c.finalScore < 70;
    return matchesQuery;
  });

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Recruiter Talent Evaluation</span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Applicant Ranking & Explainable ATS Grid
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            View ranked applicants with explicit lexical vs semantic breakdown, inspect matched/missing skill matrices, and issue structured candidate feedback.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Post New Job Posting
        </button>
      </div>

      {/* Main Grid: Job Selector Sidebar + Candidate Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar: Job Postings List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-teal-400" />
            Active Job Requisitions ({jobs.length})
          </h3>

          <div className="space-y-2">
            {jobs.map(j => (
              <button
                key={j.id}
                onClick={() => setSelectedJobId(j.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  selectedJobId === j.id
                    ? 'bg-slate-800 border-teal-500 shadow-md text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-semibold text-xs truncate max-w-[170px]">{j.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-teal-300 border border-slate-800">
                    {j.candidateCount ?? 0} Apps
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

        {/* Main Content Area: Candidate Ranking Grid */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Controls Bar: Search & Score Filter Pills */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter candidate or skill..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Score Filter:</span>
              
              <button
                onClick={() => setScoreFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  scoreFilter === 'all' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({candidates.length})
              </button>

              <button
                onClick={() => setScoreFilter('strong')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  scoreFilter === 'strong' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                Strong (≥85%)
              </button>

              <button
                onClick={() => setScoreFilter('moderate')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  scoreFilter === 'moderate' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                Moderate (70-84%)
              </button>

              <button
                onClick={() => setScoreFilter('weak')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  scoreFilter === 'weak' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                Weak (&lt;70%)
              </button>
            </div>

          </div>

          {/* High Density Candidate Ranking Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4">Candidate & Resume</th>
                    <th className="py-3.5 px-4">Hybrid Match Score</th>
                    <th className="py-3.5 px-4">Matched / Missing Skills</th>
                    <th className="py-3.5 px-4 text-center">Feedback Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredCandidates.map((cand, idx) => (
                    <tr key={cand.id} className="hover:bg-slate-800/40 transition-colors">
                      
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

                      {/* Hybrid Score Column with Mini Bar */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-base text-white">
                              {cand.finalScore.toFixed(1)}%
                            </span>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-semibold border ${
                              cand.finalScore >= 85 ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                              (cand.finalScore >= 70 ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-rose-950 text-rose-300 border-rose-800')
                            }`}>
                              {cand.finalScore >= 85 ? 'Strong' : (cand.finalScore >= 70 ? 'Moderate' : 'Weak')}
                            </span>
                          </div>
                          
                          {/* Mini Progress Bar */}
                          <div className="h-1.5 w-28 bg-slate-950 rounded-full mt-1.5 overflow-hidden border border-slate-800">
                            <div 
                              className={`h-full ${cand.finalScore >= 85 ? 'bg-emerald-400' : (cand.finalScore >= 70 ? 'bg-amber-400' : 'bg-rose-400')}`} 
                              style={{ width: `${cand.finalScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Matched vs Missing Skill Tags */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap gap-1">
                            {cand.matchedSkills.slice(0, 3).map((s, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-emerald-950/80 text-emerald-300 rounded text-[10px] font-medium border border-emerald-800/60">
                                {s}
                              </span>
                            ))}
                            {cand.matchedSkills.length > 3 && (
                              <span className="text-[10px] text-slate-400 font-mono">+{cand.matchedSkills.length - 3} more</span>
                            )}
                          </div>
                          {cand.missingSkills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {cand.missingSkills.slice(0, 2).map((s, i) => (
                                <span key={i} className="px-1.5 py-0.5 bg-amber-950/80 text-amber-300 rounded text-[10px] font-medium border border-amber-800/60">
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
                          cand.feedbackStatus === 'shortlisted' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                          (cand.feedbackStatus === 'rejected' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                          (cand.feedbackStatus === 'feedback_sent' ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-slate-950 text-slate-400 border-slate-800'))
                        }`}>
                          {cand.feedbackStatus || 'Pending'}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveExplainMatch(cand)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium rounded-lg text-xs border border-slate-700 flex items-center gap-1 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Explainability
                          </button>

                          <button
                            onClick={() => setActiveFeedbackMatch(cand)}
                            className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm transition-all"
                          >
                            <Send className="h-3.5 w-3.5" />
                            Feedback
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

      {/* Explainability Slide-Over Panel */}
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

      {/* Structured Feedback Modal */}
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#090d16] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
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
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-teal-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleExtractRequirements}
                  disabled={!newDesc || extractingReqs}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                  {extractingReqs ? 'Extracting Skills...' : 'Auto-Extract Requirements (Gemini NER)'}
                </button>
              </div>

              {extractedReqs.length > 0 && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <span className="text-slate-400 font-semibold block">Extracted Requirements Preview ({extractedReqs.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedReqs.map((req, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 text-[11px] font-medium">
                        {req.skill} ({req.importance})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg shadow-md"
                >
                  Publish Job Posting
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
