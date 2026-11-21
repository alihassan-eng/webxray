'use client';

import { useState, useTransition } from 'react';
import { startAuditAction } from '../app/actions/audit';

export function HeroScanForm() {
  const [url, setUrl] = useState('');
  const [isQueuing, setIsQueuing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const busy = isQueuing || isPending;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || busy) return;

    setIsQueuing(true);

    const formData = new FormData();
    formData.set('url', trimmed);

    startTransition(() => {
      startAuditAction(formData);
    });
  }

  return (
    <div className="mx-auto mt-8 max-w-xl sm:mt-10">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          name="website_target_url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={busy}
          required
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="e.g. yourbusiness.com"
          className="w-full min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-base text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none disabled:opacity-60 sm:px-5 sm:py-4"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full shrink-0 cursor-pointer rounded-xl bg-emerald-500 px-7 py-3.5 text-base font-bold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-emerald-600/80 sm:w-auto sm:py-4"
        >
          {busy ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              Preparing Audit...
            </span>
          ) : (
            'Run Free X-Ray →'
          )}
        </button>
      </form>

      {busy && (
        <p
          role="status"
          aria-live="polite"
          className="mt-3 text-xs font-medium text-emerald-300"
        >
          Setting up your scan session and connecting to the audit queue...
        </p>
      )}
    </div>
  );
}
