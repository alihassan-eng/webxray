import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/db';
import { audits } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signatureHeader = req.headers.get('paddle-signature') || '';
    const secret = process.env.PADDLE_WEBHOOK_SECRET!;

    const parts = Object.fromEntries(
      signatureHeader.split(';').map((part) => part.split('='))
    );
    const ts = parts['ts'];
    const h1 = parts['h1'];

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${ts}:${rawBody}`)
      .digest('hex');

    if (h1 !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event_type === 'transaction.completed') {
      const auditId = event.data?.custom_data?.auditId;
      const transactionId = event.data?.id;

      if (auditId) {
        await db
          .update(audits)
          .set({
            isUnlocked: true,
            paymentId: transactionId,
          })
          .where(eq(audits.id, auditId));
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Paddle Webhook Error:', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
