'use client';

import { UnlockReportButton } from '@/components/UnlockReportButton';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LiveScanProgress } from '../../../components/LiveScanProgress';
import { DoneForYouCard } from '@/components/DoneForYouCard';

interface Issue {
  id: string;
  category: 'PERFORMANCE' | 'SECURITY' | 'SEO' | 'UI_UX';
  severity: 'CRITICAL' | 'WARNING';
  title: string;
  businessImpact: string;
  technicalFix?: string;
}

interface ReportResponse {
  id: string;
  targetUrl: string;
  status: 'PENDING' | 'SCANNING' | 'COMPLETED' | 'FAILED';
  errorMessage?: string | null;
  overallScore?: number | null;
  performanceScore?: number | null;
  securityScore?: number | null;
  seoScore?: number | null;
  screenshotUrl?: string | null;
  isUnlocked: boolean;
  issues: Issue[];
  lockedIssuesCount: number;
}

export default function ReportPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<ReportResponse | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    let active = true;

    async function poll() {
      try {
        const res = await fetch(`/api/audits/${params.id}`, {
          cache: 'no-store',
        });
        if (!res.ok) return;
        const json: ReportResponse = await res.json();
        if (!active) return;
        setData(json);

        if (json.status === 'PENDING' || json.status === 'SCANNING') {
          setTimeout(poll, 2500);
        }
      } catch {
        if (active) setTimeout(poll, 3000);
      }
    }

    poll();
    return () => {
      active = false;
    };
  }, [params?.id]);

  if (!data || data.status === 'PENDING' || data.status === 'SCANNING') {
    return (
      <LiveScanProgress
        targetUrl={data?.targetUrl}
        status={data?.status === 'SCANNING' ? 'SCANNING' : 'PENDING'}
      />
    );
  }
  if (data.status === 'FAILED') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
        <div className="max-w-lg rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8">
          <h1 className="sm: sm: font-bold text-rose-400 break-all break-all max-w-full text-base sm:text-2xl break-all leading-snug">
            Scan Could Not Complete
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            {data.errorMessage ||
              'The target site blocked automated browsers or timed out.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="mt-6 inline-block cursor-pointer rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950"
          >
            Try Another URL
          </button>
        </div>
    </main>
    );
  }

  const scoreCards = [
    { label: 'Overall', value: data.overallScore ?? 0 },
    { label: 'Performance', value: data.performanceScore ?? 0 },
    { label: 'Security', value: data.securityScore ?? 0 },
    { label: 'SEO & UI', value: data.seoScore ?? 0 },
  ];
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 px-4 py-8 text-slate-50 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* Top Nav */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="cursor-pointer text-sm font-semibold text-slate-400 hover:text-white"
          >
            ← Scan Another Site
          </button>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            {data.isUnlocked ? 'Full Report Unlocked' : 'Free Preview Mode'}
          </span>
        </div>

        {/* Header + Screenshot */}
        <div className="grid gap-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <p className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              WebXray Diagnostic Report
            </p>
            <h1 className="mt-2 truncate text-xl font-bold sm:text-lg sm:text-3xl break-all max-w-full">
              {data.targetUrl}
            </h1>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-4 sm:gap-4">
              {scoreCards.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-center"
                >
                  <div
                    className={`text-3xl font-extrabold ${s.value >= 80
                        ? 'text-emerald-400'
                        : s.value >= 55
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                  >
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs font-medium text-slate-400">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {data.screenshotUrl && (
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 text-xs text-slate-400">
                iPhone 14 Viewport (390×844)
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.screenshotUrl}
                alt="Mobile screenshot"
                className="h-64 w-auto rounded-2xl border border-slate-700 object-cover shadow-2xl"
              />
            </div>
          )}
        </div>

        {/* Detected Issues */}
        <div className="mt-10">
          <h2 className="text-xl font-bold sm:text-2xl">
            Detected Issues ({data.issues.length + data.lockedIssuesCount}{' '}
            Found)
          </h2>

          <div className="mt-5 space-y-4">
            {data.issues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${issue.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-amber-500/20 text-amber-300'
                      }`}
                  >
                    {issue.severity}
                  </span>
                  <span className="rounded-md bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                    {issue.category}
                  </span>
                  <h3 className="text-base font-bold text-white sm:text-lg">
                    {issue.title}
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  <strong className="text-slate-100">Business Impact:</strong>{' '}
                  {issue.businessImpact}
                </p>

                {data.isUnlocked && issue.technicalFix ? (
                  <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-emerald-300">
                    <code>{issue.technicalFix}</code>
                  </pre>
                ) : (
                  <div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
                    <span>🔒 Exact copy-paste code fix locked</span>
                    <span className="shrink-0 font-semibold text-amber-400">
                      Unlock below
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dual Monetization Conversion Box */}
        {!data.isUnlocked && (
          <div className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-2">
            <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-slate-900 p-6 sm:p-8">
              <div>
                <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">
                  🔓 For Developers &amp; Teams
                </span>
                <h3 className="mt-2 text-xl font-bold">
                  {data.lockedIssuesCount > 0
                    ? `Unlock ${data.lockedIssuesCount === 1
                      ? '1 More Issue'
                      : `${data.lockedIssuesCount} More Issues`
                    } + All Code Fixes`
                    : 'Unlock All Copy-Paste Code Fixes'}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Get immediate access to every hidden issue and exact
                  copy-paste code tailored to your tech stack.
                </p>
              </div>
              <div className="mt-6">
                <UnlockReportButton auditId={data.id} lockedCount={data.lockedIssuesCount} />
              </div>

            </div>
            
          </div>
        )}
      </div>
    
      <div className="mt-10">
        <DoneForYouCard auditId={data.id} targetUrl={data.targetUrl} />
      </div>
    </main>
  );
}
