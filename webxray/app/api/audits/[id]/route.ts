import { NextResponse } from "next/server";
import { db, getAuditRecord } from "@/db";
import { audits } from "@/db/schema";

function normalizeDomain(rawUrl: string): string {
  const clean = rawUrl
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");
  const host = clean.split("/").at(0) ?? clean;
  return host.split("?").at(0) ?? host;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const audit = await getAuditRecord(id);

  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  const currentDomain = normalizeDomain(audit.targetUrl);
  const allAudits = await db
    .select({
      id: audits.id,
      targetUrl: audits.targetUrl,
      isUnlocked: audits.isUnlocked,
      createdAt: audits.createdAt,
    })
    .from(audits);

  const hasPaidForDomain = allAudits.some(
    (item) =>
      normalizeDomain(item.targetUrl) === currentDomain && item.isUnlocked
  );

  const effectiveUnlocked = audit.isUnlocked || hasPaidForDomain;

  const isRepeatScan = allAudits.some(
    (item) =>
      item.id !== audit.id &&
      normalizeDomain(item.targetUrl) === currentDomain &&
      new Date(item.createdAt).getTime() < new Date(audit.createdAt).getTime()
  );

  const freePreviewLimit = isRepeatScan ? 0 : 2;

  const allIssues = audit.issues ?? [];
  const totalIssuesCount = allIssues.length;

  const visibleIssues = effectiveUnlocked
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
    isUnlocked: effectiveUnlocked,
    totalIssuesCount,
    lockedIssuesCount: effectiveUnlocked
      ? 0
      : Math.max(0, totalIssuesCount - freePreviewLimit),
    issues: visibleIssues,
    createdAt: audit.createdAt,
  });
}
