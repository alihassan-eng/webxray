'use client';

import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { submitFixLead } from '@/app/actions/lead';

export function UnlockReportButton({
  auditId,
  lockedCount,
}: {
  auditId: string;
  lockedCount: number;
}) {
  const [paddle, setPaddle] = useState<Paddle>();
  const [showFallbackForm, setShowFallbackForm] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return;

    initializePaddle({
      environment: token.startsWith('test_') ? 'sandbox' : 'production',
      token,
      eventCallback(data) {
        if (data.name === 'checkout.loaded' || data.name === 'checkout.closed') setIsOpening(false);
        if (data.name === 'checkout.completed') {
          setTimeout(() => window.location.reload(), 1500);
        }
      },
    })
      .then((paddleInstance) => {
        if (paddleInstance) setPaddle(paddleInstance);
      })
      .catch(() => {
        // خاموشی سے فال بیک موڈ پر رہیں تاکہ Next.js ایرر نہ دکھائے
      });
  }, []);

  const handleCheckout = () => {
    const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;

    if (paddle && priceId) {
      try {
        setIsOpening(true);
        setTimeout(() => setIsOpening(false), 4000);
        paddle.Checkout.open({
          settings: { displayMode: 'overlay', theme: 'dark', locale: 'en' },
          items: [{ priceId, quantity: 1 }],
          customData: { auditId },
        });
        return;
      } catch {
        // اگر ڈومین ابھی زیرِ غور ہو تو نیچے والا فارم کھول دیں
      }
    }

    // اسمارٹ بیک اَپ: جب تک Paddle ڈومین اپروو نہ ہو، کلائنٹ کی ای میل پکڑیں
    setShowFallbackForm(true);
  };

  async function handleFallbackSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('LOADING');
    const formData = new FormData(e.currentTarget);
    formData.append('auditId', auditId);
    formData.append('targetUrl', `[$29 REPORT REQUEST] Audit ID: ${auditId}`);

    const res = await submitFixLead(formData);
    if (res.success) {
      setStatus('SUCCESS');
    } else {
      setStatus('ERROR');
    }
  }

  const buttonLabel = "Unlock Full Report ($29) →";

  if (status === 'SUCCESS') {
    return (
      <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-center text-xs font-medium text-amber-200">
        ✅ Request received! We are sending your unlocked full report &amp; payment link to your email within 15 minutes.
      </div>
    );
  }

  if (showFallbackForm) {
    return (
      <form onSubmit={handleFallbackSubmit} className="space-y-2.5 rounded-xl border border-amber-400/30 bg-slate-950/90 p-3.5">
        <p className="text-xs text-slate-300">
          Enter your email to receive the unlocked full report &amp; instant invoice ($29):
        </p>
        <input
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'LOADING'}
          className="w-full cursor-pointer rounded-lg bg-amber-400 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-amber-300 disabled:opacity-50"
        >
          {status === 'LOADING' ? 'Sending...' : 'Send Full Report & Invoice ($29) →'}
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      className="w-full cursor-pointer rounded-xl whitespace-nowrap bg-amber-400 py-3 text-xs font-bold text-slate-950 transition hover:bg-amber-300 active:scale-[0.98]"
    >
      {isOpening ? 'Opening Secure Checkout...' : buttonLabel}
    </button>
  );
}
