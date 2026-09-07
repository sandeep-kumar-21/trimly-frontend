'use client';

import React from 'react';
import Link from 'next/link';
import { Copy, Check, Globe, Lock } from 'lucide-react';
import { ShortLink } from '@/types/link.types';
import { Checkbox } from '@/components/ui/Checkbox';
import { LinkMenuDropdown } from './LinkMenuDropdown';

export interface LinkCardCompactProps {
  link: ShortLink;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  shortUrl: string;
  displayShortCode: string;
  copied: boolean;
  onCopy: (e: React.MouseEvent) => void;
  isMenuOpen: boolean;
  onToggleMenu: (e: React.MouseEvent) => void;
  onCloseMenu: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onOpenHideModal: () => void;
  onOpenDeleteModal: () => void;
  faviconDomain: string;
}

export const LinkCardCompact: React.FC<LinkCardCompactProps> = ({
  link,
  isSelected = false,
  onToggleSelect,
  shortUrl,
  displayShortCode,
  copied,
  onCopy,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  menuRef,
  onOpenHideModal,
  onOpenDeleteModal,
  faviconDomain,
}) => {
  return (
    <div
      className={`group rounded-xl border p-2.5 sm:px-4 sm:py-2.5 shadow-2xs transition-all flex items-center justify-between gap-4 relative ${
        isSelected
          ? 'bg-[#f0f5ff] border-[#2a5bd7] dark:bg-[#1e293b]/80 dark:border-blue-500'
          : 'bg-white border-slate-200/90 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
      } ${isMenuOpen ? 'z-30' : 'z-10'}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
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

        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
          {faviconDomain ? (
            <img
              src={`https://icons.duckduckgo.com/ip2/${faviconDomain}.ico`}
              alt=""
              className="h-4 w-4 rounded-xs"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <Globe className="h-4 w-4 text-slate-500" />
          )}
        </div>

        {/* 1. Title Column (Consistent width across rows) */}
        <div className="w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 shrink-0 truncate">
          <Link
            href={`/links/${link.shortCode}`}
            className="font-bold text-[#273144] hover:underline dark:text-slate-100 truncate text-sm block"
            title={link.title || link.longUrl}
          >
            {link.title || link.longUrl}
          </Link>
        </div>

        <span className="text-slate-300 dark:text-slate-700 shrink-0">•</span>

        {/* 2. Short URL Column (Aligned in a vertical column) */}
        <div className="flex items-center gap-1.5 w-28 sm:w-32 md:w-36 shrink-0">
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
            title="Copy link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        <span className="text-slate-300 dark:text-slate-700 shrink-0 hidden md:inline">•</span>

        {/* 3. Destination URL Column (Fills remaining middle space) */}
        <div className="flex-1 min-w-0 hidden md:block">
          <span className="text-xs sm:text-sm text-slate-500 truncate block font-normal" title={link.longUrl}>
            {link.longUrl}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Lock className="h-3 w-3 text-slate-400" />
          Click data
        </span>

        <LinkMenuDropdown
          isOpen={isMenuOpen}
          onToggle={onToggleMenu}
          onClose={onCloseMenu}
          menuRef={menuRef}
          shortCode={link.shortCode}
          isHidden={link.isHidden}
          onOpenHideModal={onOpenHideModal}
          onOpenDeleteModal={onOpenDeleteModal}
        />
      </div>
    </div>
  );
};
