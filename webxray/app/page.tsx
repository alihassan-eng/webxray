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
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-16 text-center sm:px-6 sm:pt-18 sm:pb-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span>Real iPhone 14 Viewport &amp; Runtime Diagnostics</span>
        </div>

        <h1 className="mx-auto max-w-6xl text-3xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.08]">
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
        <div id="pricing" style={{ maxWidth: '1152px', margin: '0 auto', padding: '96px 24px 112px' }} className="scroll-mt-24">
  <div style={{ marginBottom: '56px', textAlign: 'center' }}>
    <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
      Transparent Pricing
    </span>
    <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
      Start free. Upgrade only when you need fixes.
    </h2>
    <p style={{ marginTop: '14px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }} className="text-sm leading-relaxed text-slate-400">
      Simple, predictable plans for solo founders, store owners, and agencies.
    </p>
  </div>

  <div style={{ gap: '28px' }} className="grid text-left sm:grid-cols-2 lg:grid-cols-3">
    {/* 1. Free Scan */}
    <div style={{ padding: '28px' }} className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-600 hover:bg-slate-900/90 hover:shadow-xl">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">Free Scan</span>
          <span style={{ padding: '4px 12px' }} className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-800 text-[10px] font-semibold text-slate-300">
            Instant
          </span>
        </div>
        <div style={{ marginTop: '20px' }} className="flex items-baseline gap-1.5">
          <span className="text-4xl font-extrabold tracking-tight text-white">$0</span>
          <span className="text-xs text-slate-400">/ scan</span>
        </div>
        <p style={{ marginTop: '12px', minHeight: '42px' }} className="text-xs leading-relaxed text-slate-400">
          Quick mobile health check to see if your site is leaking visitors.
        </p>
        <ul style={{ marginTop: '20px', paddingTop: '20px' }} className="space-y-3 border-t border-slate-800 text-xs text-slate-300">
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Live iPhone 14 mobile preview</li>
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Overall mobile health score</li>
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Executive profit &amp; loss summary</li>
        </ul>
      </div>
      <a href="#top" style={{ marginTop: '28px', padding: '12px 16px' }} className="block w-full rounded-xl border border-slate-700 bg-slate-800 text-center text-xs font-bold text-white transition group-hover:border-slate-500 group-hover:bg-slate-700">
        Run Free Scan ↑
      </a>
    </div>

    {/* 2. Self-Serve ($29 — Most Popular) */}
    <div style={{ padding: '28px' }} className="group flex flex-col justify-between rounded-2xl border-2 border-emerald-400 bg-gradient-to-b from-emerald-500/15 via-slate-900/95 to-slate-950 shadow-xl shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/20">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-extrabold tracking-wider text-emerald-300 uppercase">Self-Serve</span>
          <span style={{ padding: '4px 12px' }} className="whitespace-nowrap rounded-full bg-emerald-400 text-[10px] font-black tracking-wide text-slate-950 uppercase">
            Most Popular
          </span>
        </div>
        <div style={{ marginTop: '20px' }} className="flex items-baseline gap-1.5">
          <span className="text-4xl font-black tracking-tight text-white">$29</span>
          <span className="text-xs text-slate-300">/ report</span>
        </div>
        <p style={{ marginTop: '12px', minHeight: '42px' }} className="text-xs leading-relaxed text-slate-300">
          For founders &amp; devs who want exact copy-paste code fixes fast.
        </p>
        <ul style={{ marginTop: '20px', paddingTop: '20px' }} className="space-y-3 border-t border-emerald-500/20 text-xs text-slate-100">
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Unlock all hidden issues &amp; scores</li>
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Stack-specific copy-paste code</li>
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Permanent shareable report link</li>
        </ul>
      </div>
      <a href="#top" style={{ marginTop: '28px', padding: '12px 16px' }} className="block w-full rounded-xl bg-emerald-400 text-center text-xs font-extrabold text-slate-950 shadow-md shadow-emerald-400/20 transition group-hover:bg-emerald-300">
        Scan Site to Unlock →
      </a>
    </div>

    {/* 3. Done-For-You ($499+) */}
    <div style={{ padding: '28px' }} className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-600 hover:bg-slate-900/90 hover:shadow-xl">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">Done-For-You</span>
          <span style={{ padding: '4px 12px' }} className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-800 text-[10px] font-semibold text-slate-300">
            48h Delivery
          </span>
        </div>
        <div style={{ marginTop: '20px' }} className="flex items-baseline gap-1.5">
          <span className="text-4xl font-extrabold tracking-tight text-white">$499+</span>
          <span className="text-xs text-slate-400">/ project</span>
        </div>
        <p style={{ marginTop: '12px', minHeight: '42px' }} className="text-xs leading-relaxed text-slate-400">
          No developer? We ship every speed, security &amp; mobile fix for you.
        </p>
        <ul style={{ marginTop: '20px', paddingTop: '20px' }} className="space-y-3 border-t border-slate-800 text-xs text-slate-300">
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Direct fixes shipped to your repo</li>
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Core Web Vitals &amp; mobile polish</li>
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Security headers &amp; SEO setup</li>
        </ul>
      </div>
      <a href="/contact?plan=done-for-you" style={{ marginTop: '28px', padding: '12px 16px' }} className="block w-full rounded-xl border border-slate-700 bg-slate-800 text-center text-xs font-bold text-white transition group-hover:border-slate-500 group-hover:bg-slate-700">
        Book Engineering Fix →
      </a>
    </div>

    {/* 4. Agency Pass ($199/week — Recommended) */}
    <div style={{ padding: '28px' }} className="group flex flex-col justify-between rounded-2xl border-2 border-emerald-400/80 bg-gradient-to-b from-emerald-500/15 via-slate-900/95 to-slate-950 shadow-xl shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-extrabold tracking-wider text-emerald-300 uppercase">Agency Pass</span>
          <span style={{ padding: '4px 12px' }} className="whitespace-nowrap rounded-full bg-emerald-400 text-[10px] font-black tracking-wide text-slate-950 uppercase">
            Recommended
          </span>
        </div>
        <div style={{ marginTop: '20px' }} className="flex items-baseline gap-1.5">
          <span className="text-4xl font-black tracking-tight text-white">$199</span>
          <span className="text-xs text-slate-300">/ week</span>
        </div>
        <p style={{ marginTop: '12px', minHeight: '42px' }} className="text-xs leading-relaxed text-slate-300">
          Scan unlimited client sites for 7 days &amp; unlock every code fix.
        </p>
        <ul style={{ marginTop: '20px', paddingTop: '20px' }} className="space-y-3 border-t border-emerald-500/20 text-xs text-slate-100">
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Unlimited scans across any stack</li>
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Full unlocked reports &amp; snippets</li>
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Close leads with live audit links</li>
        </ul>
      </div>
      <a href="/contact?plan=agency-weekly" style={{ marginTop: '28px', padding: '12px 16px' }} className="block w-full rounded-xl bg-emerald-400 text-center text-xs font-extrabold text-slate-950 shadow-md shadow-emerald-400/20 transition group-hover:bg-emerald-300">
        Get Weekly Pass →
      </a>
    </div>

    {/* 5. Site Upgrade ($799+) */}
    <div style={{ padding: '28px' }} className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-600 hover:bg-slate-900/90 hover:shadow-xl">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">Site Upgrade</span>
          <span style={{ padding: '4px 12px' }} className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-800 text-[10px] font-semibold text-slate-300">
            Custom Scope
          </span>
        </div>
        <div style={{ marginTop: '20px' }} className="flex items-baseline gap-1.5">
          <span className="text-4xl font-extrabold tracking-tight text-white">$799+</span>
          <span className="text-xs text-slate-400">/ custom</span>
        </div>
        <p style={{ marginTop: '12px', minHeight: '42px' }} className="text-xs leading-relaxed text-slate-400">
          Upgrade your store or site—fix bugs, improve navigation &amp; add features.
        </p>
        <ul style={{ marginTop: '20px', paddingTop: '20px' }} className="space-y-3 border-t border-slate-800 text-xs text-slate-300">
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Eliminate bugs &amp; slow legacy code</li>
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Add new features or streamline UI</li>
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Tailored quote for your business</li>
        </ul>
      </div>
      <a href="/contact?plan=site-upgrade" style={{ marginTop: '28px', padding: '12px 16px' }} className="block w-full rounded-xl border border-slate-700 bg-slate-800 text-center text-xs font-bold text-white transition group-hover:border-slate-500 group-hover:bg-slate-700">
        Request Upgrade Quote →
      </a>
    </div>

    {/* 6. Monthly Care ($249/mo) */}
    <div style={{ padding: '28px' }} className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-600 hover:bg-slate-900/90 hover:shadow-xl">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">Monthly Care</span>
          <span style={{ padding: '4px 12px' }} className="whitespace-nowrap rounded-full border border-slate-700 bg-slate-800 text-[10px] font-semibold text-slate-300">
            Recurring
          </span>
        </div>
        <div style={{ marginTop: '20px' }} className="flex items-baseline gap-1.5">
          <span className="text-4xl font-extrabold tracking-tight text-white">$249</span>
          <span className="text-xs text-slate-400">/ month</span>
        </div>
        <p style={{ marginTop: '12px', minHeight: '42px' }} className="text-xs leading-relaxed text-slate-400">
          Continuous speed, security &amp; uptime care for live business websites.
        </p>
        <ul style={{ marginTop: '20px', paddingTop: '20px' }} className="space-y-3 border-t border-slate-800 text-xs text-slate-300">
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Weekly speed &amp; security checks</li>
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Ongoing bug fixes &amp; security patches</li>
          <li className="flex items-center gap-2.5"><span className="text-emerald-400">✓</span> Priority monthly UI &amp; content edits</li>
        </ul>
      </div>
      <a href="/contact?plan=monthly-care" style={{ marginTop: '28px', padding: '12px 16px' }} className="block w-full rounded-xl border border-slate-700 bg-slate-800 text-center text-xs font-bold text-white transition group-hover:border-slate-500 group-hover:bg-slate-700">
        Start Monthly Care →
      </a>
    </div>
  </div>
</div>

      </section>
    
      {/* Infinite Smooth Social & Community Marquee Strip */}
      <section aria-label="Official Social Channels" className="border-t border-slate-800/80 bg-slate-950/95 py-7 overflow-hidden">
        <style>{`
          @keyframes webxrayMarquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .webxray-marquee-track {
            display: flex;
            width: max-content;
            animation: webxrayMarquee 30s linear infinite;
          }
          .webxray-marquee-wrapper:hover .webxray-marquee-track {
            animation-play-state: paused;
          }
        `}</style>

        <div className="mb-4 text-center">
          <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Follow Build-in-Public Updates &amp; Live Audits
          </span>
        </div>

        <div className="webxray-marquee-wrapper relative w-full overflow-hidden">
          <div className="webxray-marquee-track flex items-center gap-5 px-3">
            {[0, 1].map((loopIdx) => (
              <div key={loopIdx} className="flex items-center gap-5">
                {/* 1. LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "10px 20px" }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/60 hover:bg-slate-800 hover:text-white"
                >
                  <svg className="h-4 w-4 text-sky-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/></svg>
                  <span>LinkedIn</span>
                  <span className="text-slate-400">@alihassan-eng</span>
                </a>

                {/* 2. X (WebXray Official) */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "10px 20px" }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/60 hover:bg-slate-800 hover:text-white"
                >
                  <svg className="h-3.5 w-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span>WebXray Official</span>
                  <span className="text-slate-400">@WebXrayApp</span>
                </a>

                {/* 3. X (Founder) */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "10px 20px" }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/60 hover:bg-slate-800 hover:text-white"
                >
                  <svg className="h-3.5 w-3.5 text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span>Founder on X</span>
                  <span className="text-slate-400">@alihassan_eng</span>
                </a>

                {/* 4. YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "10px 20px" }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/60 hover:bg-slate-800 hover:text-white"
                >
                  <svg className="h-4 w-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  <span>YouTube</span>
                  <span className="text-slate-400">@alihassan_eng</span>
                </a>

                {/* 5. Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "10px 20px" }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/60 hover:bg-slate-800 hover:text-white"
                >
                  <svg className="h-4 w-4 text-pink-400" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z"/></svg>
                  <span>Instagram</span>
                  <span className="text-slate-400">@alihassan_eng</span>
                </a>

                {/* 6. TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "10px 20px" }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/60 hover:bg-slate-800 hover:text-white"
                >
                  <svg className="h-4 w-4 text-emerald-300" fill="currentColor" viewBox="0 0 24 24"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z"/></svg>
                  <span>TikTok</span>
                  <span className="text-slate-400">@alihassan_eng</span>
                </a>

                {/* 7. Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: "10px 20px" }}
                  className="inline-flex items-center gap-2.5 rounded-full border border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/60 hover:bg-slate-800 hover:text-white"
                >
                  <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>
                  <span>Facebook</span>
                  <span className="text-slate-400">Ali Hassan</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
