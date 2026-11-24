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
  'gemini-3.8-flash',
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
2. Only report real issues found in the telemetry. Never invent fake issues—if all checks pass, return an empty issues array [].
3. Write "businessImpact" in plain, persuasive business English, naming the exact missing tag(s) or header(s).
3b. CRITICAL CSP & HEADER REPORTING RULE:
   - If securityHeaders.metaContentSecurityPolicy is true AND securityHeaders.contentSecurityPolicy is false, state both facts side by side in the issue title: "CSP present in HTML. CSP and X-Frame-Options response headers absent." (and explain that <meta> CSP cannot enforce frame-ancestors/clickjacking protection).
4. CRITICAL STACK-MATCHING RULE for "technicalFix":
   - Inspect "detectedStack" carefully and always state the exact missing tag(s) or header(s) at the top.
   - If detectedStack indicates "Next.js", provide Next.js (next.config.ts / metadata) code including full CSP & X-Frame-Options.
   - If detectedStack indicates plain "HTML" / "Static" / no JS framework, NEVER output Next.js code! Clearly separate:
     (1) What can be fixed directly in plain HTML (<head> tags like <meta http-equiv="Content-Security-Policy"> or <meta name="description"> / <meta property="og:image">), AND
     (2) What cannot be fixed in HTML alone and requires hosting/HTTP response header control (e.g., X-Frame-Options / frame-ancestors via Cloudflare free proxy, _headers, .htaccess, or nginx).
   - Show ONLY the exact missing snippet/tags needed for this specific site.`;

  for (const modelId of FALLBACK_MODELS) {
    try {
      const { output } = await generateText({
        model: google(modelId),
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(25000),
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
  const stackLabel = Array.isArray(t.detectedStack) ? (t.detectedStack.join(", ") || 'Static HTML') : (t.detectedStack || 'Static HTML');
  const isNextJs = /next\.?js/i.test(stackLabel);
  const isWordPress = /wordpress/i.test(stackLabel);

  const missingCsp = !t.securityHeaders.contentSecurityPolicy;
  const missingXFrame = !t.securityHeaders.xFrameOptions;

  if (missingCsp || missingXFrame) {
    const missingList = [
      missingCsp ? 'Content-Security-Policy' : null,
      missingXFrame ? 'X-Frame-Options' : null,
    ]
      .filter(Boolean)
      .join(' & ');

    let fixCode = [
      `<!-- Detected Stack: ${stackLabel} -->`,
      `<!-- Exact Missing HTTP Header(s): ${missingList} -->`,
      missingCsp
        ? `<!-- 1. Fixable directly in plain HTML (<head>): -->\n<meta http-equiv="Content-Security-Policy" content="default-src 'self' https:; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:;" />`
        : null,
      missingXFrame
        ? `<!-- 2. Requires Hosting / HTTP Response Header Control (X-Frame-Options cannot be set in HTML <meta> on static hosts like GitHub Pages; use Cloudflare free proxy, _headers, or .htaccess): -->\n# Hosting / Server HTTP Response Headers:\n${missingCsp ? "Content-Security-Policy: default-src 'self' https:; img-src 'self' data: https:; frame-ancestors 'self';\n" : ''}X-Frame-Options: SAMEORIGIN\nX-Content-Type-Options: nosniff`
        : null,
    ]
      .filter(Boolean)
      .join('\n\n');

    if (isNextJs) {
      fixCode = `// Detected Stack: ${stackLabel} (next.config.ts)\n// Exact Missing HTTP Header(s): ${missingList}\nconst securityHeaders = [\n  ${missingCsp ? `{ key: 'Content-Security-Policy', value: "default-src 'self' https:; img-src 'self' data: https:; frame-ancestors 'self';" },\n  ` : ''}${missingXFrame ? `{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },\n  ` : ''}{ key: 'X-Content-Type-Options', value: 'nosniff' },\n];`;
    } else if (isWordPress) {
      fixCode = `# Detected Stack: ${stackLabel} (.htaccess)\n// Exact Missing HTTP Header(s): ${missingList}\n<IfModule mod_headers.c>\n  ${missingCsp ? 'Header set Content-Security-Policy "default-src \'self\' https:; frame-ancestors \'self\';"\n  ' : ''}${missingXFrame ? 'Header set X-Frame-Options "SAMEORIGIN"\n  ' : ''}Header set X-Content-Type-Options "nosniff"\n</IfModule>`;
    }

    issues.push({
      id: 'sec-headers',
      category: 'SECURITY',
      severity: 'WARNING',
      title: `Missing ${missingList} Header(s) [${stackLabel}]`,
      businessImpact: `HTTP response is missing ${missingList}, so browsers cannot block unauthorized script injection or iframe clickjacking, lowering buyer trust.`,
      technicalFix: fixCode,
    });
  }

  if (!t.securityHeaders.strictTransportSecurity) {
    const hstsFix = isNextJs
      ? `// Detected Stack: ${stackLabel} (next.config.ts)\n// Missing Header: Strict-Transport-Security\n{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }`
      : `# Detected Stack: ${stackLabel} (Requires Hosting / Server HTTP Header Control)\n# Missing Header: Strict-Transport-Security\nStrict-Transport-Security: max-age=63072000; includeSubDomains; preload`;

    issues.push({
      id: 'sec-hsts',
      category: 'SECURITY',
      severity: 'WARNING',
      title: `Missing Strict-Transport-Security (HSTS) Header [${stackLabel}]`,
      businessImpact:
        'Explicit HSTS headers prevent protocol downgrade attacks when visitors open your site on public Wi-Fi networks.',
      technicalFix: hstsFix,
    });
  }

  if (t.timing.loadEventMs > 2500 || t.timing.totalRequests > 60) {
    const perfFix = isNextJs
      ? `// Detected Stack: ${stackLabel}\nimport Script from 'next/script';\n<Script src="https://example.com" strategy="lazyOnload" />`
      : `<!-- Detected Stack: ${stackLabel} (Fixable directly in HTML) -->\n<!-- Defer non-critical scripts so mobile rendering is not blocked -->\n<script src="/assets/analytics.js" defer></script>\n<img src="/assets/hero.webp" alt="Hero preview" loading="lazy" decoding="async" />`;

    issues.push({
      id: 'perf-load',
      category: 'PERFORMANCE',
      severity: 'CRITICAL',
      title: `Slow Mobile Load (${(t.timing.loadEventMs / 1000).toFixed(1)}s across ${t.timing.totalRequests} requests)`,
      businessImpact:
        'Mobile visitors abandon pages taking longer than 2.5 seconds to finish loading, directly reducing conversions.',
      technicalFix: perfFix,
    });
  }

  if (!t.domAndSeo.hasMetaDescription || !t.domAndSeo.hasOgImage) {
    const missingSeo = [
      !t.domAndSeo.hasMetaDescription ? '<meta name="description">' : null,
      !t.domAndSeo.hasOgImage ? '<meta property="og:image">' : null,
    ]
      .filter(Boolean)
      .join(' and ');

    const seoFix = isNextJs
      ? `// Detected Stack: ${stackLabel} (app/layout.tsx)\n// Exact Missing Tag(s): ${missingSeo}\nexport const metadata = {\n  description: 'Clear value proposition under 155 characters.',\n  openGraph: { images: ['/og-preview.png'] },\n};`
      : `<!-- Detected Stack: ${stackLabel} (Fixable directly inside HTML <head>) -->\n<!-- Exact Missing Tag(s): ${missingSeo} -->\n${!t.domAndSeo.hasMetaDescription ? '<meta name="description" content="Clear summary of your website under 155 characters." />\n' : ''}${!t.domAndSeo.hasOgImage ? `<meta property="og:image" content="${t.finalUrl.replace(/\/$/, '')}/og-preview.png" />` : ''}`;

    issues.push({
      id: 'seo-meta',
      category: 'SEO',
      severity: 'WARNING',
      title: `Missing ${missingSeo} Tag(s) [${stackLabel}]`,
      businessImpact: `HTML <head> is missing ${missingSeo}, reducing click-through rates when links are shared on LinkedIn, X, or Google Search.`,
      technicalFix: seoFix,
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
      technicalFix: `<!-- Detected Stack: ${stackLabel} (Fixable directly in HTML) -->\n<img src="${t.domAndSeo.missingAltImageUrls || '/hero.png'}" alt="Descriptive image summary" loading="lazy" />`,
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
