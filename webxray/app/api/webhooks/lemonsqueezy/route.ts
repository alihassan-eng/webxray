// app/api/webhooks/lemonsqueezy/route.ts
import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { updateAuditRecord } from '@/db';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature') || '';
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

  if (secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(rawBody).digest('hex');

    if (
      signature.length !== digest.length ||
      !crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
    ) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload?.meta?.event_name;
  const auditId = payload?.meta?.custom_data?.audit_id;

  if (eventName === 'order_created' && auditId) {
    await updateAuditRecord(String(auditId), {
      isUnlocked: true,
      paymentId: String(payload?.data?.id || 'paid'),
    });
  }

  return NextResponse.json({ received: true });
}
