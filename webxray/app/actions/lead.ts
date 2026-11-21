'use server';

import { db } from '@/db';
import { leads } from '@/db/schema';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitFixLead(formData: FormData) {
  const email = formData.get('email')?.toString().trim();
  const auditId = formData.get('auditId')?.toString();
  const targetUrl = formData.get('targetUrl')?.toString();

  if (!email || !email.includes('@') || !auditId || !targetUrl) {
    return { success: false, error: 'Please enter a valid work email.' };
  }

  try {
    // 1. ڈیٹا بیس میں محفوظ کریں
    await db.insert(leads).values({
      auditId,
      email,
      targetUrl,
    });

    // 2. آپ کو فوری ای میل الرٹ بھیجیں (اپنی اصلی ای میل نیچے لکھیں)
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Web X-Ray <onboarding@resend.dev>',
        to: 'alijuttbaggadogarr2@gmail.com', // 👈 یہاں اپنی ذاتی ای میل لکھیں
        subject: `🔥 New $499+ Fix Lead: ${targetUrl}`,
        html: `
          <h2>New Done-For-You Engineering Request!</h2>
          <p><strong>Client Email:</strong> ${email}</p>
          <p><strong>Target Website:</strong> ${targetUrl}</p>
          <p><strong>Report Link:</strong> <a href="https://vercel.app{auditId}">View Full X-Ray Report</a></p>
        `,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Lead submission error:', error);
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}
