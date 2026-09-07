'use client';

import React from 'react';
import { Loader2, ChevronRight, ChevronLeft } from 'lucide-react';

export interface SharedCreationActionBarProps {
  onCancel: () => void;
  onBack?: () => void;
  onSubmit: () => void;
  submitText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
}

export const SharedCreationActionBar: React.FC<SharedCreationActionBarProps> = ({
  onCancel,
  onBack,
  onSubmit,
  submitText = 'Create your link',
  isLoading = false,
  disabled = false,
  disabledTooltip,
}) => {
  const hasArrow = submitText.includes('>') || submitText.toLowerCase().includes('design');
  const cleanText = submitText.replace('>', '').trim();

  return (
    <div className="sticky bottom-0 z-40 w-full mt-6 sm:mt-8 pb-1">
      <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 sm:p-3.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between gap-2">
        {/* Left Action: Cancel */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="h-10 sm:h-11 px-3.5 sm:px-6 rounded-lg sm:rounded-md border border-slate-300 bg-white text-xs sm:text-sm font-bold text-[#273144] hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0"
        >
          Cancel
        </button>

        {/* Right Actions: Back + Submit */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="h-10 sm:h-11 px-3 sm:px-5 rounded-lg sm:rounded-md border border-slate-300 bg-white text-xs sm:text-sm font-bold text-[#273144] hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 flex items-center justify-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
              <span>Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || disabled}
            title={disabled && disabledTooltip ? disabledTooltip : undefined}
            className="h-10 sm:h-11 px-3.5 sm:px-6 rounded-lg sm:rounded-md bg-[#2a5bd7] text-white text-xs sm:text-sm font-bold hover:bg-[#1a4bb7] transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>{cleanText}</span>
                {hasArrow && <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
