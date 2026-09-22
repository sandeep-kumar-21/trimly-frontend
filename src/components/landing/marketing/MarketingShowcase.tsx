'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LinkCardMockup } from './LinkCardMockup';
import { QrCardMockup } from './QrCardMockup';
import { AnalyticsCardMockup } from './AnalyticsCardMockup';

export const MarketingShowcase: React.FC = () => {
  return (
    <section id="solutions" className="py-20 sm:py-28 bg-[#fcfbf9] border-t border-slate-200/70 text-slate-900 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header (matching Bitly Image 3) */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#9c8266]">
            See what works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#081638] tracking-tight">
            Link your marketing with Trimly
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Create branded links and QR Codes in seconds, track every click and scan, and get clear cross-channel analytics so you can see what&apos;s driving results.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[#0c56ec] hover:bg-[#0947c7] text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
            >
              <span>Get started for free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md border-2 border-[#0c56ec] text-[#0c56ec] hover:bg-blue-50/60 font-bold text-sm transition-colors cursor-pointer"
            >
              <span>Get a quote</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 3 Prominent Floating Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch pt-4">
          <LinkCardMockup />
          <QrCardMockup />
          <AnalyticsCardMockup />
        </div>
      </div>
    </section>
  );
};
