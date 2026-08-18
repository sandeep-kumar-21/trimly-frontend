'use client';

import React from 'react';
import Image from 'next/image';

export interface CampaignsLandingProps {
  onStartCreate: () => void;
}

export const CampaignsLanding: React.FC<CampaignsLandingProps> = ({ onStartCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-6 pb-12 text-center max-w-2xl mx-auto space-y-5 px-4">
      {/* Hero Illustration from public/Campaigns_image.webp */}
      <div className="relative w-full max-w-[420px] flex items-center justify-center">
        <Image
          src="/Campaigns_image.webp"
          alt="Trimly Campaigns Illustration"
          width={420}
          height={230}
          priority
          className="w-full rounded-xl max-w-[420px] h-auto object-contain mx-auto"
        />
      </div>

      {/* Heading & Subheading */}
      <div className="space-y-2 pt-2">
        <h1 className="text-2xl sm:text-[30px] font-bold tracking-tight text-[#273144] dark:text-slate-100">
          Some links belong together
        </h1>
        <p className="text-sm sm:text-base text-[#526281] dark:text-slate-400 leading-relaxed max-w-lg mx-auto font-medium">
          Organize your links in Trimly Campaigns and compare performance across channels.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onStartCreate}
          className="h-11 px-8 rounded-lg bg-[#2a5bd7] text-white font-bold text-sm hover:bg-[#1a4bb7] transition-all shadow-2xs cursor-pointer"
        >
          Create campaign
        </button>
        <div>
          <button
            type="button"
            className="text-sm font-semibold text-[#2a5bd7] hover:underline cursor-pointer"
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};
