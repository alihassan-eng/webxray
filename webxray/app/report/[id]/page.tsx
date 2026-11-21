'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Loader2,
    AlertTriangle,
    Lock,
    CheckCircle2,
    Wrench,
    ArrowLeft,
} from 'lucide-react';
import { saveLeadEmailAction } from '@/app/actions/audit';

interface AuditIssue {
    id: string;
    category: 'PERFORMANCE' | 'SECURITY' | 'SEO' | 'UI_UX';
    severity: 'CRITICAL' | 'WARNING';
    title: string;
    businessImpact: string;
    technicalFix: string | null;
}

interface AuditResponse {
    id: string;
    targetUrl: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    errorMessage: string | null;
    overallScore: number | null;
    performanceScore: number | null;
    securityScore: number | null;
    seoScore: number | null;
    screenshotUrl: string | null;
    isUnlocked: boolean;
    totalIssuesCount: number;
    lockedIssuesCount: number;
    issues: AuditIssue[];
}

export default function ReportPage() {
    const params = useParams<{ id: string }>();
    const [data, setData] = useState<AuditResponse | null>(null);
    const [leadEmail, setLeadEmail] = useState('');
    const [leadSubmitted, setLeadSubmitted] = useState(false);

    useEffect(() => {
        let active = true;

        async function fetchStatus() {
            const res = await fetch(`/api/audits/${params.id}`, { cache: 'no-store' });
            if (!res.ok) return;
            const json: AuditResponse = await res.json();
            if (active) setData(json);
        }

        fetchStatus();
        const interval = setInterval(() => {
            if (data?.status === 'COMPLETED' || data?.status === 'FAILED') {
                clearInterval(interval);
                return;
            }
            fetchStatus();
        }, 3000);

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, [params.id, data?.status]);

    if (!data || data.status === 'PENDING' || data.status === 'PROCESSING') {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-400" />
                <h1 className="mt-6 text-2xl font-bold">
                    Running iPhone 14 Mobile X-Ray...
                </h1>
                <p className="mt-2 max-w-md text-sm text-slate-400">
                    Inspecting server response speed, security headers, console errors, and
                    SEO structure. This takes 15–30 seconds.
                </p>
            </main>
        );
    }

    if (data.status === 'FAILED') {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
                <AlertTriangle className="h-12 w-12 text-rose-400" />
                <h1 className="mt-4 text-2xl font-bold">Scan Could Not Complete</h1>
                <p className="mt-2 text-sm text-slate-400">
                    {data.errorMessage || 'The target site blocked automated access.'}
                </p>
                <Link
                    href="/"
                    className="mt-6 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950"
                >
                    Try Another URL
                </Link>
            </main>
        );
    }
    async function handleLeadSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await saveLeadEmailAction(data!.id, leadEmail);
        if (res.ok) setLeadSubmitted(true);
    }

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" /> Scan Another Site
                </Link>

                {/* Header & Scores */}
                <div className="mt-6 grid grid-cols-1 gap-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                            WebXray Diagnostic Report
                        </span>
                        <h1 className="mt-1 break-all text-2xl font-bold">{data.targetUrl}</h1>

                        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <ScoreBox label="Overall" score={data.overallScore} highlight />
                            <ScoreBox label="Performance" score={data.performanceScore} />
                            <ScoreBox label="Security" score={data.securityScore} />
                            <ScoreBox label="SEO & UI" score={data.seoScore} />
                        </div>
                    </div>

                    {/* Mobile Screenshot Preview */}
                    {data.screenshotUrl && (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950 p-3">
                            <span className="mb-2 text-[11px] text-slate-400">
                                iPhone 14 Viewport (390×844)
                            </span>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={data.screenshotUrl}
                                alt="Mobile viewport preview"
                                className="max-h-56 rounded-lg border border-slate-800 object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Free Issues List */}
                <h2 className="mt-10 text-xl font-bold">
                    Detected Issues ({data.totalIssuesCount} Found)
                </h2>

                <div className="mt-4 space-y-4">
                    {data.issues.map((issue) => (
                        <div
                            key={issue.id}
                            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <span
                                    className={`rounded-md px-2 py-0.5 text-xs font-semibold ${issue.severity === 'CRITICAL'
                                        ? 'bg-rose-500/20 text-rose-300'
                                        : 'bg-amber-500/20 text-amber-300'
                                        }`}
                                >
                                    {issue.severity}
                                </span>
                                <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                                    {issue.category}
                                </span>
                                <h3 className="text-base font-semibold text-white">
                                    {issue.title}
                                </h3>
                            </div>

                            <p className="mt-3 text-sm text-slate-300">
                                <strong className="text-slate-100">Business Impact: </strong>
                                {issue.businessImpact}
                            </p>

                            {issue.technicalFix ? (
                                <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-emerald-300">
                                    <code>{issue.technicalFix}</code>
                                </pre>
                            ) : (
                                <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-400">
                                    <Lock className="h-3.5 w-3.5 text-amber-400" />
                                    Copy-paste production code fix locked (included in $29 Full Report)
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Tier 2 & Tier 3 Conversion Cards */}
                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Tier 2: Unlock All Code Fixes */}
                    <div className="rounded-2xl border border-amber-500/40 bg-slate-900 p-6">
                        <div className="flex items-center gap-2 text-amber-400">
                            <Lock className="h-5 w-5" />
                            <span className="text-sm font-semibold">For Developers & Teams</span>
                        </div>
                        <h3 className="mt-2 text-xl font-bold">
                            Unlock{' '}
                            {data.lockedIssuesCount === 1
                                ? '1 More Issue'
                                : `${data.lockedIssuesCount} More Issues`}{' '}
                            + All Code Fixes
                        </h3>


                        <p className="mt-2 text-sm text-slate-400">
                            Get immediate access to every hidden issue and exact copy-paste code
                            tailored to your tech stack.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                const baseCheckoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL;
                                if (baseCheckoutUrl) {
                                    window.open(`${baseCheckoutUrl}?checkout[custom][audit_id]=${data.id}`, '_self');
                                } else {
                                    alert(
                                        'Add NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL in .env to open live $29 checkout!'
                                    );
                                }
                            }}
                            className="mt-6 w-full rounded-xl bg-amber-400 py-3 text-sm font-bold text-slate-950 hover:bg-amber-300"
                        >
                            Unlock Full Report — $29
                        </button>


                    </div>

                    {/* Tier 3: Done-For-You Service ($499+) */}
                    <div className="rounded-2xl border border-emerald-500/40 bg-slate-900 p-6">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <Wrench className="h-5 w-5" />
                            <span className="text-sm font-semibold">Done-For-You Engineering</span>
                        </div>
                        <h3 className="mt-2 text-xl font-bold">
                            Want Us to Fix Everything in 48 Hours?
                        </h3>
                        <p className="mt-2 text-sm text-slate-400">
                            No developer? Our senior frontend engineer will fix all speed, mobile
                            layout, security, and SEO issues for you ($499+).
                        </p>

                        {leadSubmitted ? (
                            <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-500/20 p-3 text-sm text-emerald-300">
                                <CheckCircle2 className="h-5 w-5" />
                                Request received! We’ll email your fix plan shortly.
                            </div>
                        ) : (
                            <form onSubmit={handleLeadSubmit} className="mt-5 flex gap-2">
                                <input
                                    type="email"
                                    required
                                    value={leadEmail}
                                    onChange={(e) => setLeadEmail(e.target.value)}
                                    placeholder="Enter your work email..."
                                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400"
                                >
                                    Get Fixed
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

function ScoreBox({
    label,
    score,
    highlight = false,
}: {
    label: string;
    score: number | null;
    highlight?: boolean;
}) {
    return (
        <div
            className={`rounded-xl border p-3 text-center ${highlight
                ? 'border-emerald-500/40 bg-emerald-500/10'
                : 'border-slate-800 bg-slate-950'
                }`}
        >
            <div className="text-2xl font-extrabold text-white">{score ?? '--'}</div>
            <div className="mt-0.5 text-xs text-slate-400">{label}</div>
        </div>
    );
}
