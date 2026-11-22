import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/site-config';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs sm:flex-row sm:px-6">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="font-bold text-slate-200">WebXray Diagnostics</span>
          <span>
            Support:{' '}
            <a
              href={`mailto:${SITE_CONFIG.supportEmail}`}
              className="text-emerald-400 underline hover:text-emerald-300"
            >
              {SITE_CONFIG.supportEmail}
            </a>
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-5 font-medium">
          <Link href="/terms" className="hover:text-white">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/refund" className="hover:text-white">
            Refund Policy
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
        </nav>

        <p className="text-slate-500">© 2026 WebXray. All rights reserved.</p>
      </div>
    </footer>
  );
}
