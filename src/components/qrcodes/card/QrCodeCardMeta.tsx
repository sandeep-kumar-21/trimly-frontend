'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Tag, PlusCircle, Copy, Check } from 'lucide-react';
import { TagInput } from '../../links/TagInput';
import { linksApi } from '@/lib/api/links.api';
import { useBulkLinks } from '@/hooks/useBulkLinks';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/utils/clipboard';
import { QrCodeItem } from '../QrCodeCard';

interface QrCodeCardMetaProps {
  item: QrCodeItem;
  formattedDate: string;
  isVisibleLink: boolean;
}

export const QrCodeCardMeta: React.FC<QrCodeCardMetaProps> = ({
  item,
  formattedDate,
  isVisibleLink,
}) => {
  const [copied, setCopied] = useState(false);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const tagMenuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { bulkUpdateTags } = useBulkLinks();

  const shortUrl = item.shortUrl || `/${item.shortCode}`;
  const displayShortCode = `trim.ly/${item.shortCode}`;

  // Close tag menu on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (tagMenuRef.current && !tagMenuRef.current.contains(e.target as Node)) {
        setIsTagMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTagMenuOpen(false);
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

  const handleCopy = async () => {
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
    const host = typeof window !== 'undefined' ? `${window.location.hostname}:4000` : 'localhost:4000';
    const fullShortUrl = `${protocol}//${host}/${item.shortCode}`;
    const success = await copyToClipboard(fullShortUrl);
    if (success) {
      setCopied(true);
      toast.success('Short link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy link');
    }
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

  const handleAddTag = async (tag: string) => {
    const currentTags = item.tags || [];
    if (currentTags.length >= 10) {
      toast.warning('A QR code cannot have more than 10 tags.');
      return;
    }
    const cleanTag = tag.trim().slice(0, 7).replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanTag) {
      toast.warning('Tags can only contain letters, numbers, hyphens, and underscores.');
      return;
    }
    if (item.linkId && !currentTags.some((t) => t.toLowerCase() === cleanTag.toLowerCase())) {
      await bulkUpdateTags({ linkIds: [item.linkId], addTags: [cleanTag] });
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (item.linkId) {
      await bulkUpdateTags({ linkIds: [item.linkId], removeTags: [tag] });
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs text-[#526281] dark:text-slate-400 font-semibold min-w-0">
      {/* Scans Badge */}
      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <span>{item.scansCount ?? 0} scans</span>
      </span>

      <span>•</span>

      {/* Creation Date */}
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
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-sm bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
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
  );
};
