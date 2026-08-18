'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, MoreHorizontal, Palette, Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { qrcodesApi } from '@/lib/api/qrcodes.api';
import { useUserQrCodes } from '@/hooks/useQRCodes';

export interface SharedDetailsSharingCardProps {
  type: 'link' | 'qrcode';
  shortCode: string;
  destinationUrl?: string;
  shortUrl?: string;
}

export const SharedDetailsSharingCard: React.FC<SharedDetailsSharingCardProps> = ({
  type,
  shortCode,
  destinationUrl,
  shortUrl,
}) => {
  const router = useRouter();
  const isQrMode = type === 'qrcode';
  const displayShortLink = `trim.ly/${shortCode}`;

  const [localHasQr, setLocalHasQr] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && shortCode) {
      return localStorage.getItem(`qr_created_${shortCode.toString().trim().toLowerCase()}`) === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && shortCode) {
      setLocalHasQr(localStorage.getItem(`qr_created_${shortCode.toString().trim().toLowerCase()}`) === 'true');
    }
  }, [shortCode]);

  const { data: userQrCodes = [], isLoading } = useUserQrCodes();
  const matchingQr = userQrCodes.find(
    (q) => q.shortCode?.toString().trim().toLowerCase() === shortCode?.toString().trim().toLowerCase()
  );

  const { data: singleQr } = useQuery({
    queryKey: ['qrcode-single-detail', shortCode],
    queryFn: () => qrcodesApi.getQrCodeDetails(shortCode),
    enabled: isQrMode && !!shortCode && !matchingQr?.svg,
  });

  const activeQr = matchingQr || singleQr;
  const activeSvg = matchingQr?.svg || singleQr?.svg;
  
  const normalizedSvg = React.useMemo(() => {
    if (!activeSvg) return null;
    let svg = activeSvg;
    if (!svg.includes('viewBox')) {
      svg = svg.replace(
        /<svg\s+([^>]*?)width="(\d+)"\s+height="(\d+)"([^>]*?)>/i,
        '<svg $1viewBox="0 0 $2 $3" width="100%" height="100%"$4>'
      );
    }
    const sfx = `_${shortCode}`;
    if (!svg.includes(sfx)) {
      svg = svg.replace(/id="([^"]+)"/g, `id="$1${sfx}"`);
      svg = svg.replace(/url\('#([^']+)'\)/g, `url('#$1${sfx}')`);
      svg = svg.replace(/url\(#([^)]+)\)/g, `url(#$1${sfx})`);
      svg = svg.replace(/href="#([^"]+)"/g, `href="#$1${sfx}"`);
      svg = svg.replace(/xlink:href="#([^"]+)"/g, `xlink:href="#$1${sfx}"`);
    }
    return svg;
  }, [activeSvg, shortCode]);

  const hasSavedQr = localHasQr || !!activeQr;
  const hasQrCode = isQrMode || hasSavedQr;

  const targetQrData = shortUrl || activeQr?.shortUrl || `http://localhost:4000/${shortCode}`;
  const qrConfig = activeQr?.qrConfig;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsDownloadMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleDownload = async (format: 'png' | 'jpeg' | 'svg') => {
    try {
      if (format === 'svg') {
        const blob = await qrcodesApi.getQrCodeImageBlob(shortCode, 'svg');
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qrcode-${shortCode}.svg`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const blob = await qrcodesApi.getQrCodeImageBlob(shortCode, 'png');
        if (format === 'png') {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `qrcode-${shortCode}.png`;
          a.click();
          window.URL.revokeObjectURL(url);
        } else if (format === 'jpeg') {
          const img = new window.Image();
          const url = window.URL.createObjectURL(blob);
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width || 1000;
            canvas.height = img.height || 1000;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              const jpegUrl = canvas.toDataURL('image/jpeg', 0.95);
              const a = document.createElement('a');
              a.href = jpegUrl;
              a.download = `qrcode-${shortCode}.jpg`;
              a.click();
            }
            window.URL.revokeObjectURL(url);
          };
          img.src = url;
        }
      }
      setIsDownloadMenuOpen(false);
    } catch {
      toast.error('Failed to download QR code');
    }
  };

  if (isLoading && !localHasQr && !isQrMode) {
    return (
      <div className="h-full w-full rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-6 flex flex-col justify-between animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 rounded-md bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-20 rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="flex-1 min-h-[220px] rounded-xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center">
          <div className="h-32 w-32 rounded-xl bg-slate-200 dark:bg-slate-700/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-6 flex flex-col justify-between">
      {/* 1. QR Code Section */}
      <div className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#273144] dark:text-slate-100">
            QR Code
          </h3>
          {hasQrCode ? (
            <div className="flex items-center gap-1.5 text-slate-500 relative">
              {/* Three-dot Options Menu Dropdown (Only shown in Link Details mode) */}
              {!isQrMode && (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="QR options"
                    className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                      isMenuOpen
                        ? 'text-[#2a5bd7] bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800'
                        : 'text-[#273144] border-transparent hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <MoreHorizontal className="h-4.5 w-4.5" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push(`/qrcodes/${shortCode}/edit/customize?from=details`);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <Palette className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                        <span>Customize</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push(`/qrcodes/${shortCode}/details`);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <Eye className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                        <span>View code details</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Download Dropdown Menu */}
              <div className="relative" ref={downloadMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                  aria-label="Download QR Code"
                  className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                    isDownloadMenuOpen
                      ? 'text-[#2a5bd7] bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800'
                      : 'text-[#273144] border-transparent hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Download className="h-4.5 w-4.5" />
                </button>

                {isDownloadMenuOpen && (
                  <div
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="download-menu-button"
                    className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-lg border border-slate-200/90 bg-white py-1 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleDownload('png')}
                      className="w-full px-4 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-[#f0f4fa] dark:text-slate-200 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      Download PNG
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleDownload('svg')}
                      className="w-full px-4 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-[#f0f4fa] dark:text-slate-200 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      Download SVG
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleDownload('jpeg')}
                      className="w-full px-4 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-[#f0f4fa] dark:text-slate-200 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      Download JPEG
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push(`/qrcodes/create?code=${shortCode}`)}
              className="inline-flex items-center gap-1 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create QR Code</span>
            </button>
          )}
        </div>

        {/* QR Code Preview Box OR Watermarked Placeholder */}
        {hasQrCode ? (
          <div className="flex-1 flex flex-col items-center justify-center rounded-xl bg-[#f4f6f8] p-6 dark:bg-slate-800/50 space-y-4 border border-slate-100 dark:border-slate-800/80">
            <div className="relative group flex items-center justify-center rounded-xl bg-white p-3 shadow-sm border border-slate-100 dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
              {normalizedSvg ? (
                <div
                  className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                  dangerouslySetInnerHTML={{ __html: normalizedSvg }}
                />
              ) : (
                <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
              )}
            </div>

            {/* Action Link under preview image */}
            {isQrMode ? (
              <button
                type="button"
                onClick={() => router.push(`/qrcodes/${shortCode}/edit/customize?from=details`)}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer"
              >
                <Palette className="h-4 w-4" />
                <span>Customize</span>
              </button>
            ) : (
              <div className="flex items-center justify-between w-full pt-1 px-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-xs font-bold text-[#273144] dark:text-slate-200">{displayShortLink}</span>
                <button
                  type="button"
                  onClick={() => router.push(`/qrcodes/${shortCode}/details`)}
                  className="text-xs font-bold text-[#2a5bd7] hover:underline cursor-pointer"
                >
                  View details
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center rounded-xl bg-[#f8fafc] p-6 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 min-h-[220px]">
            <div className="flex h-36 w-36 items-center justify-center rounded-xl border border-dashed border-slate-200/90 bg-white/70 dark:border-slate-700/60 dark:bg-slate-900/60 p-4 shadow-2xs">
              <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 opacity-35">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="5" y="5" width="3" height="3" fill="currentColor" opacity="0.5" />
                <rect x="16" y="5" width="3" height="3" fill="currentColor" opacity="0.5" />
                <rect x="5" y="16" width="3" height="3" fill="currentColor" opacity="0.5" />
                <path d="M14 14h3v3h-3z" />
                <path d="M17 17h4v4h-4z" />
                <path d="M14 20h3" />
                <path d="M20 14v3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
