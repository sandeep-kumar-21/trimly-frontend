'use client';

import React from 'react';
import { Check, Link as LinkIcon } from 'lucide-react';

export interface QrCodeStepperHeaderProps {
  currentStep?: number;
  onStepClick?: (step: number) => void;
  shortCodePill?: string;
  isExistingLink?: boolean;
}

export const QrCodeStepperHeader: React.FC<QrCodeStepperHeaderProps> = ({
  currentStep = 1,
  onStepClick,
  shortCodePill,
  isExistingLink = false,
}) => {
  if (isExistingLink) {
    return (
      <div className="space-y-4 w-full select-none">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
            Create a QR Code
          </h1>
          {shortCodePill && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-[#273144] dark:bg-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700">
              <LinkIcon className="h-3.5 w-3.5 text-slate-500" />
              <span>{shortCodePill}</span>
            </span>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4 w-full select-none">
      {/* Stepper Navigation matching Bitly HTML */}
      <nav aria-label="create qr code steps" role="navigation" className="w-full">
        <ol className="flex items-center gap-3 text-sm font-semibold">
          {/* Step 1: Configure code */}
          <li
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
            onClick={() => onStepClick && onStepClick(1)}
            title="Go to Step 1: Configure code"
          >
            {currentStep > 1 ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1d4cc9] text-white text-xs font-bold shadow-2xs">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </span>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1d4cc9] text-white text-xs font-bold shadow-2xs">
                1
              </span>
            )}
            <span className={`text-xs sm:text-sm ${currentStep === 1 ? 'font-bold text-[#273144] dark:text-slate-100' : 'font-semibold text-[#1d4cc9] dark:text-blue-400'}`}>
              Configure code
            </span>
          </li>

          {/* Divider */}
          <div className="h-px w-10 sm:w-16 bg-slate-300 dark:bg-slate-700" />

          {/* Step 2: Customize design */}
          <li
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
            onClick={() => onStepClick && onStepClick(2)}
            title="Go to Step 2: Customize design"
          >
            {currentStep === 2 ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#1d4cc9] bg-white text-[#1d4cc9] text-xs font-bold dark:border-blue-500 dark:bg-slate-900 dark:text-blue-400">
                2
              </span>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300 text-slate-400 text-xs font-bold dark:border-slate-700">
                2
              </span>
            )}
            <span className={`text-xs sm:text-sm ${currentStep === 2 ? 'font-bold text-[#273144] dark:text-slate-100' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
              Customize design
            </span>
          </li>
        </ol>
      </nav>

      {/* Page Title & Bulk Upload Button */}
      {currentStep === 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
              Create a QR Code
            </h1>
            {shortCodePill && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-[#273144] dark:bg-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700">
                <LinkIcon className="h-3.5 w-3.5 text-slate-500" />
                <span>{shortCodePill}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => alert('Bulk upload feature is ready.')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer dark:text-blue-400"
          >
            <span>Bulk upload</span>
            <svg viewBox="0 0 17 16" height="18" width="18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.83341 12.6667H9.16675V9.88333L10.2334 10.95L11.1667 9.99999L8.50008 7.33333L5.83341 9.99999L6.78341 10.9333L7.83341 9.88333V12.6667ZM4.50008 14.6667C4.13341 14.6667 3.81953 14.5361 3.55841 14.275C3.2973 14.0139 3.16675 13.7 3.16675 13.3333V2.66666C3.16675 2.29999 3.2973 1.98611 3.55841 1.72499C3.81953 1.46388 4.13341 1.33333 4.50008 1.33333H9.83341L13.8334 5.33333V13.3333C13.8334 13.7 13.7029 14.0139 13.4417 14.275C13.1806 14.5361 12.8667 14.6667 12.5001 14.6667H4.50008ZM9.16675 5.99999V2.66666H4.50008V13.3333H12.5001V5.99999H9.16675Z"
                fill="#2a5bd7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
