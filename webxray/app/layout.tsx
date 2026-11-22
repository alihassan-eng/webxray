import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const SITE_URL = 'https://webxray-virid.vercel.app/';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'WebXray — 30-Second Mobile Website & Code Diagnostics',
    template: '%s | WebXray',
  },
  description:
    'Audit any website in 30 seconds inside a real iPhone 14 mobile viewport. Detect speed bottlenecks, security header gaps, mobile layout bugs, and SEO issues with copy-paste code fixes.',
  keywords: [
    'website audit',
    'mobile performance test',
    'security headers checker',
    'Core Web Vitals',
    'SEO diagnostic tool',
    'Next.js optimization',
    'WebXray',
  ],
  authors: [{ name: 'WebXray Engineering' }],
  creator: 'WebXray',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'WebXray',
    title: 'WebXray — Find Out Why Visitors Are Leaving Your Website in 30s',
    description:
      'Live iPhone 14 mobile browser diagnostics for speed, security headers, layout bugs, and SEO—with exact copy-paste code fixes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebXray — 30-Second Mobile Website & Code Diagnostics',
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
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-950 pt-16 text-slate-50 antialiased">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
