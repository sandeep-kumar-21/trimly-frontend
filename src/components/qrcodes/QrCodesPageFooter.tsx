'use client';

import React from 'react';

export const QrCodesPageFooter: React.FC = () => {
  return (
    <div className="flex items-center gap-4 pt-6">
      <hr className="flex-1 border-slate-200 dark:border-slate-800" />
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        You've reached the end of your QR codes
      </span>
      <hr className="flex-1 border-slate-200 dark:border-slate-800" />
    </div>
  );
};
