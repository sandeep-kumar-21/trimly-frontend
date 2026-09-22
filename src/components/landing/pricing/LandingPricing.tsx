'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export const LandingPricing: React.FC = () => {
  const [annualBilling, setAnnualBilling] = useState(true);

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-[#fcfbf9] border-t border-slate-200/70 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#9c8266]">
            Pricing for every stage
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#081638] tracking-tight">
            Plans that scale with your connections
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Start completely free. Upgrade anytime to unlock custom domains, advanced QR frames, and bulk generation.
          </p>

          {/* Billing Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className={`text-sm font-bold ${!annualBilling ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly billing
            </span>
            <button
              type="button"
              onClick={() => setAnnualBilling(!annualBilling)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-[#0c56ec] focus:outline-none"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  annualBilling ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-bold flex items-center gap-1.5 ${annualBilling ? 'text-slate-900' : 'text-slate-500'}`}>
              <span>Annual billing</span>
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Save 25%
              </span>
            </span>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Card 1: Free Starter */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-[#081638]">Free Starter</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">For individuals and light projects</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#081638]">$0</span>
                <span className="text-xs text-slate-500 font-semibold">/ month</span>
              </div>

              <hr className="border-slate-100" />

              <ul className="space-y-3 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>100 Short links / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>10 Dynamic QR codes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>Custom back-half URLs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>30-Day analytics retention</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>Standard PNG QR code export</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3 text-center text-sm font-bold text-[#081638] rounded-md border-2 border-slate-300 hover:border-slate-900 transition-colors"
            >
              Get started free
            </Link>
          </div>

          {/* Card 2: Growth Pro (Highlighted with Blue/Orange accents) */}
          <div className="p-8 rounded-3xl bg-white border-2 border-[#0c56ec] shadow-xl flex flex-col justify-between space-y-6 relative hover:shadow-2xl transition-shadow">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#f26522] text-white text-[11px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Recommended</span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-[#081638]">Growth Pro</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">For growing brands, creators &amp; marketing teams</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#081638]">
                  ${annualBilling ? '9' : '12'}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ month</span>
              </div>

              <hr className="border-slate-100" />

              <ul className="space-y-3 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#0c56ec] shrink-0 stroke-[3]" />
                  <span className="font-bold text-[#081638]">Unlimited short links &amp; QR codes</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#0c56ec] shrink-0 stroke-[3]" />
                  <span>Custom logo embedding in QR</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#0c56ec] shrink-0 stroke-[3]" />
                  <span>High-resolution SVG vector export</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#0c56ec] shrink-0 stroke-[3]" />
                  <span>Password protection &amp; expiration dates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#0c56ec] shrink-0 stroke-[3]" />
                  <span>Server-Sent Events (SSE) live telemetry</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#0c56ec] shrink-0 stroke-[3]" />
                  <span>UTM Campaign builder presets</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3 text-center text-sm font-bold text-white bg-[#0c56ec] hover:bg-[#0947c7] rounded-md shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start 14-day free trial</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Card 3: Enterprise */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-[#081638]">Enterprise</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">For large teams demanding dedicated scale &amp; SLAs</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#081638]">
                  ${annualBilling ? '39' : '49'}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ month</span>
              </div>

              <hr className="border-slate-100" />

              <ul className="space-y-3 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>Everything in Growth Pro</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>Custom branded root domains</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>99.99% Uptime SLA commitment</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>Dedicated Redis cluster caching</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>Priority 24/7 engineering support</span>
                </li>
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3 text-center text-sm font-bold text-[#081638] rounded-md border-2 border-slate-300 hover:border-slate-900 transition-colors"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
