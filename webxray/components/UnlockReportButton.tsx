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

  useEffect(() => {
    initializePaddle({
      environment: 'production',
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      eventCallback(data) {
        if (data.name === 'checkout.completed') {
          setTimeout(() => window.location.reload(), 1500);
        }
      },
    }).then((paddleInstance) => {
      if (paddleInstance) setPaddle(paddleInstance);
    });
  }, []);

  const handleCheckout = () => {
    if (!paddle) return;
    paddle.Checkout.open({
      items: [{ priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID!, quantity: 1 }],
      customData: { auditId },
    });
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full cursor-pointer rounded-xl bg-amber-400 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300 active:scale-[0.98]"
    >
      Unlock {lockedCount === 1 ? '1 More Issue' : `${lockedCount} More Issues`} + Code Fixes ($29) →
    </button>
  );
}
