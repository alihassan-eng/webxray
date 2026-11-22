import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import type { XrayTelemetry } from './xray-engine';

const AuditReportSchema = z.object({
  overallScore: z.number().min(0).max(100),
  performanceScore: z.number().min(0).max(100),
  securityScore: z.number().min(0).max(100),
  seoScore: z.number().min(0).max(100),
  issues: z
    .array(
      z.object({
        id: z.string(),
        category: z.enum(['PERFORMANCE', 'SECURITY', 'SEO', 'UI_UX']),
        severity: z.enum(['CRITICAL', 'WARNING']),
        title: z.string(),
        businessImpact: z.string(),
        technicalFix: z.string(),
      })
    )
    .min(0)
    .max(12),
});

export type AiAuditReport = z.infer<typeof AuditReportSchema>;

const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
] as const;

export async function analyzeTelemetryWithAI(
  telemetry: XrayTelemetry
): Promise<AiAuditReport> {
  const { screenshotBase64: _ignored, ...cleanTelemetry } = telemetry;

  const prompt = `You are a Principal Frontend & Web Performance Architect auditing a live business website.
Analyze the following mobile telemetry data collected from an iPhone 14 viewport (390x844) and generate an honest, high-value diagnostic report:

${JSON.stringify(cleanTelemetry, null, 2)}

Rules:
1. Calculate realistic, well-calibrated scores (0-100) grounded strictly in the telemetry above:
   - Security: Start at 100 if HTTPS is active. Deduct 10 pts if strictTransportSecurity is false, and 5-8 pts each if contentSecurityPolicy or xFrameOptions is false. If HTTPS, HSTS, CSP, and X-Frame-Options are all true, Security MUST be 100.
   - Performance: Start at 100. Deduct points proportionally only if TTFB > 600ms, loadEventMs > 3500ms, totalRequests > 90, or largeImages (>500KB) exist.
   - SEO & UI: Start at 100. Deduct 10-15 pts only if hasMetaDescription is false, hasOgImage is false, hasH1 is false, hasHorizontalOverflow is true, or imagesMissingAlt > 0.
2. Only report real issues found in the telemetry. If a site passes all checks cleanly, return 1-2 proactive growth/conversion optimization tips (never invent missing security headers that are already true).
3. Write "businessImpact" in plain, persuasive business English.
4. Write "technicalFix" as clean, copy-pasteable production code tailored to detectedStack.`;

  for (const modelId of FALLBACK_MODELS) {
    try {
      const { output } = await generateText({
        model: google(modelId),
        maxRetries: 2,
        output: Output.object({
          schema: AuditReportSchema,
        }),
        prompt,
      });
      return output;
    } catch (err) {
      console.error(`❌ ${modelId} failed:`, err);
    }
  }

  return buildFallbackReport(telemetry);
}

function buildFallbackReport(t: XrayTelemetry): AiAuditReport {
  const issues: AiAuditReport['issues'] = [];

  if (!t.securityHeaders.contentSecurityPolicy || !t.securityHeaders.xFrameOptions) {
    issues.push({
      id: 'sec-headers',
      category: 'SECURITY',
      severity: 'WARNING',
      title: 'Missing Content-Security-Policy & Clickjacking Headers',
      businessImpact:
        'Without CSP and X-Frame-Options headers, browsers cannot block unauthorized script injection or iframe embedding, lowering enterprise buyer trust.',
      technicalFix: `// next.config.ts\nconst headers = [\n  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },\n  { key: 'X-Content-Type-Options', value: 'nosniff' },\n];`,
    });
  }

  if (!t.securityHeaders.strictTransportSecurity) {
    issues.push({
      id: 'sec-hsts',
      category: 'SECURITY',
      severity: 'WARNING',
      title: 'Enforce Strict-Transport-Security (HSTS) Preload',
      businessImpact:
        'Explicit HSTS headers prevent protocol downgrade attacks on public Wi-Fi networks.',
      technicalFix: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`,
    });
  }

  if (t.timing.loadEventMs > 2500 || t.timing.totalRequests > 60) {
    issues.push({
      id: 'perf-load',
      category: 'PERFORMANCE',
      severity: 'CRITICAL',
      title: `Slow Mobile Load (${(t.timing.loadEventMs / 1000).toFixed(1)}s across ${t.timing.totalRequests} requests)`,
      businessImpact:
        'Mobile visitors abandon pages taking longer than 2.5 seconds to finish loading, directly reducing demo bookings and conversions.',
      technicalFix: `import Script from 'next/script';\n<Script src="https://example.com" strategy="lazyOnload" />`,
    });
  }

  if (!t.domAndSeo.hasMetaDescription || !t.domAndSeo.hasOgImage) {
    issues.push({
      id: 'seo-meta',
      category: 'SEO',
      severity: 'WARNING',
      title: 'Incomplete Search & Social Preview Metadata',
      businessImpact:
        'Missing meta descriptions or OpenGraph preview images reduce click-through rates when links are shared on LinkedIn, X, or Google Search.',
      technicalFix: `export const metadata = {\n  description: 'Clear value proposition under 155 characters.',\n  openGraph: { images: ['/og-preview.png'] },\n};`,
    });
  }

  if (t.domAndSeo.imagesMissingAlt > 0) {
    issues.push({
      id: 'ui-alt',
      category: 'UI_UX',
      severity: 'WARNING',
      title: `${t.domAndSeo.imagesMissingAlt} Image(s) Missing Descriptive Alt Attributes`,
      businessImpact:
        'Missing alt text hurts Google Image indexing and breaks screen-reader accessibility for mobile users.',
      technicalFix: `<img src="${t.domAndSeo.missingAltImageUrls || '/hero.png'}" alt="Product preview" loading="lazy" />`,
    });
  }



  const securityScore = t.finalUrl.startsWith('https://')
    ? Math.min(
        100,
        84 +
          (t.securityHeaders.strictTransportSecurity ? 6 : 0) +
          (t.securityHeaders.contentSecurityPolicy ? 6 : 0) +
          (t.securityHeaders.xFrameOptions ? 4 : 0)
      )
    : 45;
  const performanceScore = Math.max(65, Math.min(99, Math.round(100 - t.timing.loadEventMs / 150)));
  const seoScore = Math.max(
    60,
    100 -
      (t.domAndSeo.hasMetaDescription ? 0 : 12) -
      (t.domAndSeo.hasOgImage ? 0 : 10) -
      Math.min(15, t.domAndSeo.imagesMissingAlt * 3)
  );
  const overallScore = Math.round((securityScore + performanceScore + seoScore) / 3);

  return {
    overallScore,
    performanceScore,
    securityScore,
    seoScore,
    issues,
  };
}
