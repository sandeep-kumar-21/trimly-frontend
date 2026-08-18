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
    <div className="sticky -bottom-[23px] sm:-bottom-[31px] lg:-bottom-[39px] z-40 w-full mt-8">
      <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
        {/* Left Action: Cancel */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="h-11 px-6 rounded-lg border border-slate-300 bg-white text-sm font-bold text-[#273144] hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          Cancel
        </button>

        {/* Right Actions: Back + Submit */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="h-11 px-5 rounded-lg border border-slate-300 bg-white text-sm font-bold text-[#273144] hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
              <span>Back</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || disabled}
            title={disabled && disabledTooltip ? disabledTooltip : undefined}
            className="h-11 px-6 rounded-lg bg-[#2a5bd7] text-white text-sm font-bold hover:bg-[#1a4bb7] transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>{cleanText}</span>
                {hasArrow && <ChevronRight className="h-4 w-4 stroke-[2.5]" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
