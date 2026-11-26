'use client';

import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { submitFixLead } from '@/app/actions/lead';

export function AgencyPassButton({
  auditId,
  className = '',
  style,
}: {
  auditId?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [paddle, setPaddle] = useState<Paddle>();
  const [showFallbackForm, setShowFallbackForm] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) {
      console.warn('[WebXray Paddle] NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is missing in this environment.');
      return;
    }

    initializePaddle({
      environment: token.startsWith('test_') ? 'sandbox' : 'production',
      token,
      eventCallback(data) {
        if (data.name === 'checkout.completed') {
          setStatus('SUCCESS');
        }
      },
    })
      .then((paddleInstance) => {
        if (paddleInstance) setPaddle(paddleInstance);
      })
      .catch((err) => {
        console.error('[WebXray Paddle] Init error:', err);
      });
  }, []);

  const handleCheckout = () => {
    const agencyPriceId = process.env.NEXT_PUBLIC_PADDLE_AGENCY_PRICE_ID;
    if (!agencyPriceId) {
      console.warn('[WebXray Paddle] NEXT_PUBLIC_PADDLE_AGENCY_PRICE_ID is missing.');
    }

    if (paddle && agencyPriceId) {
      try {
        paddle.Checkout.open({
          items: [{ priceId: agencyPriceId, quantity: 1 }],
          customData: { plan: 'agency-weekly-199', ...(auditId ? { auditId } : {}) },
        });
        return;
      } catch (err) {
        console.error('[WebXray Paddle] Checkout open error:', err);
      }
    }

    setShowFallbackForm(true);
  };

  async function handleFallbackSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('LOADING');
    try {
      const formData = new FormData(e.currentTarget);
      if (auditId) formData.append('auditId', auditId);
      formData.append('targetUrl', '[$199/WEEK AGENCY PASS REQUEST]');

      const res = await submitFixLead(formData);
      setStatus(res?.success ? 'SUCCESS' : 'ERROR');
    } catch {
      setStatus('ERROR');
    }
  }

  if (status === 'SUCCESS') {
    return (
      <div className="mt-6 rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-3.5 text-center text-xs font-medium text-emerald-200">
        ✅ Agency Pass request received! Check your email for instant access details.
      </div>
    );
  }

  if (showFallbackForm) {
    return (
      <form onSubmit={handleFallbackSubmit} className="mt-6 space-y-2.5 rounded-xl border border-emerald-400/30 bg-slate-950/90 p-3.5">
        <p className="text-xs text-slate-300">
          Enter your agency email to get instant Weekly Pass access ($199/wk):
        </p>
        <input
          type="email"
          name="email"
          required
          placeholder="founder@agency.com"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
        />
        {status === 'ERROR' && (
          <p className="text-[11px] text-rose-400">Could not send right now—email ali.webxray@gmail.com directly.</p>
        )}
        <button
          type="submit"
          disabled={status === 'LOADING'}
          className="w-full cursor-pointer rounded-lg bg-emerald-400 py-2.5 text-xs font-extrabold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50"
        >
          {status === 'LOADING' ? 'Sending...' : 'Request Weekly Agency Pass ($199) →'}
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      style={style}
      className={
        className ||
        'mt-6 block w-full cursor-pointer rounded-xl bg-emerald-400 py-3 text-center text-xs font-extrabold text-slate-950 transition hover:bg-emerald-300'
      }
    >
      Get Weekly Agency Pass →
    </button>
  );
}
