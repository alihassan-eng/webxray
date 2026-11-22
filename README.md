# WebXray — 30-Second Mobile Website & Code Diagnostics

**Live Production App:** [https://webxray-virid.vercel.app/](https://webxray-virid.vercel.app/)

WebXray is a full-stack B2B SaaS diagnostic engine that inspects any live website inside a real **iPhone 14 mobile viewport (`390×844`)** in under 30 seconds. It identifies mobile layout bugs, server TTFB bottlenecks, missing security headers, and SEO gaps—delivering both copy-paste production code fixes (`$29`) and done-for-you engineering remediation (`$499+`).

---

## Key Features

- **Real Mobile Viewport Telemetry:** Uses headless Chromium (`Playwright`) emulated as an iPhone 14 to capture live mobile screenshots, horizontal overflow bugs, console/runtime errors, and asset sizes.
- **Dual-Layer AI & Deterministic Analysis:** Combines **Google Gemini AI** with a calibrated deterministic telemetry fallback engine to ensure 99.9% report reliability even on bot-protected sites.
- **Security & SEO Hardening Audits:** Verifies `Strict-Transport-Security (HSTS)`, `Content-Security-Policy (CSP)`, `X-Frame-Options`, OpenGraph cards, and meta tags.
- **Dual Monetization & Instant Alerts:**
  - **Self-Serve Unlock (`$29`):** Integrated with **Paddle** webhooks for automated report unlocking.
  - **Done-For-You Engineering (`$499+`):** Captures qualified B2B leads in PostgreSQL and triggers instant email notifications via **Resend**.

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **Backend & Database:** Next.js Server Actions & Route Handlers, PostgreSQL (Neon), Drizzle ORM
- **Browser Automation & AI:** Playwright Core, Vercel AI SDK (`@ai-sdk/google` — Gemini 2.5 Flash)
- **Payments & Notifications:** Paddle (Merchant of Record), Resend Email API
- **Deployment & Security:** Vercel CI/CD, strict CSP/HSTS headers (`100/100` Security & SEO score)

---

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd webxray
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables (`.env`):**
   ```env
   DATABASE_URL="your_neon_postgres_url"
   BROWSERLESS_URL="wss://production-sfo.browserless.io?token=your_token"
   GOOGLE_GENERATIVE_AI_API_KEY="your_gemini_api_key"
   RESEND_API_KEY="your_resend_api_key"
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

---

## Author

**Ali Hassan** — Full-Stack Product Engineer  
- **Live Product:** [https://webxray-virid.vercel.app/](https://webxray-virid.vercel.app/)
- **LinkedIn:** [https://www.linkedin.com/in/alihassan-eng/](https://www.linkedin.com/in/alihassan-eng/)
- **X (Twitter):** [@alihassan_eng](https://x.com/alihassan_eng) | [@WebXrayApp](https://x.com/WebXrayApp)
