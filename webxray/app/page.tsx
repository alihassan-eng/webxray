import { HeroScanForm } from '../components/HeroScanForm';


export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-50 selection:bg-emerald-500 selection:text-slate-950">
      {/* Header - Clean spacing on all Android & iOS screens */}
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <div className="flex shrink-0 items-center gap-2.5 text-lg font-bold tracking-tight sm:text-xl">
          <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-emerald-400" />
          <span>WebXray</span>
        </div>
        <span className="shrink-0 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1 text-[11px] font-medium text-slate-400 sm:px-3.5 sm:text-xs">
          Free 30s Audit
        </span>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 pt-8 pb-20 text-center sm:px-6 sm:pt-14 sm:pb-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300">
          <span>📱</span>
          <span>Real iPhone 14 Viewport &amp; Runtime Diagnostics</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.1]">
          Find out why visitors are{' '}
          <span className="text-emerald-400">leaving your website</span> in 30
          seconds.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-400 sm:mt-6 sm:text-lg">
          Enter any website URL. WebXray scans your mobile layout, server speed,
          security headers, and SEO—and gives you exact copy-paste code fixes or
          done-for-you repair.
        </p>

        {/* Zero-Latency Scan Form */}
        <HeroScanForm />

        <p className="mt-4 text-xs text-slate-500">
          No signup required • Live headless mobile browser • Real code fixes
        </p>

        {/* Feature Grid */}
        <div className="mt-16 grid gap-4 text-left sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: '⚡',
              title: 'Speed & Network',
              desc: 'Measures real TTFB, heavy >500KB images, and slow mobile load times.',
            },
            {
              icon: '📱',
              title: 'Mobile Layout',
              desc: 'Detects horizontal overflow bugs and broken JS runtime errors.',
            },
            {
              icon: '🛡️',
              title: 'Security Headers',
              desc: 'Audits HSTS, CSP, and clickjacking protection headers.',
            },
            {
              icon: '🔍',
              title: 'SEO & Social Preview',
              desc: 'Checks missing OpenGraph images, meta tags, and alt attributes.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="mb-3 text-2xl">{item.icon}</div>
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
