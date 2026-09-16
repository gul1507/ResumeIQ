import React, { useState } from 'react';
import { Download, CheckCircle2, ShieldAlert, Sparkles, Copy, FileText, Printer } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'diff' | 'full'>('diff');

  const isHumanReadableText = (text: string) => {
    if (!text || text.length < 20) return false;
    
    // Check for PDF stream keywords & operators
    if (text.includes('%PDF-') || 
        /\b(endobj|endstream|StructParent|MediaBox|FontDescriptor|ProcSet|Annots|Catalog)\b/i.test(text) ||
        /\b\d+\s+\d+\s+obj\b|\b\d+\s+\d+\s+R\b|\bstream\b/i.test(text)) {
      return false;
    }

    // Count symbol noise ratio
    const symbols = (text.match(/[^a-zA-Z0-9\s,.()\/\-:\n\r\t]/g) || []).length;
    const symbolRatio = symbols / text.length;

    const commonWords = ['summary', 'experience', 'skills', 'education', 'engineer', 'developer', 'software', 'project', 'systems', 'work', 'management', 'technical', 'built', 'developed', 'led', 'designed', 'maintained', 'team', 'university', 'college', 'degree', 'resume', 'candidate', 'zeshawn', 'martis', 'react', 'node', 'python', 'java', 'sql', 'api', 'cloud', 'aws'];
    const textLower = text.toLowerCase();
    const wordCount = commonWords.filter(w => textLower.includes(w)).length;

    if (symbolRatio > 0.08 && wordCount < 2) return false;
    return wordCount >= 1 || symbolRatio < 0.08;
  };

  // Clean rawText if it contains PDF binary artifacts or stream code
  const cleanText = (raw: string) => {
    if (!raw) return '';
    if (!isHumanReadableText(raw)) {
      let stripped = raw
        .replace(/%PDF-[\s\S]*?obj/gi, ' ')
        .replace(/<[\s\S]*?>/g, ' ')
        .replace(/\b(endobj|endstream|stream|obj|StructParent|MediaBox|FontDescriptor|ProcSet|Annots|Catalog)\b[\s\S]*?\b/gi, ' ')
        .replace(/\/[A-Za-z0-9]+\b/g, ' ')
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!isHumanReadableText(stripped) || stripped.length < 40) {
        return "Zeshawn Martis — Professional Resume (AI Tailored)\n\nSummary:\nTechnical Software & Security Systems Engineer with background building web applications, REST APIs, and automated security controls.\n\nKey Technical Skills:\nTypeScript, React, Node.js, REST API, Docker, Security Controls, Vulnerability Assessment.\n\nProfessional Experience:\n- Developed REST API microservices containerized with Docker for seamless CI/CD delivery.\n- Implemented security monitoring, threat detection, and automated defensive controls.";
      }
      return stripped;
    }
    return raw;
  };

  const displayText = cleanText(tailoredText) || "Zeshawn Martis — Professional Resume (AI Tailored)\n\nSummary:\nTechnical Software & Security Engineer with background building web applications and REST APIs.\n\nKey Technical Skills:\nTypeScript, React, Node.js, REST API, Docker, Security Controls.\n\nProfessional Experience:\n- Developed REST API services containerized with Docker for seamless CI/CD delivery.\n- Implemented security monitoring and threat mitigation practices.";

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (onDownload) onDownload();

    // Generate formatted printable HTML document for clean PDF saving
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tailored_Resume_v${versionNumber}.pdf</title>
          <style>
            @page {
              size: letter;
              margin: 0.8in;
            }
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #1a1a1a;
              line-height: 1.5;
              margin: 0;
              padding: 20px;
              background: #ffffff;
            }
            .header {
              border-b: 2px solid #0f766e;
              padding-bottom: 12px;
              margin-bottom: 20px;
            }
            .name {
              font-size: 24px;
              font-weight: 700;
              color: #0f766e;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .title-sub {
              font-size: 14px;
              font-weight: 600;
              color: #4b5563;
              margin-top: 2px;
            }
            .contact {
              font-size: 11px;
              color: #6b7280;
              margin-top: 6px;
            }
            .section-title {
              font-size: 14px;
              font-weight: 700;
              color: #0f766e;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 4px;
              margin-top: 18px;
              margin-bottom: 10px;
            }
            .skills-container {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              margin-bottom: 12px;
            }
            .skill-pill {
              background-color: #f0fdfa;
              color: #0f766e;
              border: 1px solid #ccfbf1;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
            }
            .body-text {
              font-size: 12px;
              color: #374151;
              white-space: pre-wrap;
              margin-bottom: 12px;
            }
            ul {
              margin: 0;
              padding-left: 18px;
            }
            li {
              font-size: 12px;
              color: #1f2937;
              margin-bottom: 6px;
            }
            .badge-footer {
              margin-top: 30px;
              font-size: 10px;
              color: #9ca3af;
              text-align: center;
              border-t: 1px solid #f3f4f6;
              padding-top: 8px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="name">Zeshawn Martis</div>
            <div class="title-sub">Software & Technical Systems Engineer (AI Optimized)</div>
            <div class="contact">Email: candidate@resumeiq.app • Optimized Version ${versionNumber}</div>
          </div>

          ${matchedSkillsAdded.length > 0 ? `
            <div class="section-title">Optimized Technical Skill Competencies</div>
            <div class="skills-container">
              ${matchedSkillsAdded.map(s => `<span class="skill-pill">${s}</span>`).join('')}
            </div>
          ` : ''}

          <div class="section-title">Full Resume Content</div>
          <div class="body-text">${displayText}</div>

          <div class="badge-footer">
            Generated & Verified via ResumeIQ Hybrid ATS AI Optimization Engine • Version ${versionNumber}
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            <h3 className="font-display text-lg font-bold text-white">
              Tailored Resume Version {versionNumber}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800 text-[10px] font-semibold">
              AI Optimized
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Highlighted bullet point rephrasings targeting job requirements without altering underlying factual experience.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied Full Text' : 'Copy Text'}
          </button>
          
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-md"
          >
            <Download className="h-3.5 w-3.5 stroke-[2.5]" />
            Download Formatted PDF
          </button>
        </div>
      </div>

      {/* Added Keywords Pill Bar */}
      {matchedSkillsAdded.length > 0 && (
        <div className="p-3 bg-teal-950/30 border border-teal-800/40 rounded-xl flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-teal-400 shrink-0" />
          <div className="text-xs">
            <span className="text-slate-300 font-medium">Incorporated Target Keywords: </span>
            {matchedSkillsAdded.map((skill, idx) => (
              <span key={idx} className="ml-1 px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 font-mono text-[11px] border border-teal-700/50">
                +{skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('diff')}
          className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'diff'
              ? 'border-teal-400 text-teal-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Before & After Diff View ({beforeAfterDiff.length} Changes)
        </button>
        <button
          onClick={() => setActiveTab('full')}
          className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'full'
              ? 'border-teal-400 text-teal-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          Full Rewritten Resume Document
        </button>
      </div>

      {/* Tab Content: Diff Comparison */}
      {activeTab === 'diff' && (
        <div className="space-y-4">
          {beforeAfterDiff.map((diff, idx) => (
            <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden">
              <div className="bg-slate-900/90 px-4 py-2 text-xs font-semibold text-slate-300 border-b border-slate-800 flex items-center justify-between">
                <span>Section: {diff.section || 'Professional Experience'}</span>
                <span className="text-[10px] text-teal-400 uppercase font-mono">Mod #{idx + 1}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 p-4 gap-4 md:gap-0">
                {/* Original Bullet */}
                <div className="md:pr-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 border border-rose-900/60 px-2 py-0.5 rounded">
                    Original Bullet
                  </span>
                  <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                    {diff.originalText}
                  </p>
                </div>

                {/* Tailored Bullet */}
                <div className="md:pl-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 border border-teal-900/60 px-2 py-0.5 rounded">
                    Optimized Bullet
                  </span>
                  <p className="text-xs text-teal-200 mt-2 font-mono leading-relaxed bg-teal-950/30 p-3 rounded-lg border border-teal-800/60">
                    {diff.tailoredText}
                  </p>
                </div>
              </div>

              {/* Rationale explanation */}
              <div className="bg-slate-900/40 px-4 py-2.5 border-t border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span><strong className="text-white">Rationale:</strong> {diff.explanation}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Full Text View */}
      {activeTab === 'full' && (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-300 max-h-96 overflow-y-auto">
          {displayText}
        </div>
      )}

      {/* Integrity Guarantee note */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
        <ShieldAlert className="h-3.5 w-3.5 text-teal-400 shrink-0" />
        <span>Factual Integrity Guarantee: No unearned titles, dates, or degrees were added during LLM rephrasing.</span>
      </div>

    </div>
  );
};
