'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { QrCodeIcon } from '@/components/icons/AppIcons';

export interface LinkSharingOptionsCardProps {
  alsoCreateQr: boolean;
  onAlsoCreateQrChange: (val: boolean) => void;
}

export const LinkSharingOptionsCard: React.FC<LinkSharingOptionsCardProps> = ({
  alsoCreateQr,
  onAlsoCreateQrChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h2 className="text-lg font-bold text-[#273144] dark:text-slate-100">
          Sharing options
        </h2>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Collapse Sharing options section"
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          {/* Generate a QR Code option */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-[#EF8000] dark:bg-amber-950/50 dark:text-amber-400">
                <QrCodeIcon className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#273144] dark:text-slate-100">
                  Generate a QR Code
                </span>
                <span className="text-xs font-semibold text-slate-400 border-b border-dashed border-slate-300">
                  2 left
                </span>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={alsoCreateQr}
              onClick={() => onAlsoCreateQrChange(!alsoCreateQr)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${alsoCreateQr ? 'bg-[#2a5bd7]' : 'bg-slate-200 dark:bg-slate-700'
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${alsoCreateQr ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
