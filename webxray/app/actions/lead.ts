'use server';

import { db } from '@/db';
import { leads } from '@/db/schema';
import { Resend } from 'resend';

export async function submitFixLead(formData: FormData) {
  const email = formData.get('email')?.toString().trim();
  const auditId = formData.get('auditId')?.toString();
  const targetUrl = formData.get('targetUrl')?.toString();

  if (!email || !email.includes('@') || !auditId || !targetUrl) {
    return { success: false, error: 'Please enter a valid work email.' };
  }

  try {
    // 1. پہلے ڈیٹا بیس میں لیڈ محفوظ کریں
    await db.insert(leads).values({
      auditId,
      email,
      targetUrl,
    });

    // 2. پھر Resend سے ای میل الرٹ بھیجیں
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const { error: resendError } = await resend.emails.send({
        from: 'Web X-Ray <onboarding@resend.dev>',
        to: 'alijuttbaggadogarr2@gmail.com',
        subject: `🔥 New $499+ Fix Lead: ${targetUrl}`,
        html: `
          <h2>New Done-For-You Engineering Request!</h2>
          <p><strong>Client Email:</strong> ${email}</p>
          <p><strong>Target Website:</strong> ${targetUrl}</p>
          <p><strong>Report Link:</strong> <a href="https://webxray-virid.vercel.app/${auditId}">View Full X-Ray Report</a></p>
        `,
      });

      if (resendError) {
        console.error('Resend API Error:', resendError);
        return {
          success: false,
          error: `Email Alert Error: ${resendError.message}`,
        };
      }
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Lead submission error:', error);
    const msg = error instanceof Error ? error.message : 'Database error';
    return { success: false, error: `Failed: ${msg}` };
  }
}
