'use client';

import React, { useState } from 'react';
import { Link2, QrCode } from 'lucide-react';
import { HeroShortLinkTab } from './HeroShortLinkTab';
import { HeroQrCodeTab } from './HeroQrCodeTab';

export interface HeroDualWidgetProps {
  initialTab?: 'link' | 'qr';
}

export const HeroDualWidget: React.FC<HeroDualWidgetProps> = ({ initialTab = 'link' }) => {
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>(initialTab);

  return (
    <div id="hero-dual-widget" className="w-full max-w-4xl mx-auto select-none">
      {/* Outer Navy Container */}
      <div className="rounded-3xl bg-[#06183e]/90 border border-white/15 p-3 sm:p-5 shadow-2xl backdrop-blur-md">
        {/* Top Tab Bar (Matching Bitly Image 1 & 2) */}
        <div className="flex items-end gap-2 px-2">
          {/* Tab 1: Short Link */}
          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`flex items-center gap-2.5 px-6 sm:px-8 py-3.5 font-extrabold text-sm sm:text-base transition-all cursor-pointer ${
              activeTab === 'link'
                ? 'bg-white text-[#081638] rounded-t-2xl shadow-sm z-10 -mb-[1px]'
                : 'bg-transparent text-white/90 hover:text-white hover:bg-white/10 rounded-xl border border-white/20'
            }`}
          >
            <div
              className={`p-1 rounded-md flex items-center justify-center ${
                activeTab === 'link' ? 'bg-orange-50 text-[#f26522]' : 'text-white'
              }`}
            >
              <Link2 className="h-4 w-4" />
            </div>
            <span>Short Link</span>
          </button>

          {/* Tab 2: QR Code */}
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`flex items-center gap-2.5 px-6 sm:px-8 py-3.5 font-extrabold text-sm sm:text-base transition-all cursor-pointer ${
              activeTab === 'qr'
                ? 'bg-white text-[#081638] rounded-t-2xl shadow-sm z-10 -mb-[1px]'
                : 'bg-transparent text-white/90 hover:text-white hover:bg-white/10 rounded-xl border border-white/20'
            }`}
          >
            <div
              className={`p-1 rounded-md flex items-center justify-center ${
                activeTab === 'qr' ? 'bg-orange-50 text-[#f26522]' : 'text-white'
              }`}
            >
              <QrCode className="h-4 w-4" />
            </div>
            <span>QR Code</span>
          </button>
        </div>

        {/* Inner White Content Card */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          {activeTab === 'link' ? <HeroShortLinkTab /> : <HeroQrCodeTab />}
        </div>
      </div>
    </div>
  );
};
