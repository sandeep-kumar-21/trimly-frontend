'use client';

import React from 'react';
import { ArrowRight, BarChart2, Tag, Compass } from 'lucide-react';

export const LinkCardMockup: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#f4f3ef] border border-slate-200/80 shadow-md hover:shadow-lg transition-all space-y-5 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Top Floating Tags */}
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-mono font-medium text-slate-700 shadow-2xs">
          <Tag className="h-3.5 w-3.5 text-orange-500" />
          <span>?utm_medium=social</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
          <span>Redirect URL</span>
          <ArrowRight className="h-3 w-3 text-[#0c56ec]" />
        </div>
      </div>

      {/* Center Branded URL Display */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl bg-[#f26522] text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
            b
          </div>
          <span className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
            yourbrnd.co/link
          </span>
        </div>
        <div className="p-2 rounded-lg bg-slate-50 text-slate-500">
          <BarChart2 className="h-4 w-4" />
        </div>
      </div>

      {/* Bottom Dynamic Routing Conditions */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 pb-1 border-b border-slate-100">
          <Compass className="h-3.5 w-3.5 text-[#0c56ec]" />
          <span>Dynamic Routing Rules</span>
        </div>
        <div className="space-y-1 font-mono text-[11px] text-slate-600">
          <div><span className="text-blue-600 font-semibold">if</span> Country is United States <span className="text-slate-400">and</span></div>
          <div>Region is California, US <span className="text-slate-400">and</span></div>
          <div>Device is Mobile and Platform is iOS</div>
          <div className="pt-1 text-[#0c56ec] font-semibold truncate">
            &rarr; go to: https://app.store/download
          </div>
        </div>
      </div>
    </div>
  );
};
