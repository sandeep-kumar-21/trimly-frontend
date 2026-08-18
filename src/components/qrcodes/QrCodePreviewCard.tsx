'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeGenerator } from '@/components/shared/QRCodeGenerator';
import { PATTERN_TO_DOTS_STYLE, mapCornerToStyles } from '@/lib/utils/qrConfigMapper';
import { checkQrContrast } from '@/lib/utils/qrContrastValidator';
import { AlertTriangle } from 'lucide-react';

export interface QrCodePreviewCardProps {
  shortCode?: string;
  shortUrl?: string;
  destinationUrl?: string;
  fgColor?: string;
  bgColor?: string;
  pattern?: string;
  corners?: string;
  logoUrl?: string | null;
  isStep2?: boolean;
}

export const QrCodePreviewCard: React.FC<QrCodePreviewCardProps> = ({
  shortCode,
  shortUrl,
  destinationUrl,
  fgColor = '#000000',
  bgColor = '#ffffff',
  pattern = 'square',
  corners = 'square',
  logoUrl = null,
  isStep2 = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasInput = !!(destinationUrl?.trim() || shortCode || shortUrl);

  const previewUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/s/qrc_preview.html`
      : 'http://localhost:3000/s/qrc_preview.html';

  const resolvedDotsStyle = PATTERN_TO_DOTS_STYLE[pattern] || pattern || 'square';
  const cornerStyles = mapCornerToStyles(corners);

  return (
    <div className="w-full self-start select-none space-y-4">
      {/* Title: Preview */}
      <h3 className="text-base font-bold text-[#273144] dark:text-slate-200 text-center">
        Preview
      </h3>

      {/* Main Preview Container */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-[#f4f6f8] p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900/50 min-h-[360px] sm:min-h-[380px]">
        {hasInput ? (
          /* Active State: White Card with custom QR code encoding preview landing page */
          <div className="relative flex items-center justify-center rounded-xl bg-white p-5 shadow-sm border border-slate-100 dark:border-slate-800 dark:bg-slate-800 transition-all duration-300">
            {checkQrContrast(fgColor, bgColor).isLowContrast && (
              <div className="absolute top-2 left-2 right-2 z-10 bg-amber-600/90 text-white text-[11px] font-bold py-1 px-2 rounded-md shadow-xs text-center backdrop-blur-xs flex items-center justify-center gap-1.5 animate-in fade-in">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Low contrast — Unscannable</span>
              </div>
            )}

            <QRCodeGenerator
              value={previewUrl}
              size={220}
              fgColor={fgColor}
              bgColor={bgColor}
              dotsStyle={resolvedDotsStyle}
              cornersStyle={cornerStyles.cornersStyle}
              cornersDotStyle={cornerStyles.cornersDotStyle}
              logoUrl={logoUrl}
            />

            {/* Trimly watermark at bottom-right */}
            <span className="absolute bottom-2 right-2 text-[10px] font-extrabold italic text-slate-800 dark:text-slate-200 opacity-90 select-none bg-white/90 dark:bg-slate-800/90 px-1 rounded-xs">
              trimly
            </span>
          </div>
        ) : (
          /* Empty / Initial State: Soft Grey QR Code placeholder matching Bitly initial view */
          <div className="relative flex items-center justify-center p-4 opacity-40 transition-opacity duration-300">
            {mounted ? (
              <QRCodeGenerator
                value={previewUrl}
                size={220}
                fgColor="#94a3b8"
                bgColor="transparent"
                dotsStyle="square"
                cornersStyle="square"
              />
            ) : (
              <div className="w-[220px] h-[220px] bg-slate-200/60 rounded-xl animate-pulse" />
            )}
          </div>
        )}
      </div>

      {/* Caption Text Below Preview (Shown once URL is entered or in step 2) */}
      {hasInput && (
        <p className="text-center text-xs font-semibold text-[#526281] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          This code is preview only, so don&apos;t copy it just yet. Your code will be generated once you finish creating it.
        </p>
      )}
    </div>
  );
};
