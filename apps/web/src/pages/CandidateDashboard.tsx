import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ResumeVersion, JobPosting, MatchResult } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { SkillGapMatrix } from '../components/SkillGapMatrix';
import { TailoredDiffView } from '../components/TailoredDiffView';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Briefcase,
  History,
  Layers,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export const CandidateDashboard: React.FC = () => {
  const { user, token } = useAuth();

  const [resumes, setResumes] = useState<ResumeVersion[]>([]);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [customJdText, setCustomJdText] = useState<string>('');
  
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  // Analysis & Pipeline States
  const [pipelineState, setPipelineState] = useState<'idle' | 'parsing' | 'embedding' | 'scoring' | 'done'>('idle');
  const [activeMatch, setActiveMatch] = useState<MatchResult | null>(null);
  const [tailoredResult, setTailoredResult] = useState<any | null>(null);
  const [loadingTailor, setLoadingTailor] = useState(false);

  useEffect(() => {
    fetchResumes();
    fetchJobs();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/resumes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch (e) {
      console.warn('Error fetching resumes:', e);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
        if (data.length > 0) setSelectedJobId(data[0].id);
      }
    } catch (e) {
      console.warn('Error fetching jobs:', e);
    }
  };

  const handleResetWorkspace = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setValidationError('');
    setPipelineState('idle');
    setActiveMatch(null);
    setTailoredResult(null);
    setCustomJdText('');
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setValidationError('');
    setPipelineState('idle');
    setActiveMatch(null);
    setTailoredResult(null);
  };

  const handleJobSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJobId(e.target.value);
    // Reset previous evaluation results when switching targeted job
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
      // Reset previous results on new file drop
      setActiveMatch(null);
      setTailoredResult(null);
      setPipelineState('idle');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setValidationError('');
      setActiveMatch(null);
      setTailoredResult(null);
      setPipelineState('idle');
    }
  };

  const runFullPipeline = async () => {
    // REQUIRE EXPLICIT FILE UPLOAD
    if (!file) {
      setValidationError('Please upload a resume file (PDF or DOCX) to analyze.');
      return;
    }

    setValidationError('');
    setPipelineState('parsing');
    setActiveMatch(null);
    setTailoredResult(null);

    try {
      // Step 1: Upload & NER Skill Parsing
      const formData = new FormData();
      formData.append('resume', file);
      const uploadRes = await fetch('/api/resumes/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Upload failed');
      }
      const uploadData = await uploadRes.json();
      const currentResumeId = uploadData.resume?.id;
      if (!currentResumeId) throw new Error('Resume record missing from response');
      fetchResumes();

      // Step 2: Embedding vector computation
      setPipelineState('embedding');
      await new Promise(r => setTimeout(r, 600));

      // Step 3: Hybrid Scoring & Skill Gap analysis
      setPipelineState('scoring');
      const targetJob = jobs.find(j => j.id === selectedJobId);

      const scoreRes = await fetch('/api/matches/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          resumeId: currentResumeId,
          jobPostingId: selectedJobId || undefined,
          jobDescriptionText: customJdText || targetJob?.descriptionRaw || ''
        })
      });

      if (!scoreRes.ok) {
        const errData = await scoreRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Scoring failed');
      }
      const matchData = await scoreRes.json();
      setActiveMatch(matchData);
      setPipelineState('done');

    } catch (e: any) {
      console.warn('Pipeline error:', e.message);
      setValidationError(e.message || 'Pipeline analysis failed. Please try again.');
      setPipelineState('idle');
    }
  };

  const handleGenerateTailored = async () => {
    if (!activeMatch) return;
    setLoadingTailor(true);
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
      const data = await res.json();
      if (res.ok) {
        setTailoredResult(data);
        fetchResumes();
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      console.warn('Tailoring API error:', e);
    } finally {
      setLoadingTailor(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner with Reset Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">Candidate Workspace</span>
          <h1 className="font-display text-2xl font-bold text-white mt-1">
            Resume ATS Optimization & Tailoring
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Upload your resume, select a target position, and view an explainable ATS score breakdown with real AI tailoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetWorkspace}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all shadow-sm"
            title="Reset workspace and clear uploaded resume"
          >
            <RotateCcw className="h-3.5 w-3.5 text-teal-400" />
            Reset Workspace
          </button>

          {resumes.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
              <History className="h-4 w-4 text-teal-400" />
              <span className="text-slate-400">Resumes:</span>
              <span className="font-bold text-white">{resumes.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Grid: Upload & JD Selection Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: Resume Upload */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-teal-400" />
                1. Upload Resume File (PDF / DOCX)
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                *Required
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">You must upload your resume before analyzing ATS match score.</p>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                file ? 'border-teal-500 bg-teal-950/20' :
                (dragActive ? 'border-teal-400 bg-teal-950/30' : 'border-slate-800 hover:border-slate-700 bg-slate-950/40')
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
                <UploadCloud className={`h-10 w-10 mb-2 ${file ? 'text-teal-400' : 'text-slate-500'}`} />
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 bg-teal-950 px-4 py-2 rounded-full border border-teal-800 shadow-md">
                      <FileText className="h-4 w-4 text-teal-400" />
                      <span className="text-xs font-bold text-teal-200">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        className="ml-2 text-[11px] bg-rose-900/60 hover:bg-rose-800 text-rose-200 font-semibold px-2 py-0.5 rounded-lg border border-rose-700/60 transition-colors"
                        title="Remove file"
                      >
                        ✕ Remove
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400">Click or drag another file to replace</span>
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-semibold text-white">
                      Drag & Drop PDF or DOCX file here
                    </span>
                    <span className="text-[11px] text-teal-400 mt-1 font-medium">
                      * Upload required to enable ATS evaluation
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Card 2: Select Recruiter Job Description */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-teal-400" />
              2. Target Recruiter Job Posting
            </h2>
            <p className="text-xs text-slate-400 mb-3">Select from live posted job requisitions.</p>

            {jobs.length > 0 && (
              <div className="mb-3">
                <label className="text-[11px] font-medium text-slate-400 block mb-1">Select Active Job Requisition</label>
                <select
                  value={selectedJobId}
                  onChange={handleJobSelectChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title} — {j.companyName}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">Or Paste Custom Job Description</label>
              <textarea
                value={customJdText}
                onChange={(e) => setCustomJdText(e.target.value)}
                rows={3}
                placeholder="Paste job description requirements..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-sans"
              />
            </div>
          </div>

          <button
            onClick={runFullPipeline}
            disabled={!file || (pipelineState !== 'idle' && pipelineState !== 'done')}
            className={`w-full py-3.5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
              !file
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 cursor-pointer shadow-teal-900/30'
            }`}
          >
            {pipelineState === 'idle' || pipelineState === 'done' ? (
              file ? (
                <>
                  <Sparkles className="h-4 w-4 fill-slate-950" />
                  Analyze ATS Match Score
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  Please Upload Resume (PDF/DOCX) First
                </>
              )
            ) : (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Document...
              </>
            )}
          </button>
        </div>

      </div>

      {/* Pipeline Stepper Animation */}
      {pipelineState !== 'idle' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4 text-teal-400" />
            AI Pipeline Execution
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
              pipelineState === 'parsing' ? 'bg-teal-950/60 border-teal-500 text-teal-300 animate-pulse' :
              (pipelineState === 'embedding' || pipelineState === 'scoring' || pipelineState === 'done' ? 'bg-slate-950 border-emerald-900/60 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500')
            }`}>
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>1. Extracting Skills</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
              pipelineState === 'embedding' ? 'bg-teal-950/60 border-teal-500 text-teal-300 animate-pulse' :
              (pipelineState === 'scoring' || pipelineState === 'done' ? 'bg-slate-950 border-emerald-900/60 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500')
            }`}>
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>2. Vector Embedding</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
              pipelineState === 'scoring' ? 'bg-teal-950/60 border-teal-500 text-teal-300 animate-pulse' :
              (pipelineState === 'done' ? 'bg-slate-950 border-emerald-900/60 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-500')
            }`}>
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>3. Hybrid ATS Score</span>
            </div>

            <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${
              pipelineState === 'done' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-semibold' : 'bg-slate-950 border-slate-800 text-slate-500'
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
            
            {/* Score Gauge */}
            <div className="lg:col-span-1">
              <ScoreGauge
                finalScore={activeMatch.finalScore}
                lexicalScore={activeMatch.lexicalScore}
                semanticScore={activeMatch.semanticScore}
              />
            </div>

            {/* AI Evaluator Natural Language Explanation */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-teal-400" />
                  AI Match Evaluator Explanation
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetWorkspace}
                    className="text-[11px] font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 transition-all"
                    title="Reset workspace and clear upload"
                  >
                    <RotateCcw className="h-3 w-3 text-teal-400" />
                    Reset Workspace
                  </button>
                  <span className="text-[10px] font-mono text-teal-400 bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-800">
                    Explainability Model v1.0
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800">
                {activeMatch.explanation}
              </p>

              {/* Skill Gap Matrix */}
              <SkillGapMatrix
                matchedSkills={activeMatch.matchedSkills}
                missingSkills={activeMatch.missingSkills}
                skillGaps={activeMatch.skillGaps}
                onTailorClick={handleGenerateTailored}
              />
            </div>

          </div>

          {/* Tailored Resume Diff View */}
          {loadingTailor && (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-teal-400 mx-auto" />
              <p className="text-xs text-slate-300 font-medium">
                Gemini LLM is tailoring bullet points to target job requirements...
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
  );
};
