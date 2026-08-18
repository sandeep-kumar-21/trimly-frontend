'use client';

import React from 'react';
import { Circle } from 'lucide-react';
import { QrCodeIcon } from '@/components/icons/AppIcons';
import Link from 'next/link';

export const DoMoreChecklist: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-full min-h-40">
      {/* Header with Circular Progress Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
          Do more with Trimly
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-[#2a5bd7] dark:text-blue-400">50%</span>
          {/* Radial progress ring */}
          <div className="relative h-6 w-6">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-100 dark:text-slate-800"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="56.5"
                strokeDashoffset="28.25"
                className="text-emerald-500"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Onboarding Checklist Items */}
      <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex items-center gap-2.5 min-w-0">
          <Circle className="h-4.5 w-4.5 text-slate-400 shrink-0" />
          <h4 className="text-sm font-semibold text-[#273144] dark:text-slate-100 truncate">
            Make your links scannable
          </h4>
        </div>
        <Link
          href="/qrcodes"
          className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-[#2a5bd7] hover:bg-slate-50 transition-colors shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400 cursor-pointer"
        >
          <QrCodeIcon className="h-3.5 w-3.5 text-[#2a5bd7]" />
          Create a QR Code
        </Link>
      </div>
    </div>
  );
};
