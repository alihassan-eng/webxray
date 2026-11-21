'use server';

import { redirect } from 'next/navigation';
import { createAuditRecord, updateAuditRecord } from '@/db';
import { inngest } from '@/inngest/client';

export async function startAuditAction(formData: FormData) {
  const rawUrl = String(formData.get('url') || '').trim();
  if (!rawUrl) {
    throw new Error('Please enter a valid website URL.');
  }

  const normalizedUrl = rawUrl.startsWith('http')
    ? rawUrl
    : `https://${rawUrl}`;

  const created = await createAuditRecord(normalizedUrl);

  await inngest.send({
    name: 'audit/started',
    data: {
      auditId: created.id,
      targetUrl: normalizedUrl,
    },
  });

  redirect(`/report/${created.id}`);
}

export async function saveLeadEmailAction(auditId: string, email: string) {
  const cleanEmail = email.trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { ok: false, message: 'Please enter a valid email address.' };
  }

  await updateAuditRecord(auditId, { leadEmail: cleanEmail });

  return { ok: true };
}
