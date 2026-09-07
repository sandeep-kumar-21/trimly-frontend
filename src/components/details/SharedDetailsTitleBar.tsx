'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit2, Share2, MoreHorizontal, Download, Eye, EyeOff, Trash2, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { linksApi } from '@/lib/api/links.api';
import { qrcodesApi } from '@/lib/api/qrcodes.api';
import { HideModal } from '@/components/modals/HideModal';
import { ShareModal } from '@/components/modals/ShareModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';
import { Dropdown } from '@/components/ui/Dropdown';

export interface SharedDetailsTitleBarProps {
  type: 'link' | 'qrcode';
  title: string;
  shortCode: string;
  faviconDomain?: string;
  isHidden?: boolean;
  visibleAsLink?: boolean;
  linkId?: string;
}

export const SharedDetailsTitleBar: React.FC<SharedDetailsTitleBarProps> = ({
  type,
  title,
  shortCode,
  faviconDomain = 'www.amazon.in',
  isHidden = false,
  visibleAsLink = true,
  linkId,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isQrMode = type === 'qrcode';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  const editHref = isQrMode ? `/qrcodes/${shortCode}/edit` : `/links/${shortCode}/edit`;

  useEffect(() => {
    if (shortCode) {
      router.prefetch(editHref);
      if (isQrMode) {
        router.prefetch(`/qrcodes/${shortCode}/edit/customize?from=details`);
      }
    }
  }, [shortCode, isQrMode, editHref, router]);

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

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

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

  const handleHideConfirm = async () => {
    setIsActionLoading(true);
    try {
      await linksApi.updateLink(shortCode, { isHidden: !isHidden });
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['qr', shortCode] });
      queryClient.invalidateQueries({ queryKey: ['link', shortCode] });
      queryClient.invalidateQueries({ queryKey: ['qrcode-single-detail', shortCode] });
      setIsHideModalOpen(false);
      toast.success(!isHidden ? 'Link hidden successfully!' : 'Link unhidden successfully!');
    } catch {
      toast.error('Failed to update link');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsActionLoading(true);
    try {
      await linksApi.deleteLink(shortCode);
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
      queryClient.invalidateQueries({ queryKey: ['links'] });
      setIsDeleteModalOpen(false);
      toast.success(isQrMode ? 'QR Code deleted successfully' : 'Link deleted successfully');
      router.push(isQrMode ? '/qrcodes' : '/links');
    } catch {
      toast.error(isQrMode ? 'Failed to delete QR Code' : 'Failed to delete link');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-1 sm:py-2">
        {/* Left Side: Back Arrow + Favicon/Icon + Title */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
          <Link
            href={isQrMode ? '/qrcodes' : '/links'}
            aria-label={isQrMode ? 'Back to QR codes list' : 'Back to links list'}
            className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          {!isQrMode && (
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200/60 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
              <img
                src={`https://icons.duckduckgo.com/ip2/${faviconDomain}.ico`}
                alt="Favicon"
                className="h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-[#273144] dark:text-slate-100 truncate">
            {title}
          </h1>
        </div>

        {/* Right Side Actions Bar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-center">
          {/* More Options Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="More options"
              className={`h-9 w-9 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                isMenuOpen
                  ? 'text-[#2a5bd7] bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800'
                  : 'text-[#273144] border-transparent hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-full z-50 mt-1.5 w-56 rounded-md border border-slate-200/90 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                {isQrMode ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push(`/qrcodes/${shortCode}/edit/customize?from=details`);
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      <Palette className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                      <span>Customize</span>
                    </button>
                    {visibleAsLink !== false ? (
                      <button
                        type="button"
                        onClick={async () => {
                          setIsMenuOpen(false);
                          try {
                            await linksApi.updateLink(shortCode, { visibleAsLink: false });
                            queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
                            queryClient.invalidateQueries({ queryKey: ['links'] });
                            queryClient.invalidateQueries({ queryKey: ['qr', shortCode] });
                            queryClient.invalidateQueries({ queryKey: ['link', shortCode] });
                            queryClient.invalidateQueries({ queryKey: ['qrcode-single-detail', shortCode] });
                            toast.success('Link hidden successfully!');
                          } catch {
                            toast.error('Failed to hide link');
                          }
                        }}
                        className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                      >
                        <EyeOff className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                        <span>Hide link</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={async () => {
                          setIsMenuOpen(false);
                          try {
                            await linksApi.promoteToLink(shortCode);
                            queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
                            queryClient.invalidateQueries({ queryKey: ['links'] });
                            queryClient.invalidateQueries({ queryKey: ['qr', shortCode] });
                            queryClient.invalidateQueries({ queryKey: ['link', shortCode] });
                            queryClient.invalidateQueries({ queryKey: ['qrcode-single-detail', shortCode] });
                            toast.success('Link unhidden successfully!');
                          } catch {
                            toast.error('Failed to unhide link');
                          }
                        }}
                        className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                      >
                        <Eye className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                        <span>Unhide link</span>
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsHideModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                    >
                      {isHidden ? (
                        <>
                          <Eye className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                          <span>Unhide link</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                          <span>Hide link</span>
                        </>
                      )}
                    </button>
                  </>
                )}
                <hr className="my-1 border-t border-slate-100 dark:border-slate-800" />
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Edit Button */}
          {isQrMode ? (
            <Link
              href={editHref}
              prefetch={true}
              className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-md border border-slate-200 bg-white font-bold text-xs sm:text-sm text-[#273144] hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5 sm:gap-2 cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Edit</span>
            </Link>
          ) : (
            <Link
              href={editHref}
              prefetch={true}
              className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-md border border-slate-200 bg-white font-bold text-xs sm:text-sm text-[#273144] hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5 sm:gap-2 cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              title="Edit link"
            >
              <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Edit</span>
            </Link>
          )}

          {/* Download Button for QR Mode / Share Button for Link Mode */}
          {isQrMode ? (
            <Dropdown
              trigger={
                <div className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-md border border-slate-200 bg-white font-bold text-xs sm:text-sm text-[#273144] hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5 sm:gap-2 cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Download</span>
                </div>
              }
              items={[
                { label: 'Download PNG', onClick: () => handleDownload('png') },
                { label: 'Download SVG', onClick: () => handleDownload('svg') },
                { label: 'Download JPEG', onClick: () => handleDownload('jpeg') },
              ]}
              align="right"
            />
          ) : (
            <button
              type="button"
              onClick={handleShare}
              className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-md bg-[#2a5bd7] text-white font-bold text-xs sm:text-sm hover:bg-[#1a4bb7] transition-colors shadow-2xs flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Share</span>
            </button>
          )}
        </div>
      </div>

      <HideModal
        isOpen={isHideModalOpen}
        onClose={() => setIsHideModalOpen(false)}
        onConfirm={handleHideConfirm}
        type={isQrMode ? 'link' : type}
        isHidden={isQrMode ? false : isHidden}
        isLoading={isActionLoading}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        type={type}
        itemName={title}
        isLoading={isActionLoading}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shortCode={shortCode}
        title={title}
      />
    </>
  );
};
