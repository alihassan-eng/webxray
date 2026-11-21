// lib/ai-analyzer.ts
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
    .min(3)
    .max(12),
});

export type AiAuditReport = z.infer<typeof AuditReportSchema>;

const FALLBACK_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
] as const;

export async function analyzeTelemetryWithAI(
  telemetry: XrayTelemetry
): Promise<AiAuditReport> {
  const { screenshotBase64: _ignored, ...cleanTelemetry } = telemetry;

  const prompt = `You are a Principal Frontend & Web Performance Architect auditing a live business website.
Analyze the following mobile telemetry data collected from an iPhone 14 viewport (390x844) and generate an honest, high-value diagnostic report:

${JSON.stringify(cleanTelemetry, null, 2)}

Rules:
1. Calculate realistic, well-calibrated scores (0-100) grounded in the telemetry above:
   - Security: Start at 100 if HTTPS is active. Deduct 10 pts if HSTS is missing, and 5-8 pts each for missing CSP, X-Frame-Options, or X-Content-Type-Options (do NOT drop below 70 on an HTTPS site unless active mixed-content or severe vulnerabilities exist).
   - Performance: Start at 100. Deduct points proportionally only if TTFB > 600ms, loadEventMs > 3500ms, totalRequests > 90, or largeImages (>500KB) exist.
   - SEO & UI: Deduct 10-15 pts for missing meta description, missing og:image, missing H1, horizontal mobile overflow, or images missing alt text.
2. Identify every real issue found. If a site is clean, include high-value frontend optimization opportunities so 4-8 concrete items are returned.
3. Write "businessImpact" in plain, persuasive business English explaining how this issue costs the owner customers, trust, or Google rankings.
4. Write "technicalFix" as clean, copy-pasteable production code tailored to detectedStack.
5. Always reference the real URLs from missingAltImageUrls, largeImages, or failedNetworkRequests—never use placeholder names like example.jpg.`;

  let lastError: unknown;

  for (const modelId of FALLBACK_MODELS) {
    try {
      const { output } = await generateText({
        model: google(modelId),
        maxRetries: 1,
        output: Output.object({
          schema: AuditReportSchema,
        }),
        prompt,
      });
      return output;
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ ${modelId} busy or unavailable, switching to next model...`);
    }
  }

  throw lastError;
}
