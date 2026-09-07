'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const SharedDynamicRoutingCard: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
              Dynamic routing
            </h2>
            <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              New!
            </span>
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Automatically route visitors to different destinations based on device, location, and more.
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.info('Add rules feature coming soon')}
          className="h-10 px-4 rounded-lg border border-slate-200 bg-white font-bold text-sm text-[#273144] hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add rules</span>
        </button>
      </div>
    </div>
  );
};
