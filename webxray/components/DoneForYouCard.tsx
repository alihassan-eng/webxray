'use client';

import { useState } from 'react';
import { submitFixLead } from '@/app/actions/lead';

interface DoneForYouCardProps {
  auditId: string;
  targetUrl: string;
}

export function DoneForYouCard({ auditId, targetUrl }: DoneForYouCardProps) {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('LOADING');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    formData.append('auditId', auditId);
    formData.append('targetUrl', targetUrl);

    const res = await submitFixLead(formData);

    if (res.success) {
      setStatus('SUCCESS');
    } else {
      setStatus('ERROR');
      setErrorMsg(res.error || 'Failed to submit. Please try again.');
    }
  }

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 to-slate-900 p-6 sm:p-8">
      <div>
        <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
          🛠️ Done-For-You Engineering
        </span>
        <h3 className="mt-2 text-xl font-bold text-white">
          Want Us to Fix Everything in 48 Hours?
        </h3>
        <p className="mt-2 text-sm text-slate-300">
          No developer? Our senior frontend engineer will fix all speed,
          mobile layout, security, and SEO issues for you ($499+).
        </p>
      </div>

      {status === 'SUCCESS' ? (
        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-300">
          ✅ Request received! We will email you a fixed-price repair plan within 4 hours.
        </div>
      ) : (
        <form onSubmit={handleSubmit} autoComplete="off" className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            name="email"
            required
            autoComplete="off"
            disabled={status === 'LOADING'}
            placeholder="Enter your work email..."
            className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none disabled:opacity-50"
          />
          {status === 'ERROR' && <p className="text-xs text-red-400">{errorMsg}</p>}
          <button
            type="submit"
            disabled={status === 'LOADING'}
            className="w-full cursor-pointer rounded-xl bg-emerald-500 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50"
          >
            {status === 'LOADING' ? 'Sending Request...' : 'Get Fixed →'}
          </button>
        </form>
      )}
    </div>
  );
}
