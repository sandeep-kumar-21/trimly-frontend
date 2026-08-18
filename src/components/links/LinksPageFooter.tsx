'use client';

import React from 'react';

export const LinksPageFooter: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-4 pt-6 pb-4">
      <div className="h-px w-24 bg-slate-200 dark:bg-slate-800" />
      <p className="text-sm font-semibold text-[#526281] dark:text-slate-400">
        You've reached the end of your links
      </p>
      <div className="h-px w-24 bg-slate-200 dark:bg-slate-800" />
    </div>
  );
};
