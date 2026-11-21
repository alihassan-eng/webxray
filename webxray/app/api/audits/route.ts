import { NextResponse, after } from 'next/server';
import { createAuditRecord, updateAuditRecord } from '@/db';
import { runXrayScan } from '@/lib/xray-engine';
import { analyzeTelemetryWithAI } from '@/lib/ai-analyzer';

export const maxDuration = 60;

async function executeAuditPipeline(auditId: string, targetUrl: string) {
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
    console.error('Audit pipeline error:', err);
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

    after(async () => {
      await executeAuditPipeline(audit.id, targetUrl);
    });

    return NextResponse.json({ id: audit.id });
  } catch (err) {
    console.error('POST /api/audits error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Could not start audit.' },
      { status: 500 }
    );
  }
}
