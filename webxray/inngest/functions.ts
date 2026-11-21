import { inngest } from './client';
import { updateAuditRecord } from '@/db';
import { runXrayScan } from '@/lib/xray-engine';
import { analyzeTelemetryWithAI } from '@/lib/ai-analyzer';

export const runAuditJob = inngest.createFunction(
  {
    id: 'run-webxray-audit',
    retries: 1,
    triggers: [{ event: 'audit/started' }],
  },
  async ({ event, step }) => {
    const { auditId, targetUrl } = event.data as {
      auditId: string;
      targetUrl: string;
    };

    try {
      await step.run('mark-processing', async () => {
        await updateAuditRecord(auditId, { status: 'PROCESSING' });
      });

      const telemetry = await step.run('run-playwright-xray', async () => {
        return await runXrayScan(targetUrl);
      });

      const report = await step.run('run-ai-synthesis', async () => {
        return await analyzeTelemetryWithAI(telemetry);
      });

      await step.run('save-completed-audit', async () => {
        await updateAuditRecord(auditId, {
          status: 'COMPLETED',
          overallScore: report.overallScore,
          performanceScore: report.performanceScore,
          securityScore: report.securityScore,
          seoScore: report.seoScore,
          screenshotUrl: telemetry.screenshotBase64,
          issues: report.issues,
        });
      });

      return { auditId, status: 'COMPLETED' };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to scan website.';
      await updateAuditRecord(auditId, {
        status: 'FAILED',
        errorMessage: message,
      });
      throw error;
    }
  }
);
