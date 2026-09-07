'use client';

import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

export interface CampaignActionBarProps {
  onCancel: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export const CampaignActionBar: React.FC<CampaignActionBarProps> = ({
  onCancel,
  onSubmit,
  isLoading = false,
}) => {
  return (
    <div className="sticky -bottom-[23px] sm:-bottom-[31px] lg:-bottom-[39px] z-40 w-full mt-8">
      <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="h-10 sm:h-11 px-4 sm:px-6 rounded-md border border-slate-300 bg-white text-xs sm:text-sm font-bold text-[#273144] hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="h-10 sm:h-11 px-4 sm:px-6 rounded-md bg-[#2a5bd7] text-white text-xs sm:text-sm font-bold hover:bg-[#1a4bb7] transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <span>Create campaign</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
