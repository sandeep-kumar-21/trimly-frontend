'use client';

import React from 'react';
import { 
  Zap, 
  Activity, 
  Target, 
  ShieldCheck, 
  Command, 
  Lock, 
  Cpu, 
  Workflow, 
  Sparkles 
} from 'lucide-react';

export const LandingFeaturesBento: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2a5bd7] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900">
            Engineered for Reliability
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#273144] dark:text-white tracking-tight">
            Built from the ground up for modern engineering &amp; marketing teams
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            No bloat, no artificial limits, and no flaky redirects. Every microservice and interface is crafted for speed, developer ergonomics, and rock-solid uptime.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Redis Performance (Spans 2 cols on md/lg) */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="space-y-4 relative z-10">
              <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-[#2a5bd7] dark:text-blue-400 group-hover:scale-105 transition-transform">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#273144] dark:text-white">
                Sub-5ms Cache-Aside Architecture
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Short link redirects are served directly from an in-memory Redis cluster. Uncached links gracefully fall back to MongoDB and auto-populate cache with automatic invalidation upon updates.
              </p>

              {/* Code snippet illustration */}
              <div className="pt-2">
                <div className="p-3 rounded-lg bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500 pb-1 border-b border-slate-800 text-[11px]">
                    <span>redis-telemetry.log</span>
                  </div>
                  <div className="pt-2 text-emerald-400">GET /summer-launch → 302 Redirect (3.4ms)</div>
                  <div className="text-slate-500">Cache HIT (Redis key: &quot;url:summer-launch&quot;)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: SSE Live Click Telemetry */}
          <div className="md:col-span-1 lg:col-span-2 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#273144] dark:text-white">
                Server-Sent Events (SSE) Live Feed
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Monitor marketing spikes in real-time. Trimly streams each click with origin city, browser, and OS without burning CPU on aggressive polling loops.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Zero polling • Native HTTP streaming
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: UTM Campaign Builder */}
          <div className="md:col-span-1 lg:col-span-2 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#273144] dark:text-white">
                UTM Attribution Builder
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Attach source, medium, campaign, term, and content parameters with 1-click presets for Google Ads, Facebook, Twitter/X, and newsletters.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300">
                  utm_source=twitter
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300">
                  utm_campaign=q3_launch
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: Enterprise Security & Password Protection */}
          <div className="md:col-span-1 lg:col-span-1 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-amber-50 dark:bg-amber-950/80 border border-amber-100 dark:border-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#273144] dark:text-white">
                Bcrypt Password &amp; Expiry
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Password-lock confidential pitch decks or set links to automatically deactivate at midnight.
              </p>
            </div>
          </div>

          {/* Card 5: Keyboard-First Command Palette */}
          <div className="md:col-span-1 lg:col-span-1 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-100 dark:border-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                <Command className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#273144] dark:text-white">
                Command Palette (⌘K)
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Supercharge your workflow. Search links, create QR codes, or jump anywhere in Trimly in keystrokes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
