'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { QrCodeIcon } from '@/components/icons/AppIcons';

interface QrCodeCardBadgeProps {
  isVisibleLink: boolean;
}

export const QrCodeCardBadge: React.FC<QrCodeCardBadgeProps> = ({ isVisibleLink }) => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-[#273144] dark:bg-slate-800 dark:text-slate-300">
      {isVisibleLink ? (
        <>
          <Globe className="h-3.5 w-3.5 text-slate-500" />
          <span>Website</span>
        </>
      ) : (
        <>
          <QrCodeIcon className="h-3.5 w-3.5 text-slate-500" />
          <span>QR Code</span>
        </>
      )}
    </span>
  );
};
