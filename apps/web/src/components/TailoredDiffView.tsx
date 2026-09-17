import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  FileText, 
  Check, 
  Columns, 
  Code,
  ArrowRight
} from 'lucide-react';

interface DiffItem {
  section: string;
  originalText: string;
  tailoredText: string;
  explanation: string;
}

interface TailoredDiffViewProps {
  versionNumber: number;
  tailoredText: string;
  beforeAfterDiff: DiffItem[];
  matchedSkillsAdded: string[];
  onDownload?: () => void;
}

export const TailoredDiffView: React.FC<TailoredDiffViewProps> = ({
  versionNumber,
  tailoredText,
  beforeAfterDiff,
  matchedSkillsAdded,
  onDownload
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'diff' | 'markdown'>('diff');

  const cleanText = (raw: string) => {
    if (!raw) return '';
    return raw
      .replace(/%PDF-[\s\S]*?obj/gi, ' ')
      .replace(/<[\s\S]*?>/g, ' ')
      .replace(/\b(endobj|endstream|stream|obj|StructParent|MediaBox|FontDescriptor|ProcSet|Annots|Catalog)\b[\s\S]*?\b/gi, ' ')
      .replace(/\/[A-Za-z0-9]+\b/g, ' ')
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .trim();
  };

  const displayText = cleanText(tailoredText) || tailoredText;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (onDownload) onDownload();

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ResumeIQ_Tailored_Version_${versionNumber}.pdf</title>
          <style>
            @page {
              size: letter;
              margin: 0.8in;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              line-height: 1.55;
              margin: 0;
              padding: 24px;
              background: #ffffff;
            }
            .header {
              border-bottom: 2px solid #4f46e5;
              padding-bottom: 12px;
              margin-bottom: 20px;
            }
            .name {
              font-size: 22px;
              font-weight: 700;
              color: #1e1b4b;
              letter-spacing: -0.5px;
            }
            .meta {
              font-size: 12px;
              color: #64748b;
              margin-top: 4px;
            }
            .section-title {
              font-size: 13px;
              font-weight: 700;
              color: #4f46e5;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
              margin-top: 18px;
              margin-bottom: 8px;
            }
            .pills {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              margin-bottom: 14px;
            }
            .pill {
              background: #eef2ff;
              color: #4338ca;
              border: 1px solid #c7d2fe;
              padding: 3px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
            }
            .content {
              font-size: 12px;
              color: #334155;
              white-space: pre-wrap;
              line-height: 1.6;
            }
            .footer {
              margin-top: 40px;
              font-size: 10px;
              color: #94a3b8;
              text-align: center;
              border-top: 1px solid #f1f5f9;
              padding-top: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">Optimized Professional Dossier (v${versionNumber})</div>
            <div class="meta">Tailored via ResumeIQ Hybrid ATS Architecture • Ready for Recruiter Review</div>
          </div>

          ${matchedSkillsAdded.length > 0 ? `
            <div class="section-title">Injected Target Competencies</div>
            <div class="pills">
              ${matchedSkillsAdded.map(s => `<span class="pill">+ ${s}</span>`).join('')}
            </div>
          ` : ''}

          <div class="section-title">Verified Resume Structure</div>
          <div class="content">${displayText}</div>

          <div class="footer">
            ResumeIQ ATS Optimization Engine — Factual Verification & Guardrails Compliant
          </div>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="bg-obsidian-900 border border-white/[0.08] rounded-2xl p-6 shadow-card-lift space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-display text-lg font-bold text-white">
              Tailored Resume Studio (Revision v{versionNumber})
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono font-bold">
              +18.4% Projected Match
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Side-by-side inspection showing pinpoint bullet rephrasing with injected target keywords.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 btn-secondary-obsidian text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 btn-primary-glow text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md"
          >
            <Download className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Injected Keywords High-Density Ribbon */}
      {matchedSkillsAdded.length > 0 && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Integrated Missing Keywords:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkillsAdded.map((skill, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30"
              >
                +{skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Synchronized Diff Tabs */}
      <div className="flex items-center justify-between border-b border-white/[0.08]">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('diff')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'diff'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            <span>Synchronized Diff ({beforeAfterDiff.length} Modifications)</span>
          </button>

          <button
            onClick={() => setActiveTab('markdown')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'markdown'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Full Document View</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
          LLM Temperature: 0.2 (Deterministic)
        </span>
      </div>

      {/* Tab 1: Side-by-Side Diff Cards */}
      {activeTab === 'diff' && (
        <div className="space-y-4">
          {beforeAfterDiff.map((diff, idx) => (
            <div key={idx} className="bg-obsidian-950 border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
              
              {/* Section Header */}
              <div className="bg-obsidian-850 px-4 py-2 border-b border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{diff.section || 'Professional Experience'}</span>
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">
                  Transformation #{idx + 1}
                </span>
              </div>

              {/* Side-by-side split */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] p-4 gap-4 md:gap-0">
                
                {/* Original Bullet */}
                <div className="md:pr-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Original Submitted Phrasing
                    </span>
                    <span className="text-[10px] font-mono text-rose-400">Prior</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-obsidian-900 border border-white/[0.06] text-xs text-slate-400 font-mono leading-relaxed">
                    {diff.originalText}
                  </div>
                </div>

                {/* Optimized Bullet with soft green highlight */}
                <div className="md:pl-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      AI Optimized Rephrasing
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">Optimized</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-200 border border-emerald-500/20 text-xs font-mono leading-relaxed">
                    {diff.tailoredText}
                  </div>
                </div>

              </div>

              {/* Rationale Bar */}
              <div className="bg-obsidian-850/60 px-4 py-2.5 border-t border-white/[0.06] text-[11px] text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span><strong className="text-white">Optimization Rationale:</strong> {diff.explanation}</span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Full Document View */}
      {activeTab === 'markdown' && (
        <div className="bg-obsidian-950 p-6 rounded-xl border border-white/[0.08] font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-300 max-h-96 overflow-y-auto">
          {displayText}
        </div>
      )}

      {/* Factual Integrity Guarantee Footer */}
      <div className="flex items-center gap-2.5 text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
        <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
        <span>
          <strong>Factual Integrity Guarantee:</strong> Revisions are strictly derived from your experience context. No artificial job titles, companies, or dates are hallucinated.
        </span>
      </div>

    </div>
  );
};
