'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Edit2,
  Download,
  BarChart2,
  MoreHorizontal,
  Palette,
  Copy,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { qrcodesApi } from '@/lib/api/qrcodes.api';
import { useDuplicateQrCode, useUpdateQrCode } from '@/hooks/useQRCodes';
import { useQueryClient } from '@tanstack/react-query';
import { QrCodeItem } from '../QrCodeCard';

interface QrCodeCardActionsProps {
  item: QrCodeItem;
  onDelete?: (id: string) => void;
  onOpenHideModal: () => void;
  isMobile?: boolean;
}

export const QrCodeCardActions: React.FC<QrCodeCardActionsProps> = ({
  item,
  onDelete,
  onOpenHideModal,
  isMobile = false,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  const duplicateMutation = useDuplicateQrCode();
  const updateMutation = useUpdateQrCode();

  const isVisibleLink = item.visibleAsLink !== false;
  const iconSize = isMobile ? 'h-4 w-4' : 'h-4.5 w-4.5';
  const gapClass = isMobile ? 'gap-1.5' : 'gap-2.5 sm:gap-3';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(target)) {
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
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownload = async (format: 'png' | 'jpeg' | 'svg') => {
    try {
      setIsDownloadMenuOpen(false);
      if (format === 'svg') {
        const blob = await qrcodesApi.getQrCodeImageBlob(item.shortCode, 'svg');
        downloadBlob(blob, `qrcode-${item.shortCode}.svg`);
      } else if (format === 'png') {
        const blob = await qrcodesApi.getQrCodeImageBlob(item.shortCode, 'png');
        downloadBlob(blob, `qrcode-${item.shortCode}.png`);
      } else if (format === 'jpeg') {
        const pngBlob = await qrcodesApi.getQrCodeImageBlob(item.shortCode, 'png');
        const img = new Image();
        img.src = URL.createObjectURL(pngBlob);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((jpegBlob) => {
              if (jpegBlob) downloadBlob(jpegBlob, `qrcode-${item.shortCode}.jpeg`);
            }, 'image/jpeg');
          }
        };
      }
    } catch {
      toast.error(`Failed to download ${format.toUpperCase()}`);
    }
  };

  return (
    <div className={`flex items-center ${gapClass} shrink-0 self-start text-[#273144] dark:text-slate-200`}>
      {/* 1. Edit Content Button */}
      <button
        type="button"
        onClick={() => router.push(`/qrcodes/${item.shortCode}/edit`)}
        title="Edit Content"
        className="p-1.5 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <Edit2 className={iconSize} />
      </button>

      {/* 2. Download Dropdown */}
      <div className="relative" ref={downloadMenuRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsDownloadMenuOpen(!isDownloadMenuOpen);
          }}
          title="Download QR Code"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDownloadMenuOpen
              ? 'text-[#273144] bg-slate-100 dark:bg-slate-800 dark:text-blue-400 font-bold'
              : 'text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Download className={iconSize} />
        </button>

        {isDownloadMenuOpen && (
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="download-menu-button"
            className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-md border border-slate-200/90 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => handleDownload('png')}
              className="w-full px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              Download PNG
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleDownload('svg')}
              className="w-full px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              Download SVG
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => handleDownload('jpeg')}
              className="w-full px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              Download JPEG
            </button>
          </div>
        )}
      </div>

      {/* 3. Analytics / View Details */}
      <button
        type="button"
        onClick={() => router.push(`/qrcodes/${item.shortCode}/details`)}
        title="View details"
        className="p-1.5 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <BarChart2 className={iconSize} />
      </button>

      {/* 4. Overflow Menu */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          title="More options"
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isMenuOpen
              ? 'text-[#2a5bd7] bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400 font-bold'
              : 'text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <MoreHorizontal className={iconSize} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-md border border-slate-200/90 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
            {/* Item 1: Customize */}
            <button
              id="dropdown-item-customize"
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                router.push(`/qrcodes/${item.shortCode}/edit/customize?from=list`);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <Palette className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
              <span>Customize</span>
            </button>

            {/* Item 2: Duplicate design */}
            <button
              id="dropdown-item-duplicate-design"
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                const targetCode = prompt("Enter the short code of the link you want to apply this design to:");
                if (targetCode && targetCode.trim()) {
                  duplicateMutation.mutate({ code: item.shortCode, targetShortCode: targetCode.trim() });
                }
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <Copy className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
              <span>Duplicate design</span>
            </button>

            {/* Item 3: Hide/Unhide QR Code */}
            {item.isHidden ? (
              <button
                id="dropdown-item-unhide-qr-code"
                type="button"
                onClick={async () => {
                  setIsMenuOpen(false);
                  await updateMutation.mutateAsync({ code: item.shortCode, payload: { isHidden: false } });
                  queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
                  queryClient.invalidateQueries({ queryKey: ['links'] });
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <Eye className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                <span>Unhide QR Code</span>
              </button>
            ) : (
              <button
                id="dropdown-item-hide-qr-code"
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenHideModal();
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <EyeOff className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                <span>Hide QR Code</span>
              </button>
            )}

            {/* Item 4: Short link details (Only when visibleAsLink is true) */}
            {isVisibleLink && (
              <Link
                id="dropdown-item-short-link-details"
                href={`/links/${item.shortCode}/details`}
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 20 20" height="18" width="18" aria-hidden="true" className="shrink-0 fill-[#273144] dark:fill-slate-200">
                  <path d="M4.917 8.833c-.5-.583-.75-1.25-.75-1.916 0-.75.25-1.417.833-1.917 1-1 2.833-1 3.833 0l1.834 1.833a.805.805 0 001.166 0 .805.805 0 000-1.166L10 3.75C9.167 3 8 2.5 6.833 2.5c-1.166 0-2.25.5-3.083 1.25-.833.833-1.25 2-1.25 3.167 0 1.166.417 2.25 1.25 3.083l1.833 1.833a.9.9 0 00.584.25.9.9 0 00.583-.25.805.805 0 000-1.166L4.917 8.833zM16.25 10l-1.833-1.833a.806.806 0 00-1.167 0 .806.806 0 000 1.166l1.833 1.917c.5.5.834 1.167.834 1.917s-.25 1.416-.834 1.916c-1.083 1.084-2.75 1.084-3.833 0L9.417 13.25a.806.806 0 00-1.167 0 .806.806 0 000 1.167l1.833 1.833c.834.833 2 1.25 3.084 1.25 1.083 0 2.25-.417 3.083-1.25.833-.833 1.25-1.917 1.25-3.083 0-1.25-.417-2.334-1.25-3.167z" />
                  <path d="M12.25 12.25a.756.756 0 01-.583.25.757.757 0 01-.584-.25L7.75 8.917a.806.806 0 010-1.167.806.806 0 011.167 0l3.333 3.333a.806.806 0 010 1.167z" />
                </svg>
                <span>Short link details</span>
              </Link>
            )}

            <hr className="my-1 border-t border-slate-100 dark:border-slate-800" />

            {/* Item 5: Delete */}
            <button
              id="dropdown-item-delete"
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                if (onDelete) onDelete(item.id);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
