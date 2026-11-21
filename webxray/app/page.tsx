// app/page.tsx
import { startAuditAction } from './actions/audit';
import { ShieldCheck, Zap, Search, Smartphone, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="inline-block h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            <span>WebXray</span>
          </div>
          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            Free 30-Second Mobile & Code Audit
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
          <Smartphone className="h-3.5 w-3.5" />
          Real iPhone 14 Viewport & Runtime Diagnostics
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          Find out why visitors are{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            leaving your website
          </span>{' '}
          in 30 seconds.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
          Enter any website URL. WebXray scans your mobile layout, server speed,
          security headers, and SEO—and gives you exact copy-paste code fixes or
          done-for-you repair.
        </p>

        {/* URL Input Form */}
        <form
          action={startAuditAction}
          className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            name="url"
            required
            placeholder="e.g. yourbusiness.com"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-base text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Run Free X-Ray
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* 4 Core Pillars */}
        <div className="mt-16 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <Zap className="mb-3 h-5 w-5 text-amber-400" />
            <h3 className="font-semibold text-white">Speed & Network</h3>
            <p className="mt-1 text-xs text-slate-400">
              Measures real TTFB, heavy &gt;500KB images, and slow mobile load times.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <Smartphone className="mb-3 h-5 w-5 text-cyan-400" />
            <h3 className="font-semibold text-white">Mobile Layout</h3>
            <p className="mt-1 text-xs text-slate-400">
              Detects horizontal overflow bugs and broken JS runtime errors.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <ShieldCheck className="mb-3 h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-white">Security Headers</h3>
            <p className="mt-1 text-xs text-slate-400">
              Audits HSTS, CSP, and clickjacking protection headers.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <Search className="mb-3 h-5 w-5 text-purple-400" />
            <h3 className="font-semibold text-white">SEO & Social Preview</h3>
            <p className="mt-1 text-xs text-slate-400">
              Checks missing OpenGraph images, meta tags, and alt attributes.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
