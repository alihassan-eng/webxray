import { HeroScanForm } from '../components/HeroScanForm';

const FEATURES = [
  {
    tag: 'Core Web Vitals',
    title: 'Speed & Network Waterfall',
    desc: 'Pinpoints slow server TTFB, unoptimized >500KB assets, and render-blocking scripts on 4G mobile.',
    accent: 'from-emerald-500/20 to-teal-500/5 border-emerald-500/20 text-emerald-400',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    tag: 'iPhone 14 Engine',
    title: 'Mobile Layout & Runtime',
    desc: 'Renders inside a real 390×844 viewport to catch horizontal overflow, broken buttons, and uncaught JS errors.',
    accent: 'from-sky-500/20 to-indigo-500/5 border-sky-500/20 text-sky-400',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    tag: 'Hardening',
    title: 'Security & Trust Headers',
    desc: 'Audits SSL, HSTS preload, Content-Security-Policy, and clickjacking headers that enterprise buyers check.',
    accent: 'from-amber-500/20 to-orange-500/5 border-amber-500/20 text-amber-400',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    tag: 'Search & Social',
    title: 'SEO & OpenGraph Cards',
    desc: 'Verifies meta descriptions, H1 hierarchy, image alt tags, and social share previews across LinkedIn & X.',
    accent: 'from-purple-500/20 to-pink-500/5 border-purple-500/20 text-purple-400',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <main
      id="top"
      className="relative overflow-x-hidden bg-slate-950 text-slate-50 selection:bg-emerald-500 selection:text-slate-950"
    >
      {/* Subtle Ambient Top Glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center overflow-hidden">
        <div className="h-[340px] w-[720px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-18 sm:pb-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span>Real iPhone 14 Viewport &amp; Runtime Diagnostics</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-3xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.08]">
          Find out why visitors are{' '}
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            leaving your website
          </span>{' '}
          in 30 seconds.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:mt-6 sm:text-lg">
          Enter any website URL. WebXray inspects your mobile layout, server
          speed, security headers, and SEO—and delivers copy-paste production
          code fixes or done-for-you repair.
        </p>

        <HeroScanForm />

        <p className="mt-4 text-xs text-slate-500">
          No signup required • Live headless mobile browser • Instant diagnostic report
        </p>

        {/* Modern Bento Feature Grid */}
        <div id="features" className="scroll-mt-24 pt-20 sm:pt-28">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              Deep Technical Telemetry
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Four layers of diagnostics in one scan
            </h2>
          </div>

          <div className="grid gap-5 text-left sm:grid-cols-2">
            {FEATURES.map((item) => (
              <div
                key={item.title}
                className="group relative rounded-3xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl hover:shadow-emerald-500/5"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-gradient-to-br ${item.accent}`}
                  >
                    {item.icon}
                  </div>
                  <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-400">
                    {item.tag}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-white transition group-hover:text-emerald-300">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Modern 3-Tier Pricing Cards (Free / Self-Serve / Done-For-You) */}
        <div id="pricing" className="scroll-mt-24 pt-20 sm:pt-28">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              Transparent Plans
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Start free. Upgrade only when you need fixes.
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
              Whether you have an in-house developer or want our senior engineer
              to ship the fixes for you, choose what fits best.
            </p>
          </div>

          <div className="grid gap-6 text-left lg:grid-cols-3">
            {/* Tier 1: Free */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-7">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Free X-Ray
                  </span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                    Instant
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-400">/ per scan</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  Quick health check to uncover why mobile visitors bounce.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Live iPhone 14 viewport screenshot
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Performance, Security &amp; SEO scores
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Top priority diagnostic preview
                  </li>
                </ul>
              </div>

              <a
                href="#top"
                className="mt-8 block w-full rounded-xl border border-slate-700 bg-slate-900 py-3 text-center text-sm font-bold text-white transition hover:border-slate-500 hover:bg-slate-800"
              >
                Run Free Scan ↑
              </a>
            </div>

            {/* Tier 2: Self-Serve ($29 - Highlighted) */}
            <div className="relative flex flex-col justify-between rounded-3xl border-2 border-emerald-400/70 bg-gradient-to-b from-emerald-500/15 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-emerald-500/10 sm:p-7">
              <div className="absolute -top-3.5 right-6 rounded-full bg-emerald-400 px-3 py-0.5 text-[11px] font-extrabold text-slate-950 uppercase">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                  Self-Serve Code Fixes
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$29</span>
                  <span className="text-xs text-slate-400">/ one-time unlock</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Built for founders &amp; developers who want exact copy-paste fixes fast.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Unlock every hidden issue in your report
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Copy-paste production code snippets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Security headers, meta &amp; speed patches
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Shareable permanent report link
                  </li>
                </ul>
              </div>

              <a
                href="#top"
                className="mt-8 block w-full rounded-xl bg-emerald-400 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
              >
                Scan Site to Unlock →
              </a>
            </div>

            {/* Tier 3: Done-For-You ($499+) */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-7">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">
                    Done-For-You
                  </span>
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-300">
                    48h Turnaround
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$499+</span>
                  <span className="text-xs text-slate-400">/ fixed project</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  No developer? Our senior engineer implements every fix directly in your repo.
                </p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Full mobile responsiveness &amp; UI polish
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Core Web Vitals &amp; TTFB optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Enterprise SSL/CSP hardening &amp; SEO setup
                  </li>
                </ul>
              </div>

              <a
                href="/contact"
                className="mt-8 block w-full rounded-xl border border-amber-500/40 bg-amber-500/10 py-3 text-center text-sm font-bold text-amber-300 transition hover:bg-amber-500/20"
              >
                Book Engineering Fix →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
