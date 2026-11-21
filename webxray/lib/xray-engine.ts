// lib/xray-engine.ts
import { chromium } from 'playwright-core';


export interface XrayTelemetry {
  targetUrl: string;
  finalUrl: string;
  httpStatus: number;
  detectedStack: string[];
  timing: {
    ttfbMs: number;
    domContentLoadedMs: number;
    loadEventMs: number;
    totalRequests: number;
  };
  securityHeaders: {
    strictTransportSecurity: boolean;
    contentSecurityPolicy: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
  };
  runtimeErrors: {
    pageErrors: string[];
    consoleErrors: string[];
    failedNetworkRequests: Array<{
      url: string;
      status: number;
      isFirstParty: boolean;
    }>;
  };
  domAndSeo: {
    title: string;
    hasMetaDescription: boolean;
    metaDescriptionLength: number;
    h1Count: number;
    hasOgImage: boolean;
    hasFavicon: boolean;
    totalImages: number;
    imagesMissingAlt: number;
    missingAltImageUrls: string[];
    largeImages: Array<{ src: string; sizeKb: number }>;
    hasHorizontalOverflow: boolean;
    scrollWidth: number;
    viewportWidth: number;
  };
  screenshotBase64: string;
}

export async function runXrayScan(rawUrl: string): Promise<XrayTelemetry> {
  const targetUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  const targetHost = new URL(targetUrl).hostname.replace(/^www\./, '');

  const cleanEnv = { ...process.env };
  delete cleanEnv.LD_PRELOAD;
  delete cleanEnv.LD_LIBRARY_PATH;
  delete cleanEnv.NODE_OPTIONS;

    const rawBrowserless = process.env.BROWSERLESS_URL?.trim();
  const browserlessEndpoint = rawBrowserless
    ? rawBrowserless.startsWith('ws')
      ? rawBrowserless
      : `wss://production-sfo.browserless.io?token=${rawBrowserless}`
    : undefined;

  const browser = browserlessEndpoint
    ? await chromium.connectOverCDP(browserlessEndpoint)
    : await chromium.launch({
        headless: true,
        env: cleanEnv,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    });

    const page = await context.newPage();

    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    const failedNetworkRequests: Array<{
      url: string;
      status: number;
      isFirstParty: boolean;
    }> = [];
    const largeImages: Array<{ src: string; sizeKb: number }> = [];
    let totalRequests = 0;

    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('request', () => {
      totalRequests++;
    });

    page.on('response', async (response) => {
      try {
        const status = response.status();
        if (status >= 400 && failedNetworkRequests.length < 15) {
          let isFirstParty = false;
          try {
            const reqHost = new URL(response.url()).hostname.replace(/^www\./, '');
            isFirstParty =
              reqHost === targetHost || reqHost.endsWith(`.${targetHost}`);
          } catch {
            isFirstParty = false;
          }

          failedNetworkRequests.push({
            url: response.url().slice(0, 120),
            status,
            isFirstParty,
          });
        }
        if (response.request().resourceType() === 'image') {
          const contentLength = Number(response.headers()['content-length'] || 0);
          if (contentLength > 500 * 1024) {
            largeImages.push({
              src: response.url().slice(0, 120),
              sizeKb: Math.round(contentLength / 1024),
            });
          }
        }
      } catch {
        // Ignore opaque responses
      }
    });

    const mainResponse = await page.goto(targetUrl, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    await page.waitForTimeout(1500);

    const headers = mainResponse ? mainResponse.headers() : {};
    const securityHeaders = {
      strictTransportSecurity: Boolean(headers['strict-transport-security']),
      contentSecurityPolicy: Boolean(headers['content-security-policy']),
      xFrameOptions: Boolean(headers['x-frame-options']),
      xContentTypeOptions: Boolean(headers['x-content-type-options']),
    };

    const timing = await page.evaluate(() => {
      const entries = performance.getEntriesByType('navigation');
            const nav =
        entries.length > 0 ? (entries[0] as PerformanceNavigationTiming) : undefined;
     
      if (!nav) {
        return { ttfbMs: 0, domContentLoadedMs: 0, loadEventMs: 0 };
      }
      return {
        ttfbMs: Math.round(nav.responseStart - nav.requestStart),
        domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        loadEventMs: Math.round(nav.loadEventEnd - nav.startTime),
      };
    });

    const { detectedStack, ...domAndSeo } = await page.evaluate(() => {
      const html = document.documentElement.innerHTML;
      const stack: string[] = [];
      if (document.getElementById('__NEXT_DATA__') || html.includes('/_next/')) stack.push('Next.js');
      if (html.includes('wp-content') || html.includes('wp-includes')) stack.push('WordPress');
      if (html.includes('shopify')) stack.push('Shopify');
      if (html.includes('webflow')) stack.push('Webflow');
      if (stack.length === 0) stack.push('Custom HTML / React');

      const title = document.title || '';
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const h1Count = document.querySelectorAll('h1').length;
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
      const favicon = document.querySelector('link[rel*="icon"]')?.getAttribute('href');

      const imgs = Array.from(document.querySelectorAll('img'));
      const missingAltImgs = imgs.filter((img) => !img.hasAttribute('alt') || img.alt.trim() === '');
      const missingAltImageUrls = missingAltImgs
        .map((img) => img.getAttribute('src') || img.currentSrc || '')
        .filter(Boolean)
        .slice(0, 5)
        .map((src) => src.slice(0, 120));

      const scrollWidth = document.documentElement.scrollWidth;
      const viewportWidth = window.innerWidth;

      return {
        detectedStack: stack,
        title,
        hasMetaDescription: metaDesc.trim().length > 0,
        metaDescriptionLength: metaDesc.trim().length,
        h1Count,
        hasOgImage: Boolean(ogImage && ogImage.trim().length > 0),
        hasFavicon: Boolean(favicon && favicon.trim().length > 0),
        totalImages: imgs.length,
        imagesMissingAlt: missingAltImgs.length,
        missingAltImageUrls,
        hasHorizontalOverflow: scrollWidth > viewportWidth + 1,
        scrollWidth,
        viewportWidth,
      };
    });

    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 75,
      fullPage: false,
    });

    return {
      targetUrl,
      finalUrl: page.url(),
      httpStatus: mainResponse ? mainResponse.status() : 0,
      detectedStack,
      timing: {
        ...timing,
        totalRequests,
      },
      securityHeaders,
      runtimeErrors: {
        pageErrors: pageErrors.slice(0, 10),
        consoleErrors: consoleErrors.slice(0, 10),
        failedNetworkRequests,
      },
      domAndSeo: {
        ...domAndSeo,
        largeImages,
      },
      screenshotBase64: `data:image/jpeg;base64,${screenshotBuffer.toString('base64')}`,
    };
  } finally {
    await browser.close();
  }
}
