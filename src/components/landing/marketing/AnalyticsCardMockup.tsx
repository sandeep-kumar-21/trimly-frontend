'use client';

import React from 'react';
import { Sparkles, Star, MessageSquare, TrendingUp } from 'lucide-react';

export const AnalyticsCardMockup: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#f4f3ef] border border-slate-200/80 shadow-md hover:shadow-lg transition-all space-y-4 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Top Total Engagements Badge */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-slate-900">
          1,422 engagements <span className="text-xs font-normal text-slate-500">(30 days)</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
          <TrendingUp className="h-3 w-3" /> +30%
        </span>
      </div>

      {/* Center Simulated Metric Graph */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xl font-black text-slate-900">879</span>
            <span className="text-[11px] text-slate-500 ml-1.5 font-medium">this week</span>
          </div>
          <span className="text-[11px] text-slate-400">May 18 – 24</span>
        </div>

        {/* SVG Sparkline Curve */}
        <div className="h-16 w-full flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60" fill="none">
            <path
              d="M 0,45 C 30,50 50,20 80,35 C 110,50 140,10 170,25 C 185,32 195,15 200,8"
              stroke="#0c56ec"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M 0,45 C 30,50 50,20 80,35 C 110,50 140,10 170,25 C 185,32 195,15 200,8 L 200,60 L 0,60 Z"
              fill="url(#gradient-wave)"
              opacity="0.15"
            />
            <defs>
              <linearGradient id="gradient-wave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0c56ec" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Floating AI Prompt Pills (matching Bitly Image 3) */}
      <div className="space-y-1.5 pt-1">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2 text-xs font-semibold text-slate-700 hover:border-blue-300 transition-colors cursor-pointer">
          <Sparkles className="h-3.5 w-3.5 text-purple-600 shrink-0" />
          <span className="truncate">Summarize my last 7 days</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2 text-xs font-semibold text-slate-700 hover:border-blue-300 transition-colors cursor-pointer">
          <Star className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="truncate">Compare my top performing links</span>
        </div>

        <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2 text-xs font-semibold text-slate-700 hover:border-blue-300 transition-colors cursor-pointer">
          <MessageSquare className="h-3.5 w-3.5 text-[#0c56ec] shrink-0" />
          <span className="truncate">Ask about my data...</span>
        </div>
      </div>
    </div>
  );
};
