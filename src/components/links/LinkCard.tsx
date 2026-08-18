'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShortLink } from '@/types/link.types';
import { formatDate } from '@/lib/utils/formatDate';
import {
  Copy,
  Check,
  Edit2,
  Share2,
  BarChart2,
  MoreHorizontal,
  CornerDownRight,
  Calendar,
  Tag,
  PlusCircle,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLinks } from '@/hooks/useLinks';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { HideModal } from '@/components/modals/HideModal';
import { ShareModal } from '@/components/modals/ShareModal';
import { TagInput } from './TagInput';
import { toast } from 'sonner';
import { QrCodeIcon } from '@/components/icons/AppIcons';

export interface LinkCardProps {
  link: ShortLink;
  viewMode?: 'default' | 'compact' | 'grid';
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  viewMode = 'default',
  isSelected = false,
  onToggleSelect,
}) => {
  const router = useRouter();
  const { deleteLink, isDeleting, updateLink } = useLinks();
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tagMenuRef = useRef<HTMLDivElement>(null);

  const shortUrl = link.shortUrl || `/${link.shortCode}`;
  const displayShortCode = `trim.ly/${link.shortCode}`;

  // Close dropdown on outside click
  useEffect(() => {
    if (link.shortCode) {
      router.prefetch(`/links/${link.shortCode}/details`);
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (tagMenuRef.current && !tagMenuRef.current.contains(e.target as Node)) {
        setIsTagMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [link.shortCode, router]);

  const handleAddTag = async (tag: string) => {
    const currentTags = link.tags || [];
    if (!currentTags.includes(tag)) {
      await updateLink({ code: link.shortCode, payload: { tags: [...currentTags, tag] } });
    }
  };

  const handleRemoveTag = async (tag: string) => {
    const currentTags = link.tags || [];
    await updateLink({ code: link.shortCode, payload: { tags: currentTags.filter((t) => t !== tag) } });
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopied(true);
      toast.success('Link copied to clipboard!', { description: shortUrl });
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteLink(link.shortCode);
      setIsDeleteOpen(false);
    } catch {
      // Handled in mutation
    }
  };

  // Get domain favicon domain url
  let faviconDomain = '';
  try {
    const urlObj = new URL(link.longUrl);
    faviconDomain = urlObj.hostname;
  } catch {
    faviconDomain = '';
  }

  // ----------------------------------------------------
  // COMPACT VIEW MODE
  // ----------------------------------------------------
  if (viewMode === 'compact') {
    return (
      <>
        <div className={`group flex items-center justify-between gap-4 rounded-xl border px-4 py-3 shadow-2xs transition-all relative ${isSelected ? 'bg-[#f0f5ff] border-[#2a5bd7] dark:bg-[#1e293b]/80 dark:border-blue-500' : 'bg-white border-slate-200/90 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'} ${isMenuOpen ? 'z-30' : 'z-10'}`}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onToggleSelect && onToggleSelect(link._id || link.shortCode)}
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
            <Link
              href={`/links/${link.shortCode}`}
              className="font-bold text-[#273144] hover:underline dark:text-slate-100 truncate text-sm max-w-xs sm:max-w-md"
            >
              {link.title || link.longUrl}
            </Link>
            <span className="text-slate-300 dark:text-slate-700 shrink-0">•</span>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#2a5bd7] hover:underline text-sm shrink-0"
            >
              {displayShortCode}
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 cursor-pointer shrink-0"
              title="Copy link"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <span className="text-slate-300 dark:text-slate-700 shrink-0">•</span>
            <span className="text-sm text-slate-500 truncate hidden md:inline max-w-xs">{link.longUrl}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Click data
            </span>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isMenuOpen
                    ? 'text-[#2a5bd7] bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400 font-bold'
                    : 'text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
              >
                <MoreHorizontal className="h-4.5 w-4.5" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push(`/links/${link.shortCode}/details`);
                    }}
                    className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                    <span>View link details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push(`/qrcodes/${link.shortCode}/details`);
                    }}
                    className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <QrCodeIcon className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                    <span>View QR Code</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsHideModalOpen(true);
                    }}
                    className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    {link.isHidden ? (
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

                  <hr className="my-1 border-slate-100 dark:border-slate-800" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsDeleteOpen(true);
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

        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Link?"
          description={`Are you sure you want to delete /${link.shortCode}?`}
          confirmText="Delete Link"
          isLoading={isDeleting}
        />

        <HideModal
          isOpen={isHideModalOpen}
          onClose={() => setIsHideModalOpen(false)}
          onConfirm={async () => {
            setIsHideModalOpen(false);
            await updateLink({ code: link.shortCode, payload: { isHidden: true } });
          }}
          type="link"
        />
      </>
    );
  }

  // ----------------------------------------------------
  // GRID VIEW MODE
  // ----------------------------------------------------
  if (viewMode === 'grid') {
    return (
      <>
        <div className={`group rounded-xl border p-5 shadow-2xs transition-all flex flex-col justify-between space-y-4 relative ${isSelected ? 'bg-[#f0f5ff] border-[#2a5bd7] dark:bg-[#1e293b]/80 dark:border-blue-500' : 'bg-white border-slate-200/90 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'} ${isMenuOpen ? 'z-30' : 'z-10'}`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => onToggleSelect && onToggleSelect(link._id || link.shortCode)}
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
              <div className="flex items-center gap-3 sm:gap-3.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="h-4.5 w-4.5" />
                </button>

                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isMenuOpen
                        ? 'text-[#2a5bd7] bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400 font-bold'
                        : 'text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                  >
                    <MoreHorizontal className="h-4.5 w-4.5" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push(`/links/${link.shortCode}/details`);
                        }}
                        className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                        <span>View link details</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push(`/qrcodes/${link.shortCode}/details`);
                        }}
                        className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <QrCodeIcon className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                        <span>View QR Code</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsHideModalOpen(true);
                        }}
                        className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        {link.isHidden ? (
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

                      <hr className="my-1 border-slate-100 dark:border-slate-800" />

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsDeleteOpen(true);
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

            <Link
              href={`/links/${link.shortCode}`}
              className="font-bold text-[#273144] hover:underline dark:text-slate-100 line-clamp-2 text-sm block"
            >
              {link.title || link.longUrl}
            </Link>

            <div className="flex items-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#2a5bd7] hover:underline text-sm"
              >
                {displayShortCode}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{link.longUrl}</p>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="group/tags flex items-center justify-between text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {link.tags && link.tags.length > 0 ? (
                  <span className="flex items-center gap-1.5 flex-wrap">
                    {link.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center rounded-sm bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {tag}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">No tags</span>
                )}
              </span>
              <div className="relative shrink-0" ref={tagMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsTagMenuOpen(!isTagMenuOpen)}
                  className={`text-[#2a5bd7] font-semibold hover:underline flex items-center gap-1 cursor-pointer transition-opacity duration-200 ${
                    isTagMenuOpen ? 'opacity-100' : 'opacity-0 group-hover/tags:opacity-100'
                  }`}
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Add tag
                </button>
                {isTagMenuOpen && (
                  <div className="absolute right-0 bottom-full mb-1 z-50">
                    <TagInput
                      selectedTags={link.tags || []}
                      onAddTag={handleAddTag}
                      onRemoveTag={handleRemoveTag}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                Click data
              </span>
              <span className="text-sm text-slate-400">{formatDate(link.createdAt)}</span>
            </div>
          </div>
        </div>

        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Link?"
          description={`Are you sure you want to delete /${link.shortCode}?`}
          confirmText="Delete Link"
          isLoading={isDeleting}
        />
      </>
    );
  }

  // ----------------------------------------------------
  // DEFAULT VIEW MODE (Matching Bitly exact layout)
  // ----------------------------------------------------
  return (
    <>
      <div className={`group rounded-xl border p-5 sm:p-6 shadow-2xs transition-all space-y-4 relative ${isSelected ? 'bg-[#f0f5ff] border-[#2a5bd7] dark:bg-[#1e293b]/80 dark:border-blue-500' : 'bg-white border-slate-200/90 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'} ${isMenuOpen ? 'z-30' : 'z-10'}`}>
        {/* Main Header Row: Checkbox, Favicon, Title, Short Url & Actions */}
        <div className="flex items-start gap-3.5">
          {/* Checkbox */}
          <button
            type="button"
            onClick={() => onToggleSelect && onToggleSelect(link._id || link.shortCode)}
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

          {/* Favicon Container */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200/60 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
            {faviconDomain ? (
              <img
                src={`https://icons.duckduckgo.com/ip2/${faviconDomain}.ico`}
                alt=""
                className="h-5 w-5 rounded-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <Globe className="h-5 w-5 text-slate-500" />
            )}
          </div>

          {/* Title & Short Link & Action Row */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-start justify-between gap-4">
              <Link
                href={`/links/${link.shortCode}`}
                className="font-bold text-[#273144] hover:underline dark:text-slate-100 text-base sm:text-lg leading-snug truncate"
              >
                {link.title || link.longUrl}
              </Link>

              {/* Action Buttons Header Row (Same as QR Code Card) */}
              <div className="flex items-center gap-3 sm:gap-3.5 shrink-0 text-[#273144] dark:text-slate-200">
                <button
                  type="button"
                  onClick={() => router.push(`/links/${link.shortCode}/edit`)}
                  className="p-1.5 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit link"
                >
                  <Edit2 className="h-4.5 w-4.5" />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-1.5 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="h-4.5 w-4.5" />
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/links/${link.shortCode}/details`)}
                  className="p-1.5 rounded-lg text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="View details"
                >
                  <BarChart2 className="h-4.5 w-4.5" />
                </button>

                {/* More Options Dropdown Button */}
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

                  {/* Dropdown Container matching QR code card */}
                  {isMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push(`/links/${link.shortCode}/details`);
                        }}
                        className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                        <span>View link details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push(`/links/${link.shortCode}/details`);
                        }}
                        className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <QrCodeIcon className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                        <span>View QR Code</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsHideModalOpen(true);
                        }}
                        className="flex w-full items-center gap-3 bg-transparent rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        {link.isHidden ? (
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

                      <hr className="my-1 border-slate-100 dark:border-slate-800" />

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsDeleteOpen(true);
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

            {/* Short URL & Copy Button */}
            <div className="flex items-center gap-2 pt-0.5">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#2a5bd7] hover:underline text-sm"
              >
                {displayShortCode}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                title="Copy short link"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Destination URL Line */}
        <div className="flex items-center gap-2 pl-12 text-sm text-[#526281] dark:text-slate-400">
          <CornerDownRight className="h-4 w-4 shrink-0 text-slate-400" />
          <a
            href={link.longUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline truncate max-w-2xl font-medium"
          >
            {link.longUrl}
          </a>
        </div>

        {/* Card Footer: Click Data Badge, Date & Tags */}
        <div className="flex flex-wrap items-center justify-between gap-4 pl-12 pt-1">
          <div className="flex items-center gap-4 text-sm font-medium text-[#526281] dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-200">
              Click data
            </span>

            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              {formatDate(link.createdAt)}
            </span>

            <div className="group/tags inline-flex items-center gap-2.5">
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-slate-400 shrink-0" />
                {link.tags && link.tags.length > 0 ? (
                  <span className="flex items-center gap-1.5 flex-wrap">
                    {link.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center rounded-sm bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {tag}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">No tags</span>
                )}
              </span>

              <div className="relative shrink-0" ref={tagMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsTagMenuOpen(!isTagMenuOpen)}
                  className={`text-[#2a5bd7] font-semibold hover:underline flex items-center gap-1 cursor-pointer transition-opacity duration-200 ${
                    isTagMenuOpen ? 'opacity-100' : 'opacity-0 group-hover/tags:opacity-100'
                  }`}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Add tag</span>
                </button>
                {isTagMenuOpen && (
                  <div className="absolute left-0 bottom-full mb-1 z-50">
                    <TagInput
                      selectedTags={link.tags || []}
                      onAddTag={handleAddTag}
                      onRemoveTag={handleRemoveTag}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Short Link?"
        description={`Are you sure you want to delete /${link.shortCode}? People clicking this link will no longer be redirected.`}
        confirmText="Delete Link"
        isLoading={isDeleting}
      />

      <HideModal
        isOpen={isHideModalOpen}
        onClose={() => setIsHideModalOpen(false)}
        onConfirm={async () => {
          setIsHideModalOpen(false);
          await updateLink({ code: link.shortCode, payload: { isHidden: !link.isHidden } });
        }}
        type="link"
        isHidden={link.isHidden}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shortCode={link.shortCode}
        title={link.title || `trim.ly/${link.shortCode}`}
      />
    </>
  );
};
