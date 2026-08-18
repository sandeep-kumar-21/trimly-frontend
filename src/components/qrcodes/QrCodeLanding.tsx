'use client';

import React from 'react';
import Image from 'next/image';

export interface QrCodeLandingProps {
  onStartCreate: () => void;
}

export const QrCodeLanding: React.FC<QrCodeLandingProps> = ({ onStartCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-2 pb-8 text-center max-w-2xl mx-auto space-y-4 px-4">
      {/* Hero Illustration from public/qrcode_image.webp */}
      <div className="relative w-full max-w-[320px] flex items-center justify-center">
        <Image
          src="/qrcode_image.webp"
          alt="QR Code Hero Illustration"
          width={320}
          height={180}
          priority
          className="w-full rounded-xl max-w-[320px] h-auto object-contain mx-auto shadow-2xs"
        />
      </div>

      {/* Heading & Subheading */}
      <div className="space-y-2 pt-1">
        <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#273144] dark:text-slate-100">
          Connect your audience with a simple scan
        </h1>
        <p className="text-sm text-[#526281] dark:text-slate-400 leading-relaxed max-w-lg mx-auto font-medium">
          Create a QR Code from any short link. Then edit, customize, and track your QR Codes here.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          onClick={onStartCreate}
          className="h-11 px-6 rounded-lg bg-[#2a5bd7] text-white font-bold text-sm hover:bg-[#1a4bb7] transition-all shadow-2xs cursor-pointer"
        >
          Create a Trimly Code
        </button>
        <div>
          <button
            type="button"
            className="text-md font-semibold text-[#2a5bd7] hover:underline cursor-pointer"
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
};
