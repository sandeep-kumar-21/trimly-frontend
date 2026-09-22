'use client';

import React from 'react';
import { Check } from 'lucide-react';

export const HeroFreePlanChips: React.FC = () => {
  const chips = [
    '100 Short links / month',
    '10 Dynamic QR codes',
    'Real-time click data',
    'Custom back-half URLs',
    'PNG QR export',
  ];

  return (
    <div className="pt-4 pb-2 text-center space-y-3 select-none">
      <p className="text-sm font-bold text-white/90">
        Sign up for free. Your free plan includes:
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {chips.map((chip, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-xs font-semibold backdrop-blur-xs"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
            <span>{chip}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
