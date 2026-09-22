'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe, BarChart3 } from 'lucide-react';
import { HeroDualWidget } from './HeroDualWidget';

export const LandingHero: React.FC = () => {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Subtle Background Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Status Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-2xs">
          <span className="flex h-2 w-2 rounded-full bg-[#2a5bd7] animate-pulse" />
          <span>Trimly Connection Platform</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="text-slate-600 dark:text-slate-400">Short links, QR codes &amp; analytics</span>
        </div>

        {/* Hero Title */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#273144] dark:text-white leading-[1.15]">
            Make every link, QR code, <br className="hidden sm:inline" />
            and connection <span className="text-[#2a5bd7] dark:text-blue-400">count</span>.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Trimly is the all-in-one link management platform. Generate lightning-fast short links, dynamic designer QR codes, and monitor real-time clickstream telemetry in seconds.
          </p>
        </div>

        {/* Dual Hero Widget (Shorten URL + QR Code) */}
        <div className="pt-4 pb-2">
          <HeroDualWidget />
        </div>

        {/* Trust Badges / Social Proof Row */}
        <div className="pt-8 border-t border-slate-200/70 dark:border-slate-800/80 max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">
            Engineered for high performance and mission-critical scale
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#273144] dark:text-white tracking-tight">
                500K+
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Links shortened</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#273144] dark:text-white tracking-tight">
                &lt; 5ms
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                <Zap className="h-3.5 w-3.5 text-[#2a5bd7]" />
                <span>Redis cache latency</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#273144] dark:text-white tracking-tight">
                99.99%
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Uptime SLA</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#273144] dark:text-white tracking-tight">
                180+
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                <Globe className="h-3.5 w-3.5 text-blue-500" />
                <span>Countries reached</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
