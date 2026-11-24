'use client';

import { UnlockReportButton } from '@/components/UnlockReportButton';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  const [data, setData] = useState<ReportResponse | null>(null);
  const [showMorePlans, setShowMorePlans] = useState(false);

  useEffect(() => {
    if (!params?.id) return;
    let active = true;

    async function poll() {
      try {
        const res = await fetch(`/api/audits/${params.id}`, {
          cache: 'no-store',
        });
        if (!res.ok) { if (active) setTimeout(poll, 3000); return; }
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
          <h1 className="max-w-full break-all text-base font-bold leading-snug text-rose-400 sm:text-2xl">
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

  const overallScore = data.overallScore ?? 0;
  const totalIssuesCount = data.issues.length + data.lockedIssuesCount;
  const lockedCount = data.isUnlocked ? 0 : totalIssuesCount;

  const blurredCategories = [
    { label: 'Performance', value: data.performanceScore },
    { label: 'Security', value: data.securityScore },
    { label: 'SEO & UI', value: data.seoScore },
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
            {data.isUnlocked ? 'Full Report Unlocked' : 'Executive Preview'}
          </span>
        </div>

        {/* Header + Screenshot */}
        <div className="grid gap-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-8 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            <p className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              WebXray Diagnostic Report
            </p>
            <h1 className="mt-2 max-w-full break-all text-xl font-bold sm:text-3xl">
              {data.targetUrl}
            </h1>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-4 sm:gap-4">
              {/* Overall Score — Always Visible */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-center">
                <div
                  className={`text-3xl font-extrabold ${
                    overallScore >= 80
                      ? 'text-emerald-400'
                      : overallScore >= 55
                        ? 'text-amber-400'
                        : 'text-rose-400'
                  }`}
                >
                  {overallScore}
                </div>
                <div className="mt-1 text-xs font-medium text-slate-400">
                  Overall
                </div>
              </div>

              {/* Performance, Security, SEO & UI — Strictly Blurred & Locked */}
              {blurredCategories.map((s) => (
                <div
                  key={s.label}
                  className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-center"
                >
                  {data.isUnlocked && typeof s.value === 'number' ? (
                    <div
                      className={`text-3xl font-extrabold ${
                        s.value >= 80
                          ? 'text-emerald-400'
                          : s.value >= 55
                            ? 'text-amber-400'
                            : 'text-rose-400'
                      }`}
                    >
                      {s.value}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <span
                        aria-hidden="true"
                        className="select-none text-3xl font-extrabold text-slate-500 blur-[7px]"
                      >
                        84
                      </span>
                      <span className="text-xs text-amber-400">🔒</span>
                    </div>
                  )}
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

        {/* Top Issues Found Alert Banner */}
        <div
          style={{ marginTop: "28px", padding: "20px 24px" }}
          className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border ${
            totalIssuesCount === 0
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-amber-500/40 bg-amber-500/10"
          }`}
        >
          <div style={{ gap: "18px" }} className="flex items-center">
            <span style={{ marginRight: "18px" }}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                totalIssuesCount === 0 ? "bg-emerald-500/20" : "bg-amber-500/20"
              }`}
            >
              {totalIssuesCount === 0 ? "✅" : "⚠️"}
            </span>
            <div>
              <p className="text-base font-extrabold text-white sm:text-lg">
                {totalIssuesCount === 0
                  ? "0 Mobile Issues Found — Looking Great!"
                  : `${totalIssuesCount} Mobile & Security ${totalIssuesCount === 1 ? "Issue" : "Issues"} Found`}
              </p>
              <p style={{ marginTop: "4px" }} className="text-xs text-slate-300">
                {totalIssuesCount > 0
                  ? "Review the business impact below, then unlock the exact code fixes."
                  : "Your website passed all core mobile speed, security, and trust checks."}
              </p>
            </div>
          </div>
          {!data.isUnlocked && totalIssuesCount > 0 && (
            <span style={{ padding: "6px 14px" }} className="whitespace-nowrap rounded-full border border-amber-400/40 bg-slate-950/80 text-xs font-bold text-amber-300">
              🔒 {totalIssuesCount} {totalIssuesCount === 1 ? "Issue" : "Issues"} Locked Below
            </span>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
            Business Owner Summary
          </p>
          <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            How These Mobile Issues Affect Your Ad Spend &amp; Sales
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-5">
              <h3 className="text-sm font-bold text-rose-300">
                📉 Current Business Impact (What You Are Losing)
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {totalIssuesCount > 0 ? (
                  <>
                    Our mobile audit detected{' '}
                    <strong className="text-white">
                      {totalIssuesCount}{' '}
                      {totalIssuesCount === 1
                        ? 'hidden barrier'
                        : 'hidden barriers'}
                    </strong>{' '}
                    affecting visitors who open your website on their phones.
                    When potential buyers click your ads or links and face slow
                    loading or browser trust warnings, ready-to-buy customers
                    leave before inquiring—wasting your ad budget and lowering
                    your return on every campaign.
                  </>
                ) : (
                  <>
                    Your mobile experience passed our primary visitor retention
                    checks, meaning mobile ad traffic can browse smoothly
                    without major drop-off friction.
                  </>
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-5">
              <h3 className="text-sm font-bold text-emerald-300">
                📈 Expected Upside After Fixing (What You Gain)
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {totalIssuesCount > 0 ? (
                  <>
                    Fixing all {totalIssuesCount} flagged issues makes your
                    mobile pages feel fast, safe, and reliable. More of the
                    visitors you are already paying to bring in will stay, trust
                    your brand, and convert into paying customers—giving you
                    higher sales from the exact same traffic.
                  </>
                ) : (
                  <>
                    Your mobile foundation is already solid. To keep this edge
                    as you scale ads, you can protect your site with ongoing
                    weekly health monitoring or add custom conversion features
                    to turn even more visitors into buyers.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Detected Issues — Count Visible, Every Detail Locked & Blurred */}
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold sm:text-2xl">
              Detected Issues ({totalIssuesCount} Found)
            </h2>
            {!data.isUnlocked && totalIssuesCount > 0 && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                🔒 Issue Details &amp; Fixes Locked
              </span>
            )}
          </div>

          {totalIssuesCount === 0 ? (
            <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-sm text-emerald-200">
              ✅ Zero critical mobile issues were found on this website.
            </div>
          ) : data.isUnlocked ? (
            <div className="mt-5 space-y-4">
              {data.issues.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${
                        issue.severity === 'CRITICAL'
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

                  {issue.technicalFix && (
                    <pre className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-emerald-300">
                      <code>{issue.technicalFix}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 space-y-4 select-none" aria-hidden="true">
              {Array.from({ length: totalIssuesCount }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                      LOCKED ISSUE #{idx + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      🔒 Hidden until unlocked
                    </span>
                  </div>

                  <div className="mt-3 h-5 w-2/3 rounded bg-slate-800 blur-[6px]" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3.5 w-full rounded bg-slate-800/80 blur-[6px]" />
                    <div className="h-3.5 w-5/6 rounded bg-slate-800/80 blur-[6px]" />
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-dashed border-slate-700 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
                    <span>🔒 Issue diagnosis &amp; exact fix code redacted</span>
                    <span className="font-semibold text-amber-400">
                      Unlock below
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Focused 3-Option Conversion Grid (Adapts to 0 Issues vs Issues Found) */}
        {!data.isUnlocked && (
          <div style={{ marginTop: "48px" }}>
            <div style={{ marginBottom: "28px" }}>
              <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                Next Steps
              </span>
              <h2 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                {totalIssuesCount === 0
                  ? "Your Site Is Healthy — Scale, Upgrade, or Audit Client Sites"
                  : "Choose How You Want to Fix These Issues"}
              </h2>
            </div>

            {totalIssuesCount === 0 ? (
              /* Clean Site (0 Issues): Show Site Upgrade, Agency Pass, and Monthly Care */
              <div style={{ gap: "24px" }} className="grid sm:grid-cols-2 lg:grid-cols-3">
                {/* 1. Site Upgrade ($799+) */}
                <div style={{ padding: "26px" }} className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold tracking-wider text-sky-400 uppercase">Site Upgrade</span>
                      <span style={{ padding: "3px 10px" }} className="rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300">
                        Custom Build
                      </span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">$799+</span>
                      <span className="text-xs text-slate-400">/ custom</span>
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                      Want more conversions? Add new features, landing pages, or custom UI upgrades.
                    </p>
                  </div>
                  <a
                    href="/contact?plan=site-upgrade"
                    style={{ padding: "12px 16px" }}
                    className="mt-6 block w-full rounded-xl border border-slate-700 bg-slate-800 text-center text-xs font-bold text-white transition hover:bg-slate-700"
                  >
                    Request Site Upgrade →
                  </a>
                </div>

                {/* 2. Agency Pass ($199/week) */}
                <div style={{ padding: "26px" }} className="flex flex-col justify-between rounded-2xl border-2 border-emerald-400 bg-gradient-to-b from-emerald-500/15 via-slate-900 to-slate-950 shadow-xl">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold tracking-wider text-emerald-300 uppercase">Agency Pass</span>
                      <span style={{ padding: "3px 10px" }} className="rounded-full bg-emerald-400 text-[10px] font-black text-slate-950 uppercase">
                        For Agencies
                      </span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">$199</span>
                      <span className="text-xs text-slate-300">/ week</span>
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                      Auditing client websites? Run unlimited scans &amp; unlock every code fix for 7 days.
                    </p>
                  </div>
                  <a
                    href="/contact?plan=agency-weekly"
                    style={{ padding: "12px 16px" }}
                    className="mt-6 block w-full rounded-xl bg-emerald-400 text-center text-xs font-extrabold text-slate-950 transition hover:bg-emerald-300"
                  >
                    Get Weekly Agency Pass →
                  </a>
                </div>

                {/* 3. Monthly Care ($249/month) */}
                <div style={{ padding: "26px" }} className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold tracking-wider text-purple-400 uppercase">Monthly Care</span>
                      <span style={{ padding: "3px 10px" }} className="rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300">
                        Recurring
                      </span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white">$249</span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                      Protect your high score with weekly speed, security &amp; uptime monitoring.
                    </p>
                  </div>
                  <a
                    href="/contact?plan=monthly-care"
                    style={{ padding: "12px 16px" }}
                    className="mt-6 block w-full rounded-xl border border-slate-700 bg-slate-800 text-center text-xs font-bold text-white transition hover:bg-slate-700"
                  >
                    Start Monthly Care →
                  </a>
                </div>
              </div>
            ) : (
              /* Issues Found (> 0): Show $29 Unlock, $199 Agency Pass, $499+ Fix + Inline Drawer */
              <>
                <div style={{ gap: "24px" }} className="grid sm:grid-cols-2 lg:grid-cols-3">
                  <div style={{ padding: "26px" }} className="flex flex-col justify-between rounded-2xl border-2 border-emerald-400 bg-gradient-to-b from-emerald-500/15 via-slate-900 to-slate-950 shadow-xl">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold tracking-wider text-emerald-300 uppercase">Self-Serve</span>
                        <span style={{ padding: "3px 10px" }} className="rounded-full bg-emerald-400 text-[10px] font-black text-slate-950 uppercase">Most Popular</span>
                      </div>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">$29</span>
                        <span className="text-xs text-slate-300">/ one-time</span>
                      </div>
                      <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                        Unlock all blurred scores, hidden issues &amp; exact copy-paste code fixes for this site.
                      </p>
                    </div>
                    <div className="mt-6">
                      <UnlockReportButton auditId={data.id} lockedCount={lockedCount} />
                    </div>
                  </div>

                  <div style={{ padding: "26px" }} className="flex flex-col justify-between rounded-2xl border-2 border-emerald-400/75 bg-gradient-to-b from-emerald-500/10 via-slate-900 to-slate-950 shadow-xl">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold tracking-wider text-emerald-300 uppercase">Agency Pass</span>
                        <span style={{ padding: "3px 10px" }} className="rounded-full bg-emerald-400 text-[10px] font-black text-slate-950 uppercase">Recommended</span>
                      </div>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-white">$199</span>
                        <span className="text-xs text-slate-300">/ week</span>
                      </div>
                      <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                        Auditing multiple client sites? Get unlimited scans &amp; unlocked code fixes for 7 days.
                      </p>
                    </div>
                    <a href="/contact?plan=agency-weekly" style={{ padding: "12px 16px" }} className="mt-6 block w-full rounded-xl bg-emerald-400 text-center text-xs font-extrabold text-slate-950 transition hover:bg-emerald-300">
                      Get Weekly Agency Pass →
                    </a>
                  </div>

                  <div style={{ padding: "26px" }} className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">Done-For-You</span>
                        <span style={{ padding: "3px 10px" }} className="rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300">48h Delivery</span>
                      </div>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-white">$499+</span>
                        <span className="text-xs text-slate-400">/ project</span>
                      </div>
                      <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                        No developer? Our engineers patch every speed, security &amp; mobile issue on your live site.
                      </p>
                    </div>
                    <a href="#done-for-you" style={{ padding: "12px 16px" }} className="mt-6 block w-full rounded-xl border border-slate-700 bg-slate-800 text-center text-xs font-bold text-white transition hover:bg-slate-700">
                      Request Done-For-You Fix →
                    </a>
                  </div>
                </div>

                <div style={{ marginTop: "32px" }}>
                  <div style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMorePlans((prev) => {
                          const next = !prev;
                          if (next) {
                            setTimeout(() => {
                              document.getElementById("extra-plans-drawer")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                            }, 80);
                          }
                          return next;
                        });
                      }}
                      style={{ padding: "13px 28px" }}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-slate-900/90 text-xs font-bold text-emerald-300 transition hover:border-emerald-400 hover:bg-slate-800"
                    >
                      <span>
                        {showMorePlans
                          ? "Hide Extra Plans & Offers ↑"
                          : "Explore More Plans & Offers (Site Upgrades & Monthly Care) ↓"}
                      </span>
                    </button>
                  </div>

                  {showMorePlans && (
                    <div id="extra-plans-drawer" style={{ marginTop: "24px", gap: "24px" }} className="grid sm:grid-cols-2">
                      <div style={{ padding: "26px" }} className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold tracking-wider text-sky-400 uppercase">Site Upgrade</span>
                            <span style={{ padding: "3px 10px" }} className="rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300">Custom Scope</span>
                          </div>
                          <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-white">$799+</span>
                            <span className="text-xs text-slate-400">/ custom</span>
                          </div>
                          <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                            Upgrade your store or site—eliminate bugs, improve navigation &amp; add custom features.
                          </p>
                        </div>
                        <a href="/contact?plan=site-upgrade" style={{ padding: "12px 16px" }} className="mt-6 block w-full rounded-xl border border-slate-700 bg-slate-800 text-center text-xs font-bold text-white transition hover:bg-slate-700">
                          Request Upgrade Quote →
                        </a>
                      </div>

                      <div style={{ padding: "26px" }} className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold tracking-wider text-purple-400 uppercase">Monthly Care</span>
                            <span style={{ padding: "3px 10px" }} className="rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300">Recurring</span>
                          </div>
                          <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-white">$249</span>
                            <span className="text-xs text-slate-400">/ month</span>
                          </div>
                          <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                            Continuous speed, security &amp; uptime care so your website stays fast every week.
                          </p>
                        </div>
                        <a href="/contact?plan=monthly-care" style={{ padding: "12px 16px" }} className="mt-6 block w-full rounded-xl border border-slate-700 bg-slate-800 text-center text-xs font-bold text-white transition hover:bg-slate-700">
                          Start Monthly Care →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {totalIssuesCount > 0 && (
          <div id="done-for-you" className="mt-10">
            <DoneForYouCard auditId={data.id} targetUrl={data.targetUrl} />
          </div>
        )}
      </div>
    </main>
  );
}
