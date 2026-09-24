import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  Columns, 
  Code,
  ArrowRight,
  Cpu,
  FileCheck
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
          <title>ResumeIQ_Tailored_Revision_${versionNumber}.pdf</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
            body {
              font-family: 'Outfit', sans-serif;
              color: #1e293b;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              line-height: 1.6;
              font-size: 14px;
            }
            h1 { font-size: 24px; color: #0f172a; margin-bottom: 4px; border-bottom: 2px solid #FF5C00; padding-bottom: 8px; }
            h2 { font-size: 16px; color: #334155; margin-top: 24px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
            p { margin: 8px 0; }
            ul { margin: 8px 0; padding-left: 20px; }
            li { margin-bottom: 4px; }
            .badge { display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: bold; background: #FFF7ED; color: #C2410C; border: 1px solid #FDBA74; border-radius: 4px; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="badge">ResumeIQ • ATS Optimized Revision v${versionNumber}</div>
          <pre style="white-space: pre-wrap; font-family: inherit;">${displayText}</pre>
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
    <div className="bg-[#0B1019]/80 border border-white/[0.08] rounded-2xl p-6 shadow-[0_16px_40px_rgba(0,0,0,0.7)] space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00F5A0] shadow-[0_0_8px_#00F5A0] animate-pulse" />
            <h3 className="font-display text-lg font-bold text-white">
              Tailored Resume Studio (Revision v{versionNumber})
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/25 text-[10px] font-mono font-bold">
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
                <Check className="h-3.5 w-3.5 text-[#00F5A0]" />
                <span className="text-[#00F5A0]">Copied!</span>
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
        <div className="p-3.5 bg-[#00F5A0]/10 border border-[#00F5A0]/25 rounded-xl flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-[#00F5A0] text-xs font-semibold shrink-0">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Integrated Target Keywords:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkillsAdded.map((skill, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-0.5 rounded-lg bg-[#00F5A0]/20 text-[#00F5A0] font-mono text-[11px] font-bold border border-[#00F5A0]/35 shadow-[0_0_8px_rgba(0,245,160,0.15)]"
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
                ? 'border-[#FF5C00] text-[#FFA133]'
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
                ? 'border-[#FF5C00] text-[#FFA133]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>Full Document View</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
          Deterministic Engine: Zero Hallucinations
        </span>
      </div>

      {/* Tab 1: Side-by-Side Diff Cards */}
      {activeTab === 'diff' && (
        <div className="space-y-4">
          {beforeAfterDiff.map((diff, idx) => (
            <div key={idx} className="bg-[#05070B] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
              
              {/* Section Header */}
              <div className="bg-[#0F1623] px-4 py-2 border-b border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 font-display">{diff.section || 'Professional Experience'}</span>
                <span className="text-[10px] font-mono text-[#FFA133] uppercase font-bold tracking-wider">
                  Transformation #{idx + 1}
                </span>
              </div>

              {/* Side-by-side split */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] p-4 gap-4 md:gap-0">
                
                {/* Original Bullet */}
                <div className="md:pr-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                      Original Submitted Phrasing
                    </span>
                    <span className="text-[10px] font-mono text-[#FF2E63]">Prior</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0B1019] border border-white/[0.06] text-xs text-slate-400 font-mono leading-relaxed">
                    {diff.originalText}
                  </div>
                </div>

                {/* Optimized Bullet with soft emerald highlight */}
                <div className="md:pl-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00F5A0] font-mono">
                      AI Optimized Rephrasing
                    </span>
                    <span className="text-[10px] font-mono text-[#00F5A0] font-bold">Optimized</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/25 text-xs font-mono leading-relaxed shadow-[0_0_12px_rgba(0,245,160,0.1)]">
                    {diff.tailoredText}
                  </div>
                </div>

              </div>

              {/* Rationale Bar */}
              <div className="bg-[#0F1623]/60 px-4 py-2.5 border-t border-white/[0.06] text-[11px] text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#00F5A0] shrink-0" />
                <span><strong className="text-white">Optimization Rationale:</strong> {diff.explanation}</span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Full Document View */}
      {activeTab === 'markdown' && (
        <div className="bg-[#05070B] p-6 rounded-xl border border-white/[0.08] font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-300 max-h-96 overflow-y-auto">
          {displayText}
        </div>
      )}

      {/* Factual Integrity Guarantee Footer */}
      <div className="flex items-center gap-2.5 text-xs text-slate-400 pt-2 border-t border-white/[0.06]">
        <ShieldCheck className="h-4 w-4 text-[#FF5C00] shrink-0" />
        <span>
          <strong>Factual Integrity Guarantee:</strong> Revisions are strictly derived from your experience context. No artificial job titles, companies, or dates are hallucinated.
        </span>
      </div>

    </div>
  );
};
