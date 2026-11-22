'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center gap-2.5 text-lg font-bold tracking-tight text-white"
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span>WebXray</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          <Link href="/#features" className="transition hover:text-white">
            Features
          </Link>
          <Link href="/#pricing" className="transition hover:text-white">
            Pricing
          </Link>
          <Link href="/contact" className="transition hover:text-white">
            Contact
          </Link>
          <Link
            href="/#top"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-400"
          >
            Run Free X-Ray
          </Link>
        </nav>

        {/* Minimalist Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-200 transition hover:border-slate-700 md:hidden"
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Clean Minimalist Mobile Drawer */}
      <div
        className={`overflow-hidden border-b border-slate-800/90 bg-slate-950 transition-all duration-300 ease-in-out md:hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 border-transparent opacity-0'
        }`}
      >
        <nav className="flex flex-col divide-y divide-slate-800/60 px-5 py-2 text-sm font-medium text-slate-200">
          <Link href="/#features" onClick={() => setOpen(false)} className="py-3.5 hover:text-emerald-400">
            Features
          </Link>
          <Link href="/#pricing" onClick={() => setOpen(false)} className="py-3.5 hover:text-emerald-400">
            Pricing
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="py-3.5 hover:text-emerald-400">
            Contact &amp; Support
          </Link>
          <div className="flex items-center justify-between py-3.5 text-xs text-slate-400">
            <Link href="/terms" onClick={() => setOpen(false)} className="hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" onClick={() => setOpen(false)} className="hover:text-white">
              Privacy
            </Link>
            <Link href="/refund" onClick={() => setOpen(false)} className="hover:text-white">
              Refund Policy
            </Link>
          </div>
          <div className="pt-3 pb-4">
            <Link
              href="/#top"
              onClick={() => setOpen(false)}
              className="block w-full rounded-lg bg-emerald-500 py-2.5 text-center text-sm font-bold text-slate-950"
            >
              Run Free X-Ray
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
