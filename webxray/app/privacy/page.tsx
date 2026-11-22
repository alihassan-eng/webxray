export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-300 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mt-2 text-xs text-slate-400">Last updated: November 2026</p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed">
        <p>WebXray respects your privacy and is committed to protecting personal and technical data collected during website audits.</p>
        <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
        <p>We collect publicly accessible website URLs submitted for scanning, generated diagnostic telemetry, and your email address only if you voluntarily request engineering services or purchase a report.</p>
        <h2 className="text-lg font-semibold text-white">2. How We Use Information</h2>
        <p>Data is used solely to generate your diagnostic report, deliver purchased code fixes, and respond to engineering inquiries. We never sell your data to third parties.</p>
        <h2 className="text-lg font-semibold text-white">3. Payment Security</h2>
        <p>We do not store credit card numbers. All financial transactions are encrypted and handled by Paddle.</p>
        <h2 className="text-lg font-semibold text-white">4. Contact</h2>
        <p>Privacy inquiries may be sent to <span className="text-emerald-400">core.infrastructure.lab@gmail.com</span>.</p>
      </div>
    </main>
  );
}
