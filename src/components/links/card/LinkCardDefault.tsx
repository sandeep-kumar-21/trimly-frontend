'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Copy,
  Check,
  Edit2,
  Share2,
  BarChart2,
  CornerDownRight,
  Calendar,
  Globe,
  Lock,
} from 'lucide-react';
import { formatDate } from '@/lib/utils/formatDate';
import { formatNumber } from '@/lib/utils/formatNumber';
import { ShortLink } from '@/types/link.types';
import { Checkbox } from '@/components/ui/Checkbox';
import { LinkMenuDropdown } from './LinkMenuDropdown';
import { LinkTagsSection } from './LinkTagsSection';

export interface LinkCardDefaultProps {
  link: ShortLink;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  shortUrl: string;
  displayShortCode: string;
  copied: boolean;
  onCopy: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  isMenuOpen: boolean;
  onToggleMenu: (e: React.MouseEvent) => void;
  onCloseMenu: () => void;
  mobileMenuRef: React.RefObject<HTMLDivElement | null>;
  desktopMenuRef: React.RefObject<HTMLDivElement | null>;
  isTagMenuOpen: boolean;
  onToggleTagMenu: (e: React.MouseEvent) => void;
  mobileTagMenuRef: React.RefObject<HTMLDivElement | null>;
  desktopTagMenuRef: React.RefObject<HTMLDivElement | null>;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onOpenHideModal: () => void;
  onOpenDeleteModal: () => void;
  faviconDomain: string;
}

export const LinkCardDefault: React.FC<LinkCardDefaultProps> = ({
  link,
  isSelected = false,
  onToggleSelect,
  shortUrl,
  displayShortCode,
  copied,
  onCopy,
  onShare,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  mobileMenuRef,
  desktopMenuRef,
  isTagMenuOpen,
  onToggleTagMenu,
  mobileTagMenuRef,
  desktopTagMenuRef,
  onAddTag,
  onRemoveTag,
  onOpenHideModal,
  onOpenDeleteModal,
  faviconDomain,
}) => {
  const router = useRouter();

  return (
    <div
      className={`group rounded-xl border p-4 sm:px-5.5 sm:py-4.5 shadow-2xs transition-all space-y-2.5 sm:space-y-3 relative ${
        isSelected
          ? 'bg-[#f0f5ff] border-[#2a5bd7] dark:bg-[#1e293b]/80 dark:border-blue-500'
          : 'bg-white border-slate-200/90 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
      } ${isMenuOpen ? 'z-30' : 'z-10'}`}
    >
      {/* ==================================================== */}
      {/* MOBILE TOP ROW (< sm:): Checkbox on left, Share & More on right */}
      {/* ==================================================== */}
      <div className="flex sm:hidden items-center justify-between">
        <button
          type="button"
          onClick={() => onToggleSelect && onToggleSelect(link._id || link.shortCode)}
          className="flex items-center justify-center cursor-pointer select-none shrink-0"
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

        <div className="flex items-center gap-1 text-[#273144] dark:text-slate-200">
          <button
            type="button"
            onClick={onShare}
            className="p-1.5 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>

          <LinkMenuDropdown
            isOpen={isMenuOpen}
            onToggle={onToggleMenu}
            onClose={onCloseMenu}
            menuRef={mobileMenuRef}
            shortCode={link.shortCode}
            isHidden={link.isHidden}
            onOpenHideModal={onOpenHideModal}
            onOpenDeleteModal={onOpenDeleteModal}
            buttonClassName="p-1.5"
          />
        </div>
      </div>

      {/* ==================================================== */}
      {/* DESKTOP HEADER ROW (sm:flex hidden on mobile) */}
      {/* ==================================================== */}
      <div className="hidden sm:flex items-start gap-3.5">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggleSelect && onToggleSelect(link._id || link.shortCode)}
          className="mt-1 flex items-center justify-center cursor-pointer select-none shrink-0"
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

        {/* Favicon Container */}
        <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border border-slate-200/60 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
          {faviconDomain ? (
            <img
              src={`https://icons.duckduckgo.com/ip2/${faviconDomain}.ico`}
              alt=""
              className="h-4.5 w-4.5 rounded-xs"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <Globe className="h-4.5 w-4.5 text-slate-500" />
          )}
        </div>

        {/* Title & Short Link & Action Row */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-4">
            <Link
              href={`/links/${link.shortCode}`}
              className="font-bold text-[#273144] hover:underline dark:text-slate-100 text-base sm:text-[17px] leading-snug truncate"
            >
              {link.title || link.longUrl}
            </Link>

            {/* Action Buttons Header Row (Desktop only) */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0 text-[#273144] dark:text-slate-200">
              <button
                type="button"
                onClick={() => router.push(`/links/${link.shortCode}/edit`)}
                className="p-1.5 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Edit link"
              >
                <Edit2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onShare}
                className="p-1.5 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => router.push(`/links/${link.shortCode}/details`)}
                className="p-1.5 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="View details"
              >
                <BarChart2 className="h-4 w-4" />
              </button>

              <LinkMenuDropdown
                isOpen={isMenuOpen}
                onToggle={onToggleMenu}
                onClose={onCloseMenu}
                menuRef={desktopMenuRef}
                shortCode={link.shortCode}
                isHidden={link.isHidden}
                onOpenHideModal={onOpenHideModal}
                onOpenDeleteModal={onOpenDeleteModal}
                buttonClassName="p-1.5"
              />
            </div>
          </div>

          {/* Short URL Row on Desktop */}
          <div className="flex items-center gap-2 pt-0.5">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#2a5bd7] hover:underline text-sm truncate"
            >
              {displayShortCode}
            </a>
            <button
              type="button"
              onClick={onCopy}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer shrink-0"
              title="Copy short link"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MOBILE BODY (< sm:): Full-width Single-Line Title & Short URL */}
      {/* ==================================================== */}
      <div className="sm:hidden space-y-1">
        <Link
          href={`/links/${link.shortCode}`}
          className="font-bold text-[#273144] hover:underline dark:text-slate-100 text-base leading-snug truncate block"
          title={link.title || link.longUrl}
        >
          {link.title || link.longUrl}
        </Link>

        <div className="flex items-center gap-2 pt-0.5">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#2a5bd7] hover:underline text-sm truncate"
          >
            {displayShortCode}
          </a>
          <button
            type="button"
            onClick={onCopy}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer shrink-0"
            title="Copy short link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Destination URL Line */}
      <div className="flex items-center gap-2 pl-0 sm:pl-12 pr-2 text-xs sm:text-sm text-[#526281] dark:text-slate-400 min-w-0">
        <CornerDownRight className="h-3.5 w-3.5 shrink-0 text-slate-400 hidden sm:inline-block" />
        <a
          href={link.longUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline truncate flex-1 min-w-0 font-normal"
          title={link.longUrl}
        >
          {link.longUrl}
        </a>
      </div>

      {/* Mobile Tags Row */}
      <div className="sm:hidden">
        <LinkTagsSection
          tags={link.tags}
          isOpen={isTagMenuOpen}
          onToggle={onToggleTagMenu}
          tagMenuRef={mobileTagMenuRef}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
          layout="stacked"
        />
      </div>

      {/* Card Footer: Click Data Badge & Date & Desktop Tags */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 pl-0 sm:pl-12 pt-2 sm:pt-1.5 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4 text-xs text-[#526281] dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-200">
            <Lock className="h-3 w-3 text-slate-400" />
            Click data
          </span>

          <span className="hidden sm:flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {formatDate(link.createdAt)}
          </span>

          <LinkTagsSection
            tags={link.tags}
            isOpen={isTagMenuOpen}
            onToggle={onToggleTagMenu}
            tagMenuRef={desktopTagMenuRef}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            layout="inline"
          />
        </div>

        {/* Date on Mobile (right-aligned) */}
        <span className="sm:hidden text-xs text-slate-400">
          {formatDate(link.createdAt)}
        </span>
      </div>
    </div>
  );
};
