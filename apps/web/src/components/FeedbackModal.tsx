import React, { useState } from 'react';
import { X, Send, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface FeedbackModalProps {
  matchId: string;
  candidateName: string;
  onClose: () => void;
  onSubmit: (status: 'shortlisted' | 'rejected' | 'feedback_sent', message: string) => Promise<void>;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  matchId,
  candidateName,
  onClose,
  onSubmit
}) => {
  const [status, setStatus] = useState<'shortlisted' | 'rejected' | 'feedback_sent'>('shortlisted');
  const [message, setMessage] = useState<string>(
    'Thank you for applying. We are impressed by your skill match profile and would like to move forward to the technical interview stage!'
  );
  const [submitting, setSubmitting] = useState(false);

  const handleStatusChange = (newStatus: 'shortlisted' | 'rejected' | 'feedback_sent') => {
    setStatus(newStatus);
    if (newStatus === 'shortlisted') {
      setMessage('Thank you for applying. We are impressed by your skill match profile and would like to move forward to the technical interview stage!');
    } else if (newStatus === 'rejected') {
      setMessage('Thank you for your interest. While your technical background is strong, we decided to proceed with candidates whose skills align more closely with our immediate mandatory requirements.');
    } else {
      setMessage('We reviewed your application and would love clarification regarding your containerization and distributed cloud deployment experience.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(status, message);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-obsidian-900 border border-white/[0.12] rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Send Candidate Feedback</h3>
            <p className="text-xs text-slate-400">Recipient: <span className="text-indigo-300 font-semibold">{candidateName}</span></p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Status Selection Cards */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Decision Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              
              <button
                type="button"
                onClick={() => handleStatusChange('shortlisted')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  status === 'shortlisted'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-obsidian-950 border-white/[0.06] text-slate-400 hover:bg-obsidian-850'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Shortlist</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('feedback_sent')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  status === 'feedback_sent'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                    : 'bg-obsidian-950 border-white/[0.06] text-slate-400 hover:bg-obsidian-850'
                }`}
              >
                <HelpCircle className="h-4 w-4 text-amber-400" />
                <span>Needs Info</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('rejected')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                  status === 'rejected'
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 shadow-sm'
                    : 'bg-obsidian-950 border-white/[0.06] text-slate-400 hover:bg-obsidian-850'
                }`}
              >
                <XCircle className="h-4 w-4 text-rose-400" />
                <span>Pass</span>
              </button>

            </div>
          </div>

          {/* Structured Feedback Message */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              Structured Feedback Rationale
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className="w-full bg-obsidian-950 border border-white/[0.12] rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
              placeholder="Write constructive candidate feedback..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 btn-secondary-obsidian text-slate-300 text-xs font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 btn-primary-glow text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{submitting ? 'Sending...' : 'Send Feedback'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
