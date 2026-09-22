'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SparklesDecor } from '../shared/SparklesDecor';
import { DashboardMockup } from './DashboardMockup';

export const PlatformOverview: React.FC = () => {
  return (
    <section id="platform" className="relative bg-[#081638] py-20 sm:py-28 text-white overflow-hidden select-none">
      {/* Sparkles background decorations */}
      <SparklesDecor />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header (matching Bitly Image 5) */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f26522] tracking-tight">
            More than a link shortener
          </h2>
          <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
            Knowing how your clicks and scans are performing should be as easy as making them. Track, analyze, and optimize all your connections in one place.
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white hover:bg-white hover:text-[#081638] text-white font-bold text-sm transition-all duration-200 shadow-sm cursor-pointer"
            >
              <span>Get started for free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Interactive Dashboard Window & Floating Badges */}
        <DashboardMockup />
      </div>
    </section>
  );
};
