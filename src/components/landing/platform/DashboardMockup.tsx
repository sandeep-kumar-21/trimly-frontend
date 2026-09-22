'use client';

import React from 'react';
import {
  Link2,
  QrCode,
  Sparkles,
  ArrowRight,
  Home,
  Plus,
  Compass,
  Layers,
  BarChart3,
  CheckSquare,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';

export const DashboardMockup: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto pt-6 pb-12 select-none">
      {/* Main Dashboard Window Container */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-black/40 overflow-hidden text-slate-800">
        {/* Window Top Controls & Navigation */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Trimly Logo Marker */}
            <div className="h-8 w-8 rounded-xl bg-[#f26522] text-white font-black flex items-center justify-center text-sm shadow-xs">
              T
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1.5 rounded-lg bg-[#0c56ec] text-white hover:bg-blue-700 transition-colors shadow-2xs"
                title="Create"
              >
                <Plus className="h-4 w-4" />
              </button>
              <div className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/60 transition-colors">
                <Home className="h-4 w-4" />
              </div>
              <div className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/60 transition-colors">
                <Link2 className="h-4 w-4" />
              </div>
              <div className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/60 transition-colors">
                <QrCode className="h-4 w-4" />
              </div>
              <div className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/60 transition-colors">
                <Layers className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Quick Create Tabs in Window Header */}
          <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-lg bg-white text-xs font-bold text-slate-900 shadow-xs">
              <Link2 className="h-3.5 w-3.5 text-[#0c56ec]" />
              <span>Short link</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-lg text-xs font-semibold text-slate-600">
              <QrCode className="h-3.5 w-3.5 text-slate-500" />
              <span>QR Code</span>
            </span>
          </div>
        </div>

        {/* Window Body Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-white">
          {/* Left Form: Quick Create Short Link */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xl font-extrabold text-slate-900">
              Quick create: Short link
            </h4>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700">Domain: <span className="text-[#0c56ec]">trimly.link ▾</span></span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="dashboard-dest-url" className="block text-xs font-bold text-slate-700">
                Enter your destination URL
              </label>
              <input
                id="dashboard-dest-url"
                type="text"
                readOnly
                value="https://example.com/my-seasonal-campaign-launch"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 text-xs font-mono select-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs font-medium text-slate-700">
              <CheckSquare className="h-4 w-4 text-[#0c56ec]" />
              <span>Also create a QR Code for this link</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="px-5 py-2.5 rounded-md bg-[#0c56ec] text-white text-xs font-bold shadow-xs hover:bg-[#0947c7] transition-colors"
              >
                Create your Trimly link
              </button>
            </div>
          </div>

          {/* Right AI Panel: Simplify Your Workflow (matching Bitly Image 5) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-blue-50/50 border border-orange-200/60 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>Simplify your workflow</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Explore smarter ways to create links with Trimly AI.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-[11px] font-semibold text-slate-700 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#0c56ec]" />
                <span>Personalize a short link</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-[11px] font-semibold text-slate-700 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Make a unique link for every post</span>
              </div>
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0c56ec] hover:underline cursor-pointer">
                <span>Create with AI</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Window Sub-bar */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">ENGAGEMENTS</span>
              <span className="text-sm font-extrabold text-slate-900">1,199</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">LINK CLICKS</span>
              <span className="text-sm font-extrabold text-slate-900">1,100</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-semibold text-slate-600">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span>+18.4% this month</span>
          </div>
        </div>
      </div>

      {/* Floating Badge 1 (Bottom Left, matching Bitly Image 5) */}
      <div className="absolute -bottom-4 left-4 sm:left-8 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300">
        <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
          <Link2 className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900">Social media Ads</div>
          <div className="text-[11px] text-slate-500 font-medium">5,348 Scans • Active</div>
        </div>
      </div>

      {/* Floating Badge 2 (Mid Right, matching Bitly Image 5) */}
      <div className="absolute -top-3 right-4 sm:right-10 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
        <div className="p-2 rounded-xl bg-[#081638] text-white shadow-xs">
          <QrCode className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-900">Promotional Flyer</div>
          <div className="text-[11px] text-slate-500 font-medium">9,874 Scans • Printed</div>
        </div>
      </div>
    </div>
  );
};
