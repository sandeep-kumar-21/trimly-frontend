'use client';

import React, { useMemo } from 'react';
import { Calendar, SlidersHorizontal } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';

export interface SharedSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  onOpenDateModal?: () => void;
  onOpenFilterModal?: () => void;
  dateFilterLabel?: string | null;
  appliedFiltersCount?: number;
  totalResults?: number;
  onClearAll?: () => void;
}

export const SharedSearchBar: React.FC<SharedSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  onOpenDateModal,
  onOpenFilterModal,
  dateFilterLabel,
  appliedFiltersCount = 0,
  totalResults,
  onClearAll,
}) => {
  const isFiltered = Boolean(dateFilterLabel || appliedFiltersCount > 0);

  const filterButtonText = useMemo(() => {
    if (appliedFiltersCount > 0) {
      return `${appliedFiltersCount} ${appliedFiltersCount === 1 ? 'filter applied' : 'filters applied'}`;
    }
    return 'Add filters';
  }, [appliedFiltersCount]);

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search Input Field */}
      <div className="w-full sm:w-72 md:w-80 shrink-0">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>

      {/* Filter Buttons: 2-column grid on mobile, inline flex on desktop */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 min-w-0">
        {/* Filter by created date Button */}
        <button
          type="button"
          onClick={onOpenDateModal}
          className={`h-10 px-2.5 sm:px-4 rounded-md border text-xs sm:text-sm font-semibold transition-colors shadow-2xs flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer truncate ${
            dateFilterLabel
              ? 'border-[#2a5bd7] bg-white text-[#2a5bd7] dark:bg-slate-900 dark:border-blue-500 dark:text-blue-400'
              : 'border-slate-200 bg-white text-[#273144] hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className={`h-4 w-4 shrink-0 ${dateFilterLabel ? 'text-[#2a5bd7] dark:text-blue-400' : 'text-slate-500'}`} />
          <span className="truncate sm:hidden">{dateFilterLabel || 'Created date'}</span>
          <span className="truncate hidden sm:inline">{dateFilterLabel || 'Filter by created date'}</span>
        </button>

        {/* Add filters / X filters applied Button */}
        <button
          type="button"
          onClick={onOpenFilterModal}
          className={`h-10 px-3 sm:px-4 rounded-md border text-sm font-semibold transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer truncate ${
            appliedFiltersCount > 0
              ? 'border-[#2a5bd7] bg-white text-[#2a5bd7] dark:bg-slate-900 dark:border-blue-500 dark:text-blue-400 font-semibold'
              : 'border-slate-200 bg-white text-[#273144] hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className={`h-4 w-4 shrink-0 ${appliedFiltersCount > 0 ? 'text-[#2a5bd7] dark:text-blue-400' : 'text-slate-500'}`} />
          <span className="truncate">{filterButtonText}</span>
        </button>
      </div>

      {/* Showing Results Counter & Clear All Button (Bitly Exact Parity) */}
      {isFiltered && (
        <div className="flex items-center gap-3 text-sm font-medium pl-1 sm:pl-2 pt-1 sm:pt-0">
          {totalResults !== undefined && (
            <span className="text-[#273144] dark:text-slate-300">
              Showing {totalResults === 1 ? '1 result' : `all ${totalResults} results`}
            </span>
          )}
          {onClearAll && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[#2a5bd7] dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};
