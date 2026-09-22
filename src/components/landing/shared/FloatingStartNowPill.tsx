'use client';

import React from 'react';
import { Link2, QrCode } from 'lucide-react';

export interface FloatingStartNowPillProps {
  onSelectTab?: (tab: 'link' | 'qr') => void;
}

export const FloatingStartNowPill: React.FC<FloatingStartNowPillProps> = ({ onSelectTab }) => {
  const handleClick = (tab: 'link' | 'qr') => {
    if (onSelectTab) {
      onSelectTab(tab);
    }
    const heroWidget = document.getElementById('hero-dual-widget');
    if (heroWidget) {
      heroWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <aside aria-label="Quick Action Widget" className="fixed bottom-6 right-6 z-40">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#f26522] hover:bg-[#e05514] text-white shadow-xl shadow-orange-500/25 transition-all duration-200 hover:scale-105 border border-white/20 select-none">
        <span className="text-xs sm:text-sm font-bold tracking-tight">Start now:</span>
        <div className="flex items-center gap-1.5 ml-1">
          <button
            type="button"
            onClick={() => handleClick('link')}
            className="p-1.5 rounded-full bg-white text-[#f26522] hover:bg-orange-50 transition-colors cursor-pointer shadow-xs"
            aria-label="Create short link"
            title="Shorten link"
          >
            <Link2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleClick('qr')}
            className="p-1.5 rounded-full bg-white text-[#f26522] hover:bg-orange-50 transition-colors cursor-pointer shadow-xs"
            aria-label="Create QR code"
            title="Generate QR code"
          >
            <QrCode className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
