import { NextResponse } from 'next/server';
import { db, getAuditRecord } from '@/db';
import { audits } from '@/db/schema';

function normalizeDomain(rawUrl: string): string {
  return rawUrl
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .split('?')[0];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const audit = await getAuditRecord(id);

  if (!audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  // چیک کریں کہ آیا یہ ویب سائٹ پہلے بھی اسکین ہو چکی ہے
  const currentDomain = normalizeDomain(audit.targetUrl);
  const allAudits = await db
    .select({
      id: audits.id,
      targetUrl: audits.targetUrl,
      createdAt: audits.createdAt,
    })
    .from(audits);

  const isRepeatScan = allAudits.some(
    (item) =>
      item.id !== audit.id &&
      normalizeDomain(item.targetUrl) === currentDomain &&
      new Date(item.createdAt).getTime() < new Date(audit.createdAt).getTime()
  );

  // پہلی بار صرف 2 مسائل مفت، دوبارہ اسی سائٹ کے اسکین پر 0 مسائل مفت
  const freePreviewLimit = isRepeatScan ? 0 : 2;

  const allIssues = audit.issues ?? [];
  const totalIssuesCount = allIssues.length;

  const visibleIssues = audit.isUnlocked
    ? allIssues
    : allIssues.slice(0, freePreviewLimit).map((issue) => ({
        ...issue,
        technicalFix: null,
      }));

  return NextResponse.json({
    id: audit.id,
    targetUrl: audit.targetUrl,
    status: audit.status,
    errorMessage: audit.errorMessage,
    overallScore: audit.overallScore,
    performanceScore: audit.performanceScore,
    securityScore: audit.securityScore,
    seoScore: audit.seoScore,
    screenshotUrl: audit.screenshotUrl,
    isUnlocked: audit.isUnlocked,
    totalIssuesCount,
    lockedIssuesCount: audit.isUnlocked
      ? 0
      : Math.max(0, totalIssuesCount - freePreviewLimit),
    issues: visibleIssues,
    createdAt: audit.createdAt,
  });
}
