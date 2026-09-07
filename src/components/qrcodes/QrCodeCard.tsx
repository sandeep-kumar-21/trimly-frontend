'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CornerDownRight } from 'lucide-react';
import { HideModal } from '@/components/modals/HideModal';
import { formatDate } from '@/lib/utils/formatDate';
import { useUpdateQrCode } from '@/hooks/useQRCodes';
import { QrCodeCardBadge } from './card/QrCodeCardBadge';
import { Checkbox } from '@/components/ui/Checkbox';
import { QrCodeCardPreview } from './card/QrCodeCardPreview';
import { QrCodeCardActions } from './card/QrCodeCardActions';
import { QrCodeCardMeta } from './card/QrCodeCardMeta';

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

export const QrCodeCard: React.FC<QrCodeCardProps> = ({
  item,
  onDelete,
  isSelected,
  onToggleSelect,
}) => {
  const router = useRouter();
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);
  const updateMutation = useUpdateQrCode();

  const isVisibleLink = item.visibleAsLink !== false;
  const formattedDate = formatDate(item.createdAt);

  useEffect(() => {
    if (item.shortCode) {
      router.prefetch(`/qrcodes/${item.shortCode}/details`);
      router.prefetch(`/links/${item.shortCode}/details`);
    }
  }, [item.shortCode, router]);

  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 md:px-5.5 md:py-4.5 shadow-2xs transition-all flex flex-col md:flex-row gap-4 md:gap-5 items-start relative ${
        isSelected
          ? 'bg-[#f0f5ff] border-[#2a5bd7] dark:bg-[#1e293b]/80 dark:border-blue-500'
          : 'bg-white border-slate-200/90 hover:shadow-md dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      {/* ==================================================== */}
      {/* MOBILE TOP ROW (< md:): Badge on left, Actions on right */}
      {/* ==================================================== */}
      <div className="flex md:hidden items-center justify-between w-full">
        <div className="flex items-center gap-2.5">
          {onToggleSelect && (
            <button
              type="button"
              onClick={() => onToggleSelect(item.id)}
              className="flex items-center justify-center cursor-pointer transition-all select-none shrink-0"
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
          <QrCodeCardBadge isVisibleLink={isVisibleLink} />
        </div>

        {/* Mobile Actions Top-Right */}
        <QrCodeCardActions
          item={item}
          onDelete={onDelete}
          onOpenHideModal={() => setIsHideModalOpen(true)}
          isMobile={true}
        />
      </div>

      {/* ==================================================== */}
      {/* DESKTOP CHECKBOX (md:flex hidden on mobile) */}
      {/* ==================================================== */}
      {onToggleSelect && (
        <button
          type="button"
          onClick={() => onToggleSelect(item.id)}
          className="mt-1 hidden md:flex items-center justify-center cursor-pointer transition-all select-none shrink-0"
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

      {/* ==================================================== */}
      {/* QR CODE CONTAINER (Centered on mobile, left on desktop) */}
      {/* ==================================================== */}
      <QrCodeCardPreview svg={item.svg} shortCode={item.shortCode} id={item.id} />

      {/* ==================================================== */}
      {/* CARD BODY CONTENT */}
      {/* ==================================================== */}
      <div className="flex-1 space-y-2.5 sm:space-y-3 w-full min-w-0">
        {/* Desktop Header Row (md:flex hidden on mobile) */}
        <div className="hidden md:flex items-start justify-between gap-3 min-w-0">
          <div className="space-y-1 min-w-0 flex-1">
            <QrCodeCardBadge isVisibleLink={isVisibleLink} />

            <h2
              onClick={() => router.push(`/qrcodes/${item.shortCode}/details`)}
              className="text-lg sm:text-xl font-bold text-[#273144] dark:text-slate-100 hover:text-[#2a5bd7] transition-colors cursor-pointer leading-tight truncate"
            >
              {item.title || `Untitled ${formattedDate}`}
            </h2>
          </div>

          {/* Desktop Action Icons */}
          <QrCodeCardActions
            item={item}
            onDelete={onDelete}
            onOpenHideModal={() => setIsHideModalOpen(true)}
            isMobile={false}
          />
        </div>

        {/* Mobile Title Row (< md: only) */}
        <div className="md:hidden">
          <h2
            onClick={() => router.push(`/qrcodes/${item.shortCode}/details`)}
            className="text-base sm:text-lg font-bold text-[#273144] dark:text-slate-100 hover:text-[#2a5bd7] transition-colors cursor-pointer leading-tight truncate block"
          >
            {item.title || `Untitled ${formattedDate}`}
          </h2>
        </div>

        {/* Long Destination URL Row */}
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

        {/* Bottom Meta Information Row */}
        <QrCodeCardMeta
          item={item}
          formattedDate={formattedDate}
          isVisibleLink={isVisibleLink}
        />
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
