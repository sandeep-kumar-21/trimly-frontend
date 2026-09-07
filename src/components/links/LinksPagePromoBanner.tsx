'use client';

import React, { useState, useEffect } from 'react';
import { Route, X } from 'lucide-react';

const PROMO_COOLDOWN_DAYS = 30;
const PROMO_COOLDOWN_MS = PROMO_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'trimly_link_promo_dismissed_at';

export interface LinksPagePromoBannerProps {
  className?: string;
  onDismiss?: () => void;
}

export const LinksPagePromoBanner: React.FC<LinksPagePromoBannerProps> = ({
  className = '',
  onDismiss,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      const dismissedAt = localStorage.getItem(STORAGE_KEY);
      if (dismissedAt) {
        const timestamp = parseInt(dismissedAt, 10);
        if (!isNaN(timestamp)) {
          const elapsed = Date.now() - timestamp;
          if (elapsed < PROMO_COOLDOWN_MS) {
            setIsDismissed(true);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } catch {
      // Gracefully handle private browsing / storage disabled
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } catch {
      // Gracefully handle private browsing / storage disabled
    }
    if (onDismiss) onDismiss();
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl bg-[#e6f7f5] border border-[#c3ede7] px-4 py-3 text-xs sm:text-sm font-medium text-[#1d3d3a] dark:bg-teal-950/40 dark:border-teal-900/60 dark:text-teal-200 shadow-2xs transition-all animate-fadeIn ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Route className="h-4.5 w-4.5 text-[#0d9488] dark:text-teal-400 shrink-0" />
        <p className="truncate sm:whitespace-normal">
          Change a link's destination anytime, even after you've shared it.
        </p>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-teal-100/60 dark:text-teal-400/70 dark:hover:text-teal-200 dark:hover:bg-teal-900/50 transition-colors cursor-pointer shrink-0"
        title="Dismiss banner"
        aria-label="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
