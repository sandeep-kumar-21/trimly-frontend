'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface FloatingActionBarProps {
  onCancel: () => void;
  onDesignCode?: () => void;
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  onCancel,
  onDesignCode,
}) => {
  return (
    <div className="sticky -bottom-[23px] sm:-bottom-[31px] lg:-bottom-[39px] z-40 w-full mt-8">
      <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 px-6 rounded-lg border border-slate-300 bg-white text-sm font-bold text-[#273144] hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onDesignCode}
          className="h-11 px-6 rounded-lg bg-[#2a5bd7] text-white text-sm font-bold hover:bg-[#1a4bb7] transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
        >
          <span>Design your code</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
