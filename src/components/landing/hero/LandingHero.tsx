'use client';

import React from 'react';
import { SparklesDecor } from '../shared/SparklesDecor';
import { HeroDualWidget } from './HeroDualWidget';
import { HeroFreePlanChips } from './HeroFreePlanChips';

export interface LandingHeroProps {
  activeHeroTab?: 'link' | 'qr';
}

export const LandingHero: React.FC<LandingHeroProps> = ({ activeHeroTab = 'link' }) => {
  return (
    <section className="relative bg-[#081638] pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden text-white">
      {/* Background Sparkles & Constellations */}
      <SparklesDecor />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Understand what clicks with your audience
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-200 font-normal max-w-3xl mx-auto leading-relaxed">
            Trimly makes it easy to create, share, and track short links and QR Codes. Find what&apos;s resonating and scale it into bigger reach, more clicks, and more conversions.
          </p>
        </div>

        {/* Dual Tab Hero Widget */}
        <HeroDualWidget initialTab={activeHeroTab} />

        {/* Free Plan Features Row */}
        <HeroFreePlanChips />
      </div>
    </section>
  );
};
