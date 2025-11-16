import React, { useState } from 'react';
import { Button } from '@/components/UI/button.jsx';
import { AlertCircle } from 'lucide-react';
import { reportContent } from '@/services/api';
import { toast } from 'react-toastify';

const DEFAULT_REASONS = [
  'Spam or solicitation',
  'Harassment or hate speech',
  'Inappropriate content',
  'Copyright violation',
  'Other'
];

export default function ReportButton({ contentType, contentId, reportedUserId = null, className = '', onSuccess = null }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(DEFAULT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!contentType || !contentId) return toast.error('Missing content details');
    setSubmitting(true);
    try {
      const payload = { contentType, contentId, reason, details };
      if (reportedUserId) payload.reportedUserId = reportedUserId;
      const resp = await reportContent(payload);
      toast.success('Report submitted');
      setOpen(false);
      setReason(DEFAULT_REASONS[0]);
      setDetails('');
      if (onSuccess) onSuccess(resp?.data);
    } catch (err) {
      console.error('Report failed', err);
      toast.error(err?.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setOpen(true)}
        className={className}
        aria-label="report"
      >
        <AlertCircle className="h-6 w-6" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-[1600] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-lg max-w-lg w-full p-6 z-10">
            <h3 className="text-lg font-semibold mb-3">Report content</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
              >
                {DEFAULT_REASONS.map((r) => (
                  <option key={r} value={r} className="text-slate-900 dark:text-white">{r}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Details (optional)</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full border rounded px-3 py-2 h-24 bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              {/* Use an explicit outline variant and clearer label so the button is visible on all backgrounds */}
              <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Close</Button>
              <Button onClick={submit} disabled={submitting}>{submitting ? 'Sending...' : 'Submit report'}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
