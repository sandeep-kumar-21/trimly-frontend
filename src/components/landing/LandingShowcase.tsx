'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Link2, 
  QrCode, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Tags, 
  Download, 
  Layers,
  Globe2,
  TrendingUp,
  Activity
} from 'lucide-react';

export const LandingShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'links' | 'qr' | 'analytics'>('links');

  return (
    <section id="products" className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-950/60 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2a5bd7] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900">
            The Complete Connection Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#273144] dark:text-white tracking-tight">
            Everything you need to connect audiences to your content
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Whether you&apos;re sharing a viral social post, printing product packaging, or launching a multi-channel campaign, Trimly puts you in control.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('links')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'links'
                  ? 'bg-[#2a5bd7] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Link2 className="h-4 w-4" />
              <span>URL Shortener</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-[#2a5bd7] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <QrCode className="h-4 w-4" />
              <span>QR Code Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#2a5bd7] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics &amp; Telemetry</span>
            </button>
          </div>
        </div>

        {/* Tab 1: URL Shortener Content */}
        {activeTab === 'links' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-300">
            {/* Left Description */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100/60 dark:bg-blue-900/30 text-[#2a5bd7] dark:text-blue-400 text-xs font-bold">
                <Link2 className="h-3.5 w-3.5" />
                <span>Short Links That Inspire Trust</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#273144] dark:text-white tracking-tight">
                Memorable, branded links with total access control
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Replace unreadable, bulky URLs with sleek branded links. Custom back-halves increase click-through rates by up to 34%, while enterprise security features ensure complete link safety.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-[#273144] dark:text-white">Custom Back-Halves: </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Claim customized slugs like <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold">trimly.link/summer-launch</code> for maximum brand recognition.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-[#273144] dark:text-white">Password &amp; Expiration Guard: </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Secure sensitive links with bcrypt-hashed passwords and configure automated auto-expiry dates.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-[#273144] dark:text-white">Full Tagging &amp; Search: </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Organize high-volume link fleets with multi-tag taxonomies and instant keyboard search (<kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">⌘K</kbd>).</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#2a5bd7] hover:bg-[#1a4bb7] text-white text-sm font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Start shortening links</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Mockup */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-4">
                {/* Mock Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-mono text-slate-400">trimly-dashboard / links</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active • 1,420 clicks
                  </span>
                </div>

                {/* Mock Link Card */}
                <div className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-[#273144] dark:text-white flex items-center gap-2">
                        <span>Summer Product Launch 2026</span>
                        <span className="text-xs font-normal text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> 2h ago
                        </span>
                      </h4>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-bold text-[#2a5bd7] dark:text-blue-400 hover:underline">
                          trimly.link/summer-launch
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/50 text-[#2a5bd7] dark:text-blue-300 font-semibold">
                          Custom Alias
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-2xs">
                        Copy
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 truncate font-mono">
                    https://shop.company.com/collections/summer-apparel?utm_source=twitter&amp;utm_campaign=launch
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      <Tags className="h-3 w-3" /> marketing
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      <Tags className="h-3 w-3" /> campaign-q3
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="h-3 w-3" /> Password Protected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: QR Code Studio Content */}
        {activeTab === 'qr' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-300">
            {/* Left Description */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-100/60 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                <QrCode className="h-3.5 w-3.5" />
                <span>Dynamic QR Code Studio</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#273144] dark:text-white tracking-tight">
                Design custom QR codes that bridge physical to digital
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Never reprint marketing collateral again. Trimly dynamic QR codes allow you to edit destination targets on the fly without breaking printed codes on packaging, flyers, or conference booths.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-[#273144] dark:text-white">Dynamic Redirect Targets: </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Update destination URLs anytime, anywhere — your printed QR codes adapt immediately.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-[#273144] dark:text-white">Custom Brand Aesthetics: </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Select custom foreground and background colors, dot geometries (rounded, dots, classy), and embed custom company logos.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-[#273144] dark:text-white">Vector &amp; Raster Export: </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Download high-resolution PNG for digital assets or crisp SVG for professional large-format print shops.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#2a5bd7] hover:bg-[#1a4bb7] text-white text-sm font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Design custom QR codes</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Mockup */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customization Controls</span>
                    
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dot Shape</span>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="px-2.5 py-1.5 rounded-md border border-[#2a5bd7] bg-blue-50 dark:bg-blue-950 text-[#2a5bd7] text-xs font-bold text-center">
                          Rounded
                        </span>
                        <span className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-medium text-center text-slate-600 dark:text-slate-400">
                          Dots
                        </span>
                        <span className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-medium text-center text-slate-600 dark:text-slate-400">
                          Classy
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Frame Template</span>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#273144] dark:text-slate-200">
                          Scan Me Badge
                        </span>
                        <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-[#273144] dark:text-slate-200">
                          Minimalist
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 text-white text-xs font-bold">
                        <Download className="h-3 w-3" /> Export PNG
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                        Export SVG
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-md">
                      {/* Stylized QR mockup */}
                      <div className="w-36 h-36 bg-[#2a5bd7] rounded-lg p-2.5 flex items-center justify-center relative overflow-hidden">
                        <div className="w-full h-full bg-white rounded flex items-center justify-center relative">
                          <QrCode className="w-24 h-24 text-[#2a5bd7]" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-7 w-7 rounded-md bg-white shadow-xs border border-slate-200 flex items-center justify-center">
                              <Sparkles className="h-4 w-4 text-[#2a5bd7]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="mt-3 text-xs font-bold text-[#273144] dark:text-slate-200">
                      Dynamic QR • Live Tracking
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Analytics & Telemetry Content */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-in fade-in duration-300">
            {/* Left Description */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100/60 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                <Activity className="h-3.5 w-3.5" />
                <span>Real-Time SSE Click Telemetry</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#273144] dark:text-white tracking-tight">
                Inspect every interaction as it happens
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Know where your audience comes from, which channels deliver peak conversions, and see live clicks stream directly onto your dashboard via Server-Sent Events (SSE).
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-[#273144] dark:text-white">Live Clickstream: </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Stream interactions live with low latency — no waiting hours for batch jobs to finish.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-[#273144] dark:text-white">Geographic &amp; Device Breakdown: </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Understand your reach across 180+ countries, top cities, operating systems, and mobile vs. desktop devices.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm text-[#273144] dark:text-white">UTM Campaign Intelligence: </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Aggregate performance across Source, Medium, Campaign, and Content to optimize your ad spend.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#2a5bd7] hover:bg-[#1a4bb7] text-white text-sm font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Explore live analytics</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Mockup */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      SSE Live Stream Active
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#273144] dark:text-slate-300">
                    Total Clicks: 28,491
                  </span>
                </div>

                {/* Simulated Click Chart Bar Graphic */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>Hourly Traffic Volume</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" /> +42.8% vs yesterday
                    </span>
                  </div>

                  {/* Sparkline / Bar simulation */}
                  <div className="h-24 flex items-end gap-1.5 pt-2">
                    {[35, 45, 28, 60, 80, 52, 90, 75, 110, 95, 130, 145, 120, 160, 140, 190].map((val, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-[#2a5bd7] to-blue-400 rounded-t-sm hover:opacity-80 transition-all cursor-pointer"
                        style={{ height: `${(val / 200) * 100}%` }}
                        title={`${val} clicks`}
                      />
                    ))}
                  </div>
                </div>

                {/* Top Geos & Referrers Mini Row */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Globe2 className="h-3 w-3" /> Top Countries
                    </span>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span>🇺🇸 United States</span>
                        <span className="font-bold text-[#273144] dark:text-white">48%</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>🇬🇧 United Kingdom</span>
                        <span className="font-bold text-[#273144] dark:text-white">22%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="h-3 w-3" /> Top Channels
                    </span>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span>Twitter / X</span>
                        <span className="font-bold text-[#273144] dark:text-white">54%</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Direct / Email</span>
                        <span className="font-bold text-[#273144] dark:text-white">31%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
