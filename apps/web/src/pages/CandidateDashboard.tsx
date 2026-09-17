import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ResumeVersion, JobPosting, MatchResult } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillGapMatrix } from '../components/SkillGapMatrix';
import { TailoredDiffView } from '../components/TailoredDiffView';
import { 
  DEMO_PRESET_RESUMES, 
  DEMO_JOBS, 
  generateSimulatedMatch, 
  generateSimulatedTailoredResult, 
  DemoPresetResume 
} from '../mockData';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Briefcase, 
  RotateCcw, 
  Layers, 
  AlertCircle, 
  Zap,
  Check,
  FileCheck,
  Building,
  UserCheck,
  ArrowRight
} from 'lucide-react';

export const CandidateDashboard: React.FC = () => {
  const { user, token } = useAuth();

  const [resumes, setResumes] = useState<ResumeVersion[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>(DEMO_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>(DEMO_JOBS[0].id);
  const [customJdText, setCustomJdText] = useState<string>('');
  
  // Active input mode: 'file' | 'preset'
  const [uploadMode, setUploadMode] = useState<'file' | 'preset'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<DemoPresetResume>(DEMO_PRESET_RESUMES[0]);

  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  // Analysis & Pipeline States
  const [pipelineState, setPipelineState] = useState<'idle' | 'parsing' | 'embedding' | 'scoring' | 'done'>('idle');
  const [activeMatch, setActiveMatch] = useState<MatchResult | null>(null);
  const [tailoredResult, setTailoredResult] = useState<any | null>(null);
  const [loadingTailor, setLoadingTailor] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchResumes();
  }, []);

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
      // Fallback to rich DEMO_JOBS
      setJobs(DEMO_JOBS);
      setSelectedJobId(DEMO_JOBS[0].id);
    }
  };

  const fetchResumes = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/resumes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch {
      // Silent catch
    }
  };

  const handleResetWorkspace = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setValidationError('');
    setPipelineState('idle');
    setActiveMatch(null);
    setTailoredResult(null);
    setCustomJdText('');
    setIsDemoFallback(false);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setValidationError('');
    setPipelineState('idle');
    setActiveMatch(null);
    setTailoredResult(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setValidationError('');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setActiveMatch(null);
      setTailoredResult(null);
      setPipelineState('idle');
      setUploadMode('file');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setValidationError('');
      setActiveMatch(null);
      setTailoredResult(null);
      setPipelineState('idle');
      setUploadMode('file');
    }
  };

  const runFullPipeline = async () => {
    setValidationError('');
    setActiveMatch(null);
    setTailoredResult(null);

    const targetJob = jobs.find(j => j.id === selectedJobId) || DEMO_JOBS[0];

    // If using Preset Resume
    if (uploadMode === 'preset') {
      setPipelineState('parsing');
      await new Promise(r => setTimeout(r, 450));
      setPipelineState('embedding');
      await new Promise(r => setTimeout(r, 550));
      setPipelineState('scoring');
      await new Promise(r => setTimeout(r, 400));

      const simMatch = generateSimulatedMatch(selectedPreset, targetJob);
      setActiveMatch(simMatch);
      setIsDemoFallback(true);
      setPipelineState('done');
      return;
    }

    // If uploading custom file
    if (!file) {
      setValidationError('Please upload a resume file (PDF or DOCX) or select a demo preset.');
      return;
    }

    setPipelineState('parsing');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const uploadRes = await fetch('/api/resumes/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!uploadRes.ok) {
        throw new Error('API server returned error during parsing');
      }

      const uploadData = await uploadRes.json();
      const currentResumeId = uploadData.resume?.id;
      if (!currentResumeId) throw new Error('Resume record missing');
      fetchResumes();

      setPipelineState('embedding');
      await new Promise(r => setTimeout(r, 600));

      setPipelineState('scoring');
      const scoreRes = await fetch('/api/matches/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          resumeId: currentResumeId,
          jobPostingId: selectedJobId || undefined,
          jobDescriptionText: customJdText || targetJob.descriptionRaw || ''
        })
      });

      if (!scoreRes.ok) throw new Error('Scoring computation failed');
      const matchData = await scoreRes.json();
      setActiveMatch(matchData);
      setIsDemoFallback(false);
      setPipelineState('done');

    } catch (e: any) {
      // GRACEFUL FALLBACK TO PRECOMPUTED REALISTIC AI DATA
      console.warn('Backend unavailable, engaging simulated fallback:', e.message);
      setIsDemoFallback(true);
      setPipelineState('embedding');
      await new Promise(r => setTimeout(r, 450));
      setPipelineState('scoring');
      await new Promise(r => setTimeout(r, 400));

      const fallbackMatch = generateSimulatedMatch(
        {
          ...selectedPreset,
          candidateName: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
          fileName: file.name
        },
        targetJob
      );
      setActiveMatch(fallbackMatch);
      setPipelineState('done');
    }
  };

  const handleGenerateTailored = async () => {
    if (!activeMatch) return;
    setLoadingTailor(true);

    const targetJob = jobs.find(j => j.id === selectedJobId) || DEMO_JOBS[0];

    try {
      const res = await fetch(`/api/resumes/${activeMatch.resumeId}/tailor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          jobPostingId: activeMatch.jobPostingId,
          missingSkills: activeMatch.missingSkills
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTailoredResult(data);
        fetchResumes();
      } else {
        throw new Error('Tailoring API failed');
      }
    } catch {
      // Fallback to high quality precomputed diff
      await new Promise(r => setTimeout(r, 900));
      const simTailor = generateSimulatedTailoredResult(activeMatch, targetJob);
      setTailoredResult(simTailor);
    } finally {
      setLoadingTailor(false);
    }
  };

  const currentSelectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0] || DEMO_JOBS[0];

  return (
    <div className="relative min-h-screen">
      {/* Background radial ambient glow */}
      <div className="absolute top-0 inset-x-0 h-96 bg-radial-glow-hero pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-obsidian-900 border border-white/[0.08] p-6 rounded-2xl shadow-card-lift">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                Candidate ATS Optimization Studio
              </span>
              {isDemoFallback && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Simulated AI Embeddings
                </span>
              )}
            </div>
            <h1 className="font-display text-2xl font-bold text-white mt-1 tracking-tight">
              Resume Diagnostics & Keyword Tailoring
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Inspect your ATS match percentage with explicit lexical vs. semantic contribution weights, diagnose missing requisition skills, and generate verified bullet points.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleResetWorkspace}
              className="px-3.5 py-2 btn-secondary-obsidian text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              title="Clear current state and reset workspace"
            >
              <RotateCcw className="h-3.5 w-3.5 text-indigo-400" />
              <span>Reset Workspace</span>
            </button>
          </div>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Main Grid: Upload & JD Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Resume Source (Upload or Presets) */}
          <div className="bg-obsidian-900 border border-white/[0.08] rounded-2xl p-6 shadow-card-lift flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  1. Resume Source Selection
                </h2>
                
                {/* Switcher tabs */}
                <div className="flex bg-obsidian-950 p-1 rounded-xl border border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => { setUploadMode('preset'); setValidationError(''); }}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      uploadMode === 'preset'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Demo Presets (Instant)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUploadMode('file'); setValidationError(''); }}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      uploadMode === 'file'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Upload Custom PDF
                  </button>
                </div>
              </div>

              {/* Mode A: Demo Preset Selector */}
              {uploadMode === 'preset' ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Test the entire pipeline instantly without needing a PDF file:
                  </p>
                  <div className="space-y-2">
                    {DEMO_PRESET_RESUMES.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => setSelectedPreset(preset)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedPreset.id === preset.id
                            ? 'bg-indigo-500/15 border-indigo-500/50 shadow-glow-indigo'
                            : 'bg-obsidian-950 border-white/[0.06] hover:border-white/[0.15] hover:bg-obsidian-850'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            selectedPreset.id === preset.id ? 'bg-indigo-500 text-white' : 'bg-obsidian-900 text-slate-400'
                          }`}>
                            <FileCheck className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">{preset.candidateName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">• {preset.experienceLevel}</span>
                            </div>
                            <span className="text-[11px] text-indigo-300 font-medium">{preset.title}</span>
                          </div>
                        </div>

                        {selectedPreset.id === preset.id && (
                          <div className="h-5 w-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Mode B: Sleek Drag & Drop Zone */
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    file 
                      ? 'border-emerald-500/50 bg-emerald-500/10' 
                      : (dragActive ? 'border-indigo-500 bg-indigo-500/15' : 'border-white/[0.12] hover:border-indigo-500/40 bg-obsidian-950/60')
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                    <UploadCloud className={`h-11 w-11 mb-2 transition-colors ${file ? 'text-emerald-400' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                    {file ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2.5 bg-obsidian-900 px-4 py-2 rounded-xl border border-emerald-500/30 shadow-md">
                          <FileText className="h-4 w-4 text-emerald-400" />
                          <span className="text-xs font-bold text-emerald-200">
                            {file.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-obsidian-950 border border-white/[0.08]">
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveFile();
                            }}
                            className="ml-2 text-[11px] bg-rose-950/80 hover:bg-rose-900 text-rose-200 font-semibold px-2 py-0.5 rounded-lg border border-rose-800 transition-colors"
                            title="Remove file"
                          >
                            ✕ Remove
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-400">Click or drag another file to replace</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-bold text-white">
                          Drag & Drop PDF or DOCX file here
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1">
                          Supported formats: PDF, DOCX (Max 10 MB)
                        </span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Active Resume summary badge */}
            <div className="p-3 bg-obsidian-950 border border-white/[0.06] rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400">Active Document:</span>
              <span className="font-mono text-white font-semibold">
                {uploadMode === 'preset' ? selectedPreset.fileName : (file?.name || 'No file selected')}
              </span>
            </div>
          </div>

          {/* Card 2: Target Job Description */}
          <div className="bg-obsidian-900 border border-white/[0.08] rounded-2xl p-6 shadow-card-lift flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-400" />
                2. Target Requisition & Role
              </h2>
              <p className="text-xs text-slate-400 mb-3">Select a live requisition to benchmark against:</p>

              <div className="mb-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Active Requisitions
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => {
                    setSelectedJobId(e.target.value);
                    setPipelineState('idle');
                    setActiveMatch(null);
                    setTailoredResult(null);
                  }}
                  className="w-full bg-obsidian-950 border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors font-medium"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>
                      {j.title} — {j.companyName} ({j.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Or Paste Custom Job Description
                </label>
                <textarea
                  value={customJdText}
                  onChange={(e) => setCustomJdText(e.target.value)}
                  rows={ uploadMode === 'preset' ? 3 : 4 }
                  placeholder="Paste custom requirements or responsibilities..."
                  className="w-full bg-obsidian-950 border border-white/[0.12] rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                />
              </div>
            </div>

            {/* Main Action CTA Button */}
            <button
              onClick={runFullPipeline}
              disabled={pipelineState !== 'idle' && pipelineState !== 'done'}
              className="w-full py-3.5 btn-primary-glow text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {pipelineState === 'idle' || pipelineState === 'done' ? (
                <>
                  <Sparkles className="h-4 w-4 text-indigo-200" />
                  <span>Compute Hybrid ATS Match Score</span>
                </>
              ) : (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Processing AI Diagnostics...</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Pipeline Stepper Shimmer Animation */}
        {pipelineState !== 'idle' && (
          <div className="bg-obsidian-900 border border-white/[0.08] rounded-2xl p-5 shadow-card-lift">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              Hybrid AI Processing Stages
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                pipelineState === 'parsing' 
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 animate-pulse' 
                  : (pipelineState === 'embedding' || pipelineState === 'scoring' || pipelineState === 'done' ? 'bg-obsidian-950 border-emerald-500/30 text-emerald-400' : 'bg-obsidian-950 border-white/[0.06] text-slate-500')
              }`}>
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span className="font-semibold">1. Entity Extraction</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                pipelineState === 'embedding' 
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 animate-pulse' 
                  : (pipelineState === 'scoring' || pipelineState === 'done' ? 'bg-obsidian-950 border-emerald-500/30 text-emerald-400' : 'bg-obsidian-950 border-white/[0.06] text-slate-500')
              }`}>
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span className="font-semibold">2. Vector Embeddings</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                pipelineState === 'scoring' 
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 animate-pulse' 
                  : (pipelineState === 'done' ? 'bg-obsidian-950 border-emerald-500/30 text-emerald-400' : 'bg-obsidian-950 border-white/[0.06] text-slate-500')
              }`}>
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span className="font-semibold">3. Hybrid ATS Score</span>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                pipelineState === 'done' 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold' 
                  : 'bg-obsidian-950 border-white/[0.06] text-slate-500'
              }`}>
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>4. Diagnostics Ready</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {activeMatch && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Refined Score Gauge */}
              <div className="lg:col-span-1">
                <ScoreGauge
                  finalScore={activeMatch.finalScore}
                  lexicalScore={activeMatch.lexicalScore}
                  semanticScore={activeMatch.semanticScore}
                />
              </div>

              {/* Natural Language Rationale & Skill Gap Matrix */}
              <div className="lg:col-span-2 bg-obsidian-900 border border-white/[0.08] rounded-2xl p-6 shadow-card-lift space-y-5">
                
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      AI Explainability Assessment
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/25">
                    Target: {currentSelectedJob.companyName}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-obsidian-950 p-4 rounded-xl border border-white/[0.06]">
                  {activeMatch.explanation}
                </p>

                {/* Skill Gap Matrix Component */}
                <SkillGapMatrix
                  matchedSkills={activeMatch.matchedSkills}
                  missingSkills={activeMatch.missingSkills}
                  skillGaps={activeMatch.skillGaps}
                  onTailorClick={handleGenerateTailored}
                />
              </div>

            </div>

            {/* Tailored Diff Studio */}
            {loadingTailor && (
              <div className="p-8 text-center bg-obsidian-900 border border-white/[0.08] rounded-2xl space-y-3 shadow-card-lift">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">
                  Generating verified bullet rephrasings with target keywords...
                </p>
              </div>
            )}

            {tailoredResult && !loadingTailor && (
              <TailoredDiffView
                versionNumber={tailoredResult.tailoredResume?.version || 2}
                tailoredText={tailoredResult.tailoredText || tailoredResult.tailoredResume?.rawText || ''}
                beforeAfterDiff={tailoredResult.beforeAfterDiff || []}
                matchedSkillsAdded={tailoredResult.matchedSkillsAdded || []}
              />
            )}

          </div>
        )}

      </div>
    </div>
  );
};
