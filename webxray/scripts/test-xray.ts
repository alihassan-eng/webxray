// scripts/test-xray.ts
import 'dotenv/config';
import { runXrayScan } from '../lib/xray-engine';
import { analyzeTelemetryWithAI } from '../lib/ai-analyzer';

async function main() {
  const url = process.argv[2] || 'https://vercel.app';
  console.log(`🔍 Step 1: Scanning ${url} in iPhone 14 viewport...`);
  const telemetry = await runXrayScan(url);

  console.log(`🧠 Step 2: Generating AI Business & Code Audit...`);
  const report = await analyzeTelemetryWithAI(telemetry);

  console.log('\n✅ FINAL WEBXRAY REPORT:\n');
  console.log(JSON.stringify(report, null, 2));
}

main().catch(console.error);
