import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const SITE_URL = 'https://webxray-virid.vercel.app/';

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'WebXray — 30-Second Mobile Website & Code Diagnostics',
    template: '%s | WebXray',
  },
  description:
    'Audit any website in 30 seconds inside an iPhone 14 viewport. Fix speed bottlenecks, security headers, mobile layout bugs, and SEO with copy-paste code.',
  keywords: [
    'website audit',
    'mobile performance test',
    'security headers checker',
    'Core Web Vitals',
    'SEO diagnostic tool',
    'WebXray',
  ],
  authors: [{ name: 'WebXray Engineering' }],
  creator: 'WebXray',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'WebXray',
    title: 'WebXray — 30s Mobile Website & Code Diagnostics',
    description:
      'Live iPhone 14 mobile browser diagnostics for speed, security headers, layout bugs, and SEO—with exact copy-paste code fixes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebXray — 30s Mobile Website & Code Diagnostics',
    description:
      'Scan any URL in a real mobile viewport. Get instant speed, security, and SEO diagnostics with production code fixes.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'WebXray',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://browserless.io" />
        <link rel="dns-prefetch" href="https://browserless.io" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-slate-950 pt-16 text-slate-50 antialiased">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
