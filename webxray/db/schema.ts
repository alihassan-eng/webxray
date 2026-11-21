import { pgTable, uuid, text, integer, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';

export type AuditIssue = {
  id: string;
  category: 'PERFORMANCE' | 'SECURITY' | 'SEO' | 'UI_UX';
  severity: 'CRITICAL' | 'WARNING';
  title: string;
  businessImpact: string;
  technicalFix: string | null;
};

export const audits = pgTable('audits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'),
  targetUrl: text('target_url').notNull(),
  status: text('status').notNull().default('PENDING'),
  errorMessage: text('error_message'),

  overallScore: integer('overall_score'),
  performanceScore: integer('performance_score'),
  securityScore: integer('security_score'),
  seoScore: integer('seo_score'),

  screenshotUrl: text('screenshot_url'),
  issues: jsonb('issues').$type<AuditIssue[]>(),

  isUnlocked: boolean('is_unlocked').default(false).notNull(),
  paymentId: text('payment_id'),
  leadEmail: text('lead_email'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
