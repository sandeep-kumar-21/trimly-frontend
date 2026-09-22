'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export const LandingPricing: React.FC = () => {
  const [annualBilling, setAnnualBilling] = useState(true);

  return (
    <section id="pricing" className="py-20 md:py-28 bg-slate-50/70 dark:bg-slate-950/60 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2a5bd7] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900">
            Simple, Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#273144] dark:text-white tracking-tight">
            Plans built to scale with your audience
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Start completely free. Upgrade whenever you need advanced branding, vector exports, or team collaboration.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm font-semibold ${!annualBilling ? 'text-[#273144] dark:text-white' : 'text-slate-500'}`}>
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setAnnualBilling(!annualBilling)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-[#2a5bd7] focus:outline-none"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  annualBilling ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1.5 ${annualBilling ? 'text-[#273144] dark:text-white' : 'text-slate-500'}`}>
              <span>Annual</span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                Save 25%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1: Free Starter */}
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#273144] dark:text-white">Starter</h3>
                <p className="text-xs text-slate-500 mt-1">Perfect for individuals and lightweight projects</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#273144] dark:text-white">$0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>100 Short links per month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>10 Dynamic QR codes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Custom back-half slugs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>30-Day analytics retention</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Standard PNG QR export</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-2.5 text-center text-sm font-bold text-[#273144] dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Get started free
            </Link>
          </div>

          {/* Card 2: Growth / Pro (Highlighted) */}
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#2a5bd7] dark:border-blue-500 shadow-xl shadow-blue-500/10 flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#2a5bd7] text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="h-3 w-3" />
              <span>Most Popular</span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#273144] dark:text-white">Growth Pro</h3>
                <p className="text-xs text-slate-500 mt-1">For growing businesses, agencies &amp; creators</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#273144] dark:text-white">
                  ${annualBilling ? '9' : '12'}
                </span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#2a5bd7] shrink-0" />
                  <span className="font-semibold text-[#273144] dark:text-white">Unlimited short links &amp; QR codes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#2a5bd7] shrink-0" />
                  <span>Custom brand logo embedding in QR</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#2a5bd7] shrink-0" />
                  <span>High-res SVG &amp; vector export</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#2a5bd7] shrink-0" />
                  <span>Password protection &amp; auto-expiry</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#2a5bd7] shrink-0" />
                  <span>Server-Sent Events (SSE) live telemetry</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#2a5bd7] shrink-0" />
                  <span>UTM Campaign attribution tracking</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-[#2a5bd7] hover:bg-[#1a4bb7] rounded-md shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Start 14-day free trial</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Card 3: Enterprise */}
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#273144] dark:text-white">Enterprise</h3>
                <p className="text-xs text-slate-500 mt-1">For organizations requiring high throughput &amp; custom SLAs</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#273144] dark:text-white">
                  ${annualBilling ? '39' : '49'}
                </span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Everything in Growth Pro</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Custom branded root domains</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>99.99% Uptime SLA commitment</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Dedicated Redis cluster caching</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Priority 24/7 engineering support</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-2.5 text-center text-sm font-bold text-[#273144] dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
