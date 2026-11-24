export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-300 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
      <p className="mt-2 text-xs text-slate-400">Last updated: November 2026</p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed">
        <p>Welcome to WebXray. By accessing or using our website diagnostic platform, you agree to be bound by these Terms of Service.</p>
        <h2 className="text-lg font-semibold text-white">1. Services Provided</h2>
        <p>WebXray provides automated mobile viewport diagnostics, performance, security header, and SEO audits, along with digital code remediation guides ($29 one-time unlock) and optional custom engineering services ($499+).</p>
        <h2 className="text-lg font-semibold text-white">2. Authorized Use</h2>
        <p>You agree to only scan websites you own or have legitimate business interest in analyzing, and not to abuse our scanning infrastructure.</p>
        <h2 className="text-lg font-semibold text-white">3. Payments &amp; Billing</h2>
        <p>All payments are securely processed by our Merchant of Record, Paddle. Access to unlocked digital code fixes is granted immediately upon payment confirmation.</p>
        <h2 className="text-lg font-semibold text-white">4. Contact</h2>
        <p>For questions regarding these terms, contact us at <span className="text-emerald-400">ali.webxray@gmail.com</span>.</p>
      </div>
    </main>
  );
}
