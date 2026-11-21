'use server';

import { redirect } from 'next/navigation';
import { createAuditRecord, updateAuditRecord } from '@/db';
import { inngest } from '@/inngest/client';
import { runXrayScan } from '@/lib/xray-engine';
import { analyzeTelemetryWithAI } from '@/lib/ai-analyzer';

async function runDirectFallbackScan(auditId: string, targetUrl: string) {
  try {
    await updateAuditRecord(auditId, { status: 'SCANNING' });
    const telemetry = await runXrayScan(targetUrl);
    const aiReport = await analyzeTelemetryWithAI(telemetry);

    await updateAuditRecord(auditId, {
      status: 'COMPLETED',
      overallScore: aiReport.overallScore,
      performanceScore: aiReport.performanceScore,
      securityScore: aiReport.securityScore,
      seoScore: aiReport.seoScore,
      screenshotUrl: telemetry.screenshotBase64,
      issues: aiReport.issues,
    });
  } catch (err) {
    await updateAuditRecord(auditId, {
      status: 'FAILED',
      errorMessage: err instanceof Error ? err.message : 'Scan failed',
    });
  }
}

export async function startAuditAction(formData: FormData) {
  const rawUrl = String(formData.get('url') || '').trim();
  if (!rawUrl) return;

  const targetUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  const audit = await createAuditRecord(targetUrl);

  try {
    await inngest.send({
      name: 'xray/audit.requested',
      data: { auditId: audit.id, targetUrl },
    });
  } catch {
    void runDirectFallbackScan(audit.id, targetUrl);
  }

  redirect(`/report/${audit.id}`);
}

export async function saveLeadEmailAction(auditId: string, email: string) {
  if (!auditId || !email) return;
  await updateAuditRecord(auditId, {
    leadEmail: email.trim(),
  });
}
