'use client';

import React from 'react';

export const CampaignCreationHeader: React.FC = () => {
  return (
    <div className="space-y-2">
      {/* Stepper Steps */}
      <div className="flex items-center gap-3 text-sm font-semibold">
        <div className="flex items-center gap-2 text-[#2a5bd7]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#2a5bd7] text-[11px] font-bold">
            1
          </span>
          <span>Configure campaign</span>
        </div>
        <div className="h-px w-12 bg-slate-300 dark:bg-slate-700" />
        <div className="flex items-center gap-2 text-slate-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-300 text-[11px] font-bold">
            2
          </span>
          <span>Organize channels & links</span>
        </div>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
          Create a new Trimly Campaign
        </h1>
      </div>
    </div>
  );
};
