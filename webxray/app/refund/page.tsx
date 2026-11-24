export default function RefundPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-slate-300 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Refund Policy</h1>
      <p className="mt-2 text-xs text-slate-400">Last updated: November 2026</p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed">
        <p>Thank you for using WebXray. Please read our refund policy carefully before purchasing a digital report unlock.</p>
        <h2 className="text-lg font-semibold text-white">1. Digital Report Unlocks ($29)</h2>
        <p>Because WebXray provides immediate, irrevocable access to digital diagnostic data and copy-paste source code fixes upon purchase, refunds are generally not issued once the digital report has been unlocked and viewed.</p>
        <h2 className="text-lg font-semibold text-white">2. Exceptions &amp; Technical Issues</h2>
        <p>If a technical error prevented your paid report from unlocking, or if the scan data was corrupted due to a platform malfunction, we will either re-run your audit manually or issue a full 100% refund within 7 days of purchase.</p>
        <h2 className="text-lg font-semibold text-white">3. How to Request Support</h2>
        <p>To request assistance or a refund review, email your Report ID to <span className="text-emerald-400">ali.webxray@gmail.com</span> within 7 days.</p>
      </div>
    </main>
  );
}
