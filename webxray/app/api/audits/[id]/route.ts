import { NextResponse } from 'next/server';
import { getAuditRecord } from '@/db';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const audit = await getAuditRecord(id);

  if (!audit) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
  }

  const allIssues = audit.issues ?? [];
  const totalIssuesCount = allIssues.length;

  const visibleIssues = audit.isUnlocked
    ? allIssues
    : allIssues.slice(0, 3).map((issue) => ({
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
    lockedIssuesCount: audit.isUnlocked ? 0 : Math.max(0, totalIssuesCount - 3),
    issues: visibleIssues,
    createdAt: audit.createdAt,
  });
}
