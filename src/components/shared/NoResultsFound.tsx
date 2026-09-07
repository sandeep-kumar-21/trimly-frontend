'use client';

import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

export interface NoResultsFoundProps {
  title?: string;
  itemType?: 'links' | 'QR codes' | 'campaigns' | string;
  statusFilter?: string;
  onClearFilters?: () => void;
  onSwitchToActive?: () => void;
  className?: string;
}

export const NoResultsFound: React.FC<NoResultsFoundProps> = ({
  title = 'No results found',
  itemType = 'links',
  statusFilter,
  onClearFilters,
  onSwitchToActive,
  className = '',
}) => {
  const isHiddenSelected = statusFilter?.toLowerCase() === 'hidden';

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/90 bg-white/60 p-10 sm:p-14 text-center dark:border-slate-800 dark:bg-slate-900/60 shadow-2xs animate-fadeIn ${className}`}
    >
      {/* Illustration Badge matching Bitly / Trimly aesthetic */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Subtle pill background */}
        <div className="flex h-20 w-36 items-center justify-center rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
          {/* Dashed outline shape */}
          <div className="flex items-center justify-center">
            <svg
              className="h-10 w-16 text-slate-300 dark:text-slate-600"
              viewBox="0 0 64 36"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="4 4"
              strokeLinecap="round"
            >
              <rect x="3" y="3" width="58" height="30" rx="15" />
            </svg>
          </div>
        </div>

        {/* Magnifying Glass with Orange X Badge */}
        <div className="absolute -top-1 right-2 flex items-center">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700">
            <Search className="h-6 w-6 text-slate-500 dark:text-slate-400" />
            {/* Orange X Speech/Badge */}
            <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#f97316] text-white shadow-xs">
              <X className="h-3.5 w-3.5 stroke-[3]" />
            </span>
          </div>
        </div>
      </div>

      {/* Heading */}
      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
        {title}
      </h3>

      {/* Description with Actionable Links */}
      <p className="mt-2 max-w-md text-sm text-[#526281] dark:text-slate-400 font-medium leading-relaxed">
        Try adjusting your search, filters, or{' '}
        {isHiddenSelected && onSwitchToActive ? (
          <>
            <button
              type="button"
              onClick={onSwitchToActive}
              className="text-[#2a5bd7] font-semibold underline hover:text-[#1d4cc9] dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
            >
              try searching active {itemType}
            </button>{' '}
            instead.
          </>
        ) : onClearFilters ? (
          <>
            <button
              type="button"
              onClick={onClearFilters}
              className="text-[#2a5bd7] font-semibold underline hover:text-[#1d4cc9] dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
            >
              clear all filters
            </button>{' '}
            to see all {itemType}.
          </>
        ) : (
          `check your filters to find your ${itemType}.`
        )}
      </p>

      {/* Reset Filter Button */}
      {onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-6 inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#273144] hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
          <span>Reset all filters</span>
        </button>
      )}
    </div>
  );
};
