'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { LinkIcon, QrCodeIcon } from '@/components/icons/AppIcons';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

export interface SharedSharingOptionsCardProps {
  mode: 'link' | 'qrcode';
  toggleValue: boolean;
  onToggleChange: (val: boolean) => void;
}

export const SharedSharingOptionsCard: React.FC<SharedSharingOptionsCardProps> = ({
  mode,
  toggleValue,
  onToggleChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const isLinkMode = mode === 'link';

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
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
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              {isLinkMode ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-[#EF8000] dark:bg-amber-950/50 dark:text-amber-400">
                  <QrCodeIcon className="h-5 w-5" />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#2a5bd7] dark:bg-blue-950/50 dark:text-blue-400">
                  <LinkIcon className="h-5 w-5" />
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#273144] dark:text-slate-100">
                  {isLinkMode ? 'Generate a QR Code' : 'Create a link'}
                </span>
                <span className="text-xs font-semibold text-slate-400 border-b border-dashed border-slate-300">
                  {isLinkMode ? '2 left' : '49 left'}
                </span>
              </div>
            </div>

            {/* Canonical Toggle Switch */}
            <ToggleSwitch
              checked={toggleValue}
              onChange={onToggleChange}
              aria-label={isLinkMode ? 'Generate a QR Code' : 'Create a link'}
            />
          </div>
        </div>
      )}
    </section>
  );
};
