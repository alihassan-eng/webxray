'use client';

import { useEffect, useState } from 'react';
import { initializePaddle, Paddle } from '@paddle/paddle-js';

export function UnlockReportButton({
  auditId,
  lockedCount,
}: {
  auditId: string;
  lockedCount: number;
}) {
  const [paddle, setPaddle] = useState<Paddle>();
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) {
      setStatusMsg('Payment configuration missing.');
      return;
    }

    initializePaddle({
      environment: 'production',
      token,
      eventCallback(data) {
        if (data.name === 'checkout.completed') {
          setTimeout(() => window.location.reload(), 1500);
        }
      },
    })
      .then((paddleInstance) => {
        if (paddleInstance) setPaddle(paddleInstance);
      })
      .catch((err) => {
        console.warn('Paddle script blocked or failed to load:', err);
        setStatusMsg('Checkout blocked by browser/AdBlocker or awaiting Paddle domain approval.');
      });
  }, []);

  const handleCheckout = () => {
    setStatusMsg(null);
    const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;

    if (!paddle) {
      setStatusMsg(
        'Checkout is initializing or awaiting Paddle live domain approval. Please disable any AdBlocker or try again shortly.'
      );
      return;
    }

    if (!priceId) {
      setStatusMsg('Price ID is not configured.');
      return;
    }

    try {
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customData: { auditId },
      });
    } catch (err) {
      console.error('Paddle Checkout Error:', err);
      setStatusMsg('Unable to open checkout. Domain verification may still be pending in Paddle.');
    }
  };

  const buttonLabel =
    lockedCount > 0
      ? `Unlock ${lockedCount === 1 ? '1 More Issue' : `${lockedCount} More Issues`} + Code Fixes ($29) →`
      : 'Unlock All Copy-Paste Code Fixes ($29) →';

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCheckout}
        className="w-full cursor-pointer rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300 active:scale-[0.98]"
      >
        {buttonLabel}
      </button>
      {statusMsg && (
        <p className="text-center text-xs text-amber-300/90">{statusMsg}</p>
      )}
    </div>
  );
}
