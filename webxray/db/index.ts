import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import * as schema from './schema';

const isLocalDev = process.env.NODE_ENV === 'development';
const LOCAL_DB_FILE = path.join(process.cwd(), '.local-audits.json');

const client = neon(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });

type AuditRow = typeof schema.audits.$inferSelect;

async function readLocalAudits(): Promise<AuditRow[]> {
  try {
    const raw = await fs.readFile(LOCAL_DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLocalAudits(rows: AuditRow[]) {
  await fs.writeFile(LOCAL_DB_FILE, JSON.stringify(rows, null, 2), 'utf-8');
}

export async function createAuditRecord(targetUrl: string) {
  if (isLocalDev) {
    const rows = await readLocalAudits();
    const id = crypto.randomUUID();
    rows.push({
      id,
      userId: null,
      targetUrl,
      status: 'PENDING',
      errorMessage: null,
      overallScore: null,
      performanceScore: null,
      securityScore: null,
      seoScore: null,
      screenshotUrl: null,
      issues: null,
      isUnlocked: false,
      paymentId: null,
      leadEmail: null,
      createdAt: new Date(),
    });
    await writeLocalAudits(rows);
    return { id };
  }

  const [created] = await db
    .insert(schema.audits)
    .values({ targetUrl, status: 'PENDING' })
    .returning({ id: schema.audits.id });
  return created;
}

export async function getAuditRecord(id: string) {
  if (isLocalDev) {
    const rows = await readLocalAudits();
    return rows.find((r) => r.id === id);
  }

  const [audit] = await db
    .select()
    .from(schema.audits)
    .where(sql`${schema.audits.id} = ${id}` as never);
  return audit;
}

export async function updateAuditRecord(
  id: string,
  data: Partial<typeof schema.audits.$inferInsert>,
) {
  if (isLocalDev) {
    const rows = await readLocalAudits();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx !== -1) {
      rows[idx] = { ...rows[idx], ...data };
      await writeLocalAudits(rows);
    }
    return;
  }

  await db
    .update(schema.audits)
    .set(data)
    .where(sql`${schema.audits.id} = ${id}` as never);
}
