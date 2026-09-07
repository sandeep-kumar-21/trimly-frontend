'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/utils/clipboard';

interface SmartInsightsBannerProps {
  summaryText?: string;
  isLoading?: boolean;
}

export const SmartInsightsBanner: React.FC<SmartInsightsBannerProps> = ({
  summaryText,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="h-16 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60" />
    );
  }

  if (!summaryText) return null;

  const handleCopy = async () => {
    const success = await copyToClipboard(summaryText);
    if (success) {
      setCopied(true);
      toast.success('Executive insights copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy text');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white p-4 shadow-2xs dark:border-blue-900/40 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2a5bd7]/10 text-[#2a5bd7] dark:bg-blue-500/20 dark:text-blue-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2a5bd7] dark:text-blue-400">
                Trimly Assist • Executive Digest
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5 leading-relaxed">
              {summaryText}
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          title="Copy insights summary"
          className="flex h-8 shrink-0 items-center gap-1.5 self-end sm:self-center rounded-md border border-slate-200/80 bg-white/80 px-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
