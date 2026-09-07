'use client';

import React from 'react';
import Link from 'next/link';
import { Copy, Check, Share2, Lock } from 'lucide-react';
import { ShortLink } from '@/types/link.types';
import { formatDate } from '@/lib/utils/formatDate';
import { formatNumber } from '@/lib/utils/formatNumber';
import { Checkbox } from '@/components/ui/Checkbox';
import { LinkMenuDropdown } from './LinkMenuDropdown';
import { LinkTagsSection } from './LinkTagsSection';

export interface LinkCardGridProps {
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
  menuRef: React.RefObject<HTMLDivElement | null>;
  isTagMenuOpen: boolean;
  onToggleTagMenu: (e: React.MouseEvent) => void;
  tagMenuRef: React.RefObject<HTMLDivElement | null>;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onOpenHideModal: () => void;
  onOpenDeleteModal: () => void;
}

export const LinkCardGrid: React.FC<LinkCardGridProps> = ({
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
  menuRef,
  isTagMenuOpen,
  onToggleTagMenu,
  tagMenuRef,
  onAddTag,
  onRemoveTag,
  onOpenHideModal,
  onOpenDeleteModal,
}) => {
  return (
    <div
      className={`group rounded-xl border p-3.5 sm:p-4 shadow-2xs transition-all flex flex-col justify-between space-y-2.5 relative ${
        isSelected
          ? 'bg-[#f0f5ff] border-[#2a5bd7] dark:bg-[#1e293b]/80 dark:border-blue-500'
          : 'bg-white border-slate-200/90 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
      } ${isMenuOpen ? 'z-30' : 'z-10'}`}
    >
      <div className="space-y-1.5 min-w-0">
        {/* Top Row: Checkbox on left, Share & More on right */}
        <div className="flex items-center justify-between">
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

          <div className="flex items-center gap-2.5 text-[#273144] dark:text-slate-200">
            <button
              type="button"
              onClick={onShare}
              className="p-1 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>

            <LinkMenuDropdown
              isOpen={isMenuOpen}
              onToggle={onToggleMenu}
              onClose={onCloseMenu}
              menuRef={menuRef}
              shortCode={link.shortCode}
              isHidden={link.isHidden}
              onOpenHideModal={onOpenHideModal}
              onOpenDeleteModal={onOpenDeleteModal}
              buttonClassName="p-1"
            />
          </div>
        </div>

        {/* Title (Single-line) */}
        <Link
          href={`/links/${link.shortCode}`}
          className="font-bold text-[#273144] hover:underline dark:text-slate-100 truncate text-base block min-w-0 mt-1.5"
          title={link.title || link.longUrl}
        >
          {link.title || link.longUrl}
        </Link>

        {/* Short URL Row */}
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

        {/* Long Destination URL */}
        <p className="text-xs text-[#526281] dark:text-slate-400 truncate min-w-0 pt-0.5" title={link.longUrl}>
          {link.longUrl}
        </p>

        {/* Tags Section */}
        <LinkTagsSection
          tags={link.tags}
          isOpen={isTagMenuOpen}
          onToggle={onToggleTagMenu}
          tagMenuRef={tagMenuRef}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
          layout="stacked"
        />
      </div>

      {/* Footer: Click Data Badge & Date */}
      <div className="flex items-center justify-between pt-2">
        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Lock className="h-3 w-3 text-slate-400" />
          Click data
        </span>
        <span className="text-xs text-slate-400">{formatDate(link.createdAt)}</span>
      </div>
    </div>
  );
};
