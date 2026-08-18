'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Edit2,
  Download,
  BarChart2,
  MoreHorizontal,
  CornerDownRight,
  Calendar,
  Tag,
  PlusCircle,
  Palette,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Globe,
  Check,
} from 'lucide-react';
import { QrCodeIcon } from '@/components/icons/AppIcons';
import { HideModal } from '@/components/modals/HideModal';
import { TagInput } from '../links/TagInput';
import { formatDate } from '@/lib/utils/formatDate';
import { toast } from 'sonner';
import { qrcodesApi } from '@/lib/api/qrcodes.api';
import { linksApi } from '@/lib/api/links.api';
import { useDuplicateQrCode, useUpdateQrCode } from '@/hooks/useQRCodes';
import { useBulkLinks } from '@/hooks/useBulkLinks';
import { useQueryClient } from '@tanstack/react-query';

export interface QrCodeItem {
  id: string;
  linkId?: string;
  title: string;
  destinationUrl: string;
  shortCode: string;
  createdAt: string;
  scansCount?: number;
  tags?: string[];
  typeBadge?: string;
  visibleAsLink?: boolean;
  isHidden?: boolean;
  expiresAt?: string | null;
  shortUrl?: string | null;
  svg?: string | null;
  svgUrl?: string | null;
  qrConfig?: {
    dotsStyle?: string;
    cornersStyle?: string;
    cornersDotStyle?: string;
    dotsColor?: string;
    backgroundColor?: string;
    logoUrl?: string | null;
    centerText?: string | null;
  };
}

export interface QrCodeCardProps {
  item: QrCodeItem;
  onDelete?: (id: string) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export const QrCodeCard: React.FC<QrCodeCardProps> = ({ item, onDelete, isSelected, onToggleSelect }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  const [isHideModalOpen, setIsHideModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

  const duplicateMutation = useDuplicateQrCode();
  const updateMutation = useUpdateQrCode();
  const { bulkUpdateTags } = useBulkLinks();

  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const tagMenuRef = useRef<HTMLDivElement>(null);

  const isVisibleLink = item.visibleAsLink !== false;
  const shortUrl = item.shortUrl || `/${item.shortCode}`;
  const displayShortCode = `trim.ly/${item.shortCode}`;
  const formattedDate = formatDate(item.createdAt);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePromoteToLink = async () => {
    try {
      setIsPromoting(true);
      await linksApi.promoteToLink(item.shortCode);
      toast.success('Successfully created short link for this QR Code!');
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
      queryClient.invalidateQueries({ queryKey: ['links'] });
    } catch {
      toast.error('Failed to promote QR Code to short link');
    } finally {
      setIsPromoting(false);
    }
  };

  useEffect(() => {
    if (item.shortCode) {
      router.prefetch(`/qrcodes/${item.shortCode}/details`);
      router.prefetch(`/links/${item.shortCode}/details`);
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
      if (tagMenuRef.current && !tagMenuRef.current.contains(e.target as Node)) {
        setIsTagMenuOpen(false);
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsDownloadMenuOpen(false);
        setIsTagMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [item.shortCode, router]);

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
        const url = URL.createObjectURL(pngBlob);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width || 1000;
          canvas.height = img.height || 1000;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = item.qrConfig?.backgroundColor || '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                  downloadBlob(blob, `qrcode-${item.shortCode}.jpg`);
                }
                URL.revokeObjectURL(url);
            }, 'image/jpeg', 0.95);
          }
        };
        img.src = url;
      }
    } catch {
      toast.error('Failed to download QR code');
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullUrl = item.shortUrl || `http://localhost:4000/${item.shortCode}`;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        setCopied(true);
        toast.success('Link copied to clipboard!', { description: fullUrl });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  const handleAddTag = async (tag: string) => {
    if (item.linkId) {
      await bulkUpdateTags({ linkIds: [item.linkId], addTags: [tag] });
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (item.linkId) {
      await bulkUpdateTags({ linkIds: [item.linkId], removeTags: [tag] });
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    }
  };

  const normalizedSvg = React.useMemo(() => {
    if (!item.svg) return null;
    let svg = item.svg;
    if (!svg.includes('viewBox')) {
      svg = svg.replace(
        /<svg\s+([^>]*?)width="(\d+)"\s+height="(\d+)"([^>]*?)>/i,
        '<svg $1viewBox="0 0 $2 $3" width="100%" height="100%"$4>'
      );
    }
    const sfx = `_${item.shortCode || item.id}`;
    if (!svg.includes(sfx)) {
      svg = svg.replace(/id="([^"]+)"/g, `id="$1${sfx}"`);
      svg = svg.replace(/url\('#([^']+)'\)/g, `url('#$1${sfx}')`);
      svg = svg.replace(/url\(#([^)]+)\)/g, `url(#$1${sfx})`);
      svg = svg.replace(/href="#([^"]+)"/g, `href="#$1${sfx}"`);
      svg = svg.replace(/xlink:href="#([^"]+)"/g, `xlink:href="#$1${sfx}"`);
    }
    return svg;
  }, [item.svg, item.shortCode, item.id]);

  return (
    <div className={`rounded-xl border p-5 sm:p-6 shadow-2xs transition-all flex flex-col md:flex-row gap-5 items-start relative ${isSelected ? 'bg-[#f0f5ff] border-[#2a5bd7] dark:bg-[#1e293b]/80 dark:border-blue-500' : 'bg-white border-slate-200/90 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'} ${isMenuOpen || isDownloadMenuOpen ? 'z-30' : 'z-10'}`}>
      {onToggleSelect && (
        <button
          type="button"
          onClick={() => onToggleSelect(item.id)}
          className="mt-1 flex items-center justify-center cursor-pointer transition-all select-none shrink-0"
        >
          {isSelected ? (
            <div className="flex h-4.5 w-4.5 items-center justify-center rounded-xs bg-[#2a5bd7] text-white shadow-2xs">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 4L3.5 6.5L9 1" />
              </svg>
            </div>
          ) : (
            <div className="h-4.5 w-4.5 rounded-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-[#2a5bd7] transition-colors" />
          )}
        </button>
      )}
      <div className="flex flex-col items-center justify-center shrink-0">
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

      <div className="flex-1 space-y-3 w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 min-w-0">
          <div className="space-y-1 min-w-0 flex-1">
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

            <h2
              onClick={() => router.push(`/qrcodes/${item.shortCode}/details`)}
              className="text-lg sm:text-xl font-bold text-[#273144] dark:text-slate-100 hover:text-[#2a5bd7] transition-colors cursor-pointer leading-tight truncate"
            >
              {item.title || `Untitled ${formattedDate}`}
            </h2>
          </div>

          {/* Borderless Action Icons Row matching Bitly exact design */}
          <div className="flex items-center gap-3 sm:gap-3.5 shrink-0 self-start text-[#273144] dark:text-slate-200">
            <button
              type="button"
              onClick={() => router.push(`/qrcodes/${item.shortCode}/edit`)}
              title="Edit Content"
              className="p-1.5 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Edit2 className="h-4.5 w-4.5" />
            </button>

            {/* Download Dropdown Container */}
            <div className="relative" ref={downloadMenuRef}>
              <button
                type="button"
                onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                title="Download QR Code"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDownloadMenuOpen
                    ? 'text-[#273144] bg-slate-100 dark:bg-slate-800 dark:text-blue-400 font-bold'
                    : 'text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
              >
                <Download className="h-4.5 w-4.5" />
              </button>

              {/* Download Dropdown Panel */}
              {isDownloadMenuOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="download-menu-button"
                  data-testid="overflow-panel"
                  className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-lg border border-slate-200/90 bg-white py-1 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100"
                >
                  <button
                    type="button"
                    role="menuitem"
                    data-testid="overflow-item"
                    onClick={() => handleDownload('png')}
                    className="w-full px-4 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-[#f0f4fa] dark:text-slate-200 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                  >
                    Download PNG
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    data-testid="overflow-item"
                    onClick={() => handleDownload('svg')}
                    className="w-full px-4 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-[#f0f4fa] dark:text-slate-200 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                  >
                    Download SVG
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    data-testid="overflow-item"
                    onClick={() => handleDownload('jpeg')}
                    className="w-full px-4 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-[#f0f4fa] dark:text-slate-200 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                  >
                    Download JPEG
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => router.push(`/qrcodes/${item.shortCode}/details`)}
              title="View details"
              className="p-1.5 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <BarChart2 className="h-4.5 w-4.5" />
            </button>

            {/* Overflow Options Dropdown Button */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                title="More options"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isMenuOpen
                    ? 'text-[#2a5bd7] bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400 font-bold'
                    : 'text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
              >
                <MoreHorizontal className="h-4.5 w-4.5" />
              </button>

              {/* BITLY EXACT MATCH: CLEAN DROPDOWN CONTAINER (Less Rounded, Pure White Item Backgrounds) */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100">
                  {/* Item 1: Customize */}
                  <button
                    id="dropdown-item-customize"
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push(`/qrcodes/${item.shortCode}/edit/customize?from=list`);
                    }}
                    className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
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
                    className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
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
                      className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
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
                        setIsHideModalOpen(true);
                      }}
                      className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
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
                      className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <svg viewBox="0 0 20 20" height="18" width="18" aria-hidden="true" className="shrink-0 fill-[#273144] dark:fill-slate-200">
                        <path d="M4.917 8.833c-.5-.583-.75-1.25-.75-1.916 0-.75.25-1.417.833-1.917 1-1 2.833-1 3.833 0l1.834 1.833a.805.805 0 001.166 0 .805.805 0 000-1.166L10 3.75C9.167 3 8 2.5 6.833 2.5c-1.166 0-2.25.5-3.083 1.25-.833.833-1.25 2-1.25 3.167 0 1.166.417 2.25 1.25 3.083l1.833 1.833a.9.9 0 00.584.25.9.9 0 00.583-.25.805.805 0 000-1.166L4.917 8.833zM16.25 10l-1.833-1.833a.806.806 0 00-1.167 0 .806.806 0 000 1.166l1.833 1.917c.5.5.834 1.167.834 1.917s-.25 1.416-.834 1.916c-1.083 1.084-2.75 1.084-3.833 0L9.417 13.25a.806.806 0 00-1.167 0 .806.806 0 000 1.167l1.833 1.833c.834.833 2 1.25 3.084 1.25 1.083 0 2.25-.417 3.083-1.25.833-.833 1.25-1.917 1.25-3.083 0-1.25-.417-2.334-1.25-3.167z" />
                        <path d="M12.25 12.25a.756.756 0 01-.583.25.757.757 0 01-.584-.25L7.75 8.917a.806.806 0 010-1.167.806.806 0 011.167 0l3.333 3.333a.806.806 0 010 1.167z" />
                      </svg>
                      <span>Short link details</span>
                    </Link>
                  )}

                  {/* Divider Line */}
                  <hr className="my-1 border-slate-100 dark:border-slate-800" />

                  {/* Item 5: Delete */}
                  <button
                    id="dropdown-item-delete"
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onDelete) onDelete(item.id);
                    }}
                    className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-red-50 hover:text-red-600 dark:text-slate-200 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Long Destination URL Row with CornerDownRight icon and proper text truncation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#526281] dark:text-slate-400 font-medium w-full min-w-0">
          <CornerDownRight className="h-4 w-4 shrink-0 text-slate-400" />
          <a
            href={item.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate flex-1 min-w-0 hover:underline hover:text-[#2a5bd7] transition-colors"
          >
            {item.destinationUrl}
          </a>
        </div>

        {/* Bottom Meta Information Row matching Bitly exact HTML */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-[#526281] dark:text-slate-400 font-semibold min-w-0">
          {/* Scans Badge */}
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <span>scans</span>
          </span>

          <span>•</span>

          {/* Date */}
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </span>

          <span>•</span>

          {/* Short Link or Make this a link button */}
          {isVisibleLink ? (
            <>
              <span className="inline-flex items-center gap-1">
                <svg viewBox="0 0 20 20" height="14" width="14" aria-hidden="true" className="fill-slate-400">
                  <path d="M4.917 8.833c-.5-.583-.75-1.25-.75-1.916 0-.75.25-1.417.833-1.917 1-1 2.833-1 3.833 0l1.834 1.833a.805.805 0 001.166 0 .805.805 0 000-1.166L10 3.75C9.167 3 8 2.5 6.833 2.5c-1.166 0-2.25.5-3.083 1.25-.833.833-1.25 2-1.25 3.167 0 1.166.417 2.25 1.25 3.083l1.833 1.833a.9.9 0 00.584.25.9.9 0 00.583-.25.805.805 0 000-1.166L4.917 8.833zM16.25 10l-1.833-1.833a.806.806 0 00-1.167 0 .806.806 0 000 1.166l1.833 1.917c.5.5.834 1.167.834 1.917s-.25 1.416-.834 1.916c-1.083 1.084-2.75 1.084-3.833 0L9.417 13.25a.806.806 0 00-1.167 0 .806.806 0 000 1.167l1.833 1.833c.834.833 2 1.25 3.084 1.25 1.083 0 2.25-.417 3.083-1.25.833-.833 1.25-1.917 1.25-3.083 0-1.25-.417-2.334-1.25-3.167z" />
                  <path d="M12.25 12.25a.756.756 0 01-.583.25.757.757 0 01-.584-.25L7.75 8.917a.806.806 0 010-1.167.806.806 0 011.167 0l3.333 3.333a.806.806 0 010 1.167z" />
                </svg>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2a5bd7] hover:underline"
                >
                  {displayShortCode}
                </a>
              </span>

              <button
                type="button"
                onClick={handleCopy}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer ml-1"
                title="Copy short link"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handlePromoteToLink}
              disabled={isPromoting}
              className="text-[#2a5bd7] hover:underline font-semibold cursor-pointer disabled:opacity-50"
            >
              {isPromoting ? 'Creating link...' : 'Make this a link'}
            </button>
          )}

          <span>•</span>

          {/* Tags Section */}
          <div className="group/tags inline-flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              {item.tags && item.tags.length > 0 ? (
                <span className="flex items-center gap-1.5 flex-wrap">
                  {item.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center rounded-sm bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {tag}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-xs text-slate-400 font-normal">No tags</span>
              )}
            </span>

            <div className="relative shrink-0" ref={tagMenuRef}>
              <button
                type="button"
                onClick={() => setIsTagMenuOpen(!isTagMenuOpen)}
                className={`inline-flex items-center gap-1 text-[#2a5bd7] font-semibold text-xs hover:underline cursor-pointer transition-opacity duration-200 ${
                  isTagMenuOpen ? 'opacity-100' : 'opacity-0 group-hover/tags:opacity-100'
                }`}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add tag</span>
              </button>
              {isTagMenuOpen && (
                <div className="absolute left-0 bottom-full mb-1 z-50">
                  <TagInput
                    selectedTags={item.tags || []}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <HideModal
        isOpen={isHideModalOpen}
        onClose={() => setIsHideModalOpen(false)}
        onConfirm={() => {
          setIsHideModalOpen(false);
          updateMutation.mutate({ code: item.shortCode, payload: { isHidden: true } });
        }}
        type="qrcode"
      />
    </div>
  );
};
