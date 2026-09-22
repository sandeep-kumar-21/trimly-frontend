'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#050e24] text-slate-300 border-t border-white/10 select-none">
      {/* Pre-footer High-Impact CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="rounded-3xl bg-gradient-to-r from-[#0c56ec] via-[#0947c7] to-[#1e1b4b] p-8 sm:p-14 text-center text-white shadow-2xl space-y-6 relative overflow-hidden border border-white/15">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-white">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Get started in under 30 seconds</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to elevate your link &amp; QR connections?
            </h2>
            <p className="text-blue-100 text-base sm:text-lg font-normal">
              Join thousands of creators, growth marketers, and engineering teams using Trimly today.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-white hover:bg-slate-100 text-[#081638] font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get started free</span>
                <ArrowRight className="h-4 w-4 text-[#0c56ec]" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 transition-colors flex items-center justify-center cursor-pointer"
              >
                Log in to account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-2">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Brand & Status (Spans 2 cols on md/lg) */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/trimly-logo.svg"
                alt="Trimly"
                width={120}
                height={34}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The modern link management platform for lightning-fast short links, dynamic designer QR codes, and real-time clickstream telemetry.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-xs font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Products</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#hero-dual-widget" className="hover:text-white transition-colors">URL Shortener</a>
              </li>
              <li>
                <a href="#hero-dual-widget" className="hover:text-white transition-colors">Dynamic QR Studio</a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition-colors">Cross-Channel Analytics</a>
              </li>
              <li>
                <a href="#platform" className="hover:text-white transition-colors">UTM Campaign Builder</a>
              </li>
              <li>
                <a href="#platform" className="hover:text-white transition-colors">Password Protection</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#resources" className="hover:text-white transition-colors">FAQ &amp; Guides</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Developer API</Link>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Status Page</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal &amp; Trust</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">GDPR Compliance</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Security Standards</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-10 mt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Trimly Technologies, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted for high performance &amp; trust</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
