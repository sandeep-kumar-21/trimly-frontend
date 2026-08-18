'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const LinksPagePromoBanner: React.FC = () => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-teal-50/80 border border-teal-100 p-4 text-sm font-medium text-slate-700 dark:bg-teal-950/40 dark:border-teal-900/50 dark:text-slate-300">
      <Sparkles className="h-4.5 w-4.5 text-teal-600 shrink-0" />
      <span>
        Change a link's destination, even after you've shared it. Get redirects with every plan.
      </span>
    </div>
  );
};
