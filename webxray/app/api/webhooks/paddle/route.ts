import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
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
      const plan = event.data?.custom_data?.plan || 'report-unlock-29';
      const transactionId = event.data?.id || 'N/A';
      const customerEmail =
        event.data?.customer?.email ||
        event.data?.details?.totals?.email ||
        'Customer email in Paddle';
      const totalCents = event.data?.details?.totals?.total;
      const currency = event.data?.currency_code || 'USD';
      const formattedAmount = totalCents
        ? `${(Number(totalCents) / 100).toFixed(2)} ${currency}`
        : plan === 'agency-weekly-199'
          ? '$199.00 USD'
          : '$29.00 USD';

      const isAgencyPass = plan === 'agency-weekly-199';

      if (auditId) {
        await db
          .update(audits)
          .set({
            isUnlocked: true,
            paymentId: isAgencyPass ? `AGENCY_${transactionId}` : transactionId,
          })
          .where(eq(audits.id, auditId));
      }

      if (process.env.RESEND_API_KEY) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: 'WebXray Billing <onboarding@resend.dev>',
            to: 'alijuttbaggadogarr2@gmail.com',
            subject: isAgencyPass
              ? `🚀 NEW $199/WK AGENCY PASS PAID (${formattedAmount})`
              : `💰 NEW $29 REPORT UNLOCKED (${formattedAmount})`,
            html: `
              <h2>New Live Paddle Payment Received!</h2>
              <p><strong>Plan Purchased:</strong> ${isAgencyPass ? 'Weekly Unlimited Agency Pass ($199/wk)' : 'Single Full Report Unlock ($29)'}</p>
              <p><strong>Amount Paid:</strong> ${formattedAmount}</p>
              <p><strong>Customer Email:</strong> ${customerEmail}</p>
              <p><strong>Transaction ID:</strong> <code>${transactionId}</code></p>
              ${auditId ? `<p><strong>Audit ID:</strong> <code>${auditId}</code></p><p><strong>Report URL:</strong> <a href="https://vercel.app{auditId}">https://vercel.app{auditId}</a></p>` : ''}
              <p><em>Status: Automatically unlocked for the customer immediately.</em></p>
            `,
          });
        } catch (mailErr) {
          console.error('Resend payment alert error:', mailErr);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Paddle Webhook Error:', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
