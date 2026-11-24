import { SITE_CONFIG } from '@/lib/site-config';

export default function ContactPage() {
  const whatsappText = encodeURIComponent(
    'Hi WebXray team! I ran a website audit and would like help fixing my site.'
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-300 sm:px-6 sm:py-16">
      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
        Engineering Support
      </span>
      <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
        Contact &amp; Support
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
        Have questions about your WebXray report, billing, or want our senior
        engineer to implement all fixes within 48 hours? Reach out directly via
        WhatsApp or Email.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={`https://wa.me/qr/2AMP6KKBNIIYH1${SITE_CONFIG.whatsappNumber}?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
        >
          Chat on WhatsApp
        </a>

        <a
          href={`mailto:${SITE_CONFIG.supportEmail}`}
          className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:border-slate-500 hover:bg-slate-800"
        >
          Email: {SITE_CONFIG.supportEmail}
        </a>
      </div>

      <div className="mt-8 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-sm">
        <p><strong className="text-white">Response Time:</strong> Under 2 hours (WhatsApp) / Under 4 hours (Email)</p>
        <p><strong className="text-white">Services:</strong> Automated Mobile Diagnostics ($29) &amp; Done-For-You Fixes ($499+)</p>
        <p><strong className="text-white">Hours:</strong> Monday – Saturday, Global Engineering Support — Overlapping US & EU Business Hours</p>
      </div>
    </main>
  );
}
