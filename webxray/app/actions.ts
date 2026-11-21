'use server';

import { redirect } from 'next/navigation';
import { createAuditRecord, updateAuditRecord } from '@/db';
import { inngest } from '@/inngest/client';

export async function startAuditAction(formData: FormData) {
  const rawUrl = String(formData.get('url') || '').trim();
  if (!rawUrl) return;

  const targetUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  const auditId = await createAuditRecord(targetUrl);

  await inngest.send({
    name: 'xray/audit.requested',
    data: {
      auditId,
      targetUrl,
    },
  });

  redirect(`/report/${auditId}`);
}

export async function saveLeadEmailAction(auditId: string, email: string) {
  if (!auditId || !email) return;
  await updateAuditRecord(auditId, {
    leadEmail: email.trim(),
  });
}
