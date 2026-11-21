'use client';

import { useEffect, useState } from 'react';

const SCAN_STEPS = [
  { label: 'Connecting to iPhone 14 mobile browser (390×844)', sec: 3 },
  { label: 'Measuring server TTFB & network waterfall', sec: 7 },
  { label: 'Auditing SSL, HSTS, CSP & clickjacking headers', sec: 12 },
  { label: 'Scanning mobile layout overflow & runtime JS errors', sec: 17 },
  { label: 'Checking SEO meta tags, OpenGraph & image alt attributes', sec: 21 },
  { label: 'Generating prioritized engineering code fixes', sec: 25 },
];

export function LiveScanProgress({
  targetUrl,
  status,
}: {
  targetUrl?: string;
  status?: 'PENDING' | 'SCANNING';
}) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeIndex = Math.min(
    SCAN_STEPS.length - 1,
    SCAN_STEPS.findIndex((s) => elapsed < s.sec) === -1
      ? SCAN_STEPS.length - 1
      : SCAN_STEPS.findIndex((s) => elapsed < s.sec)
  );

  const remaining = Math.max(2, 25 - elapsed);
  const progressPct = Math.min(95, Math.round((elapsed / 25) * 100));

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-emerald-400 uppercase tracking-wider">
            {status === 'PENDING' ? 'In Queue' : 'Live Mobile X-Ray'}
          </span>
          <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
            ~{remaining}s remaining
          </span>
        </div>

        <h1 className="mt-3 truncate text-xl font-bold sm:text-2xl">
          {targetUrl || 'Inspecting Target Website...'}
        </h1>

        {/* Progress Bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Step-by-step live checklist */}
        <ul className="mt-6 space-y-3 text-left text-sm">
          {SCAN_STEPS.map((step, idx) => {
            const isDone = idx < activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <li
                key={step.label}
                className={`flex items-start gap-3 rounded-xl border px-3.5 py-2.5 transition ${
                  isCurrent
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
                    : isDone
                    ? 'border-slate-800/80 bg-slate-950/50 text-slate-300'
                    : 'border-transparent text-slate-500'
                }`}
              >
                <span className="mt-0.5 shrink-0">
                  {isDone ? (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                      ✓
                    </span>
                  ) : isCurrent ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                  ) : (
                    <span className="inline-block h-4 w-4 rounded-full border border-slate-700" />
                  )}
                </span>
                <span className="leading-snug">{step.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
