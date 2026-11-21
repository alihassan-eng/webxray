import { NextResponse } from 'next/server';
import { createAuditRecord, updateAuditRecord } from '@/db';
import { inngest } from '@/inngest/client';
import { runXrayScan } from '@/lib/xray-engine';
import { analyzeTelemetryWithAI } from '@/lib/ai-analyzer';

async function runDirectFallback(auditId: string, targetUrl: string) {
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawUrl = String(body?.url || '').trim();
    if (!rawUrl) {
      return NextResponse.json({ error: 'Please enter a valid URL.' }, { status: 400 });
    }

    const targetUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    const audit = await createAuditRecord(targetUrl);

    try {
      await inngest.send({
        name: 'xray/audit.requested',
        data: { auditId: audit.id, targetUrl },
      });
    } catch {
      void runDirectFallback(audit.id, targetUrl);
    }

    return NextResponse.json({ id: audit.id });
  } catch (err) {
    console.error('POST /api/audits error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Could not start audit.' },
      { status: 500 }
    );
  }
}
