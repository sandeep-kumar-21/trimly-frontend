'use client';

import React, { useMemo } from 'react';

interface QrCodeCardPreviewProps {
  svg?: string | null;
  shortCode: string;
  id: string;
}

export const QrCodeCardPreview: React.FC<QrCodeCardPreviewProps> = ({ svg, shortCode, id }) => {
  const normalizedSvg = useMemo(() => {
    if (!svg) return null;
    let cleanSvg = svg;
    if (!cleanSvg.includes('viewBox')) {
      cleanSvg = cleanSvg.replace(
        /<svg\s+([^>]*?)width="(\d+)"\s+height="(\d+)"([^>]*?)>/i,
        '<svg $1viewBox="0 0 $2 $3" width="100%" height="100%"$4>'
      );
    }
    const sfx = `_${shortCode || id}`;
    if (!cleanSvg.includes(sfx)) {
      cleanSvg = cleanSvg.replace(/id="([^"]+)"/g, `id="$1${sfx}"`);
      cleanSvg = cleanSvg.replace(/url\('#([^']+)'\)/g, `url('#$1${sfx}')`);
      cleanSvg = cleanSvg.replace(/url\(#([^)]+)\)/g, `url(#$1${sfx})`);
      cleanSvg = cleanSvg.replace(/href="#([^"]+)"/g, `href="#$1${sfx}"`);
      cleanSvg = cleanSvg.replace(/xlink:href="#([^"]+)"/g, `xlink:href="#$1${sfx}"`);
    }
    return cleanSvg;
  }, [svg, shortCode, id]);

  return (
    <div className="w-full md:w-auto flex items-center justify-center shrink-0">
      <div className="flex h-[138px] w-[138px] items-center justify-center rounded-xl border border-slate-100 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-800 overflow-hidden">
        {normalizedSvg ? (
          <div
            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
            dangerouslySetInnerHTML={{ __html: normalizedSvg }}
          />
        ) : (
          <div className="h-full w-full rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" />
        )}
      </div>
    </div>
  );
};
