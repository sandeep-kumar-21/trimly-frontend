'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShortLink } from '@/types/link.types';
import { useRouter } from 'next/navigation';
import { useLinks } from '@/hooks/useLinks';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { HideModal } from '@/components/modals/HideModal';
import { ShareModal } from '@/components/modals/ShareModal';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/utils/clipboard';
import { LinkCardCompact } from './card/LinkCardCompact';
import { LinkCardGrid } from './card/LinkCardGrid';
import { LinkCardDefault } from './card/LinkCardDefault';

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
  const { deleteLink, isDeleting, updateLink, isUpdating } = useLinks();

  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);

  // Dedicated refs for dropdown menus across view variants
  const compactMenuRef = useRef<HTMLDivElement>(null);
  const gridMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

  // Dedicated refs for tag popovers
  const gridTagMenuRef = useRef<HTMLDivElement>(null);
  const mobileTagMenuRef = useRef<HTMLDivElement>(null);
  const desktopTagMenuRef = useRef<HTMLDivElement>(null);

  const shortUrl = link.shortUrl || `/${link.shortCode}`;
  const displayShortCode = `trim.ly/${link.shortCode}`;

  // Close dropdowns on outside click / tap
  useEffect(() => {
    if (link.shortCode) {
      router.prefetch(`/links/${link.shortCode}/details`);
    }
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      const isInsideMenu =
        compactMenuRef.current?.contains(target) ||
        gridMenuRef.current?.contains(target) ||
        mobileMenuRef.current?.contains(target) ||
        desktopMenuRef.current?.contains(target);

      if (!isInsideMenu) setIsMenuOpen(false);

      const isInsideTagMenu =
        gridTagMenuRef.current?.contains(target) ||
        mobileTagMenuRef.current?.contains(target) ||
        desktopTagMenuRef.current?.contains(target);

      if (!isInsideTagMenu) setIsTagMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [link.shortCode, router]);

  const handleAddTag = async (tag: string) => {
    const currentTags = link.tags || [];
    if (currentTags.length >= 10) return toast.warning('A link cannot have more than 10 tags.');
    const cleanTag = tag.trim().slice(0, 7).replace(/[^a-zA-Z0-9_-]/g, '');
    if (!cleanTag) return toast.warning('Tags can only contain letters, numbers, hyphens, and underscores.');
    if (!currentTags.some((t) => t.toLowerCase() === cleanTag.toLowerCase())) {
      await updateLink({ code: link.shortCode, payload: { tags: [...currentTags, cleanTag] } });
    }
  };

  const handleRemoveTag = async (tag: string) => {
    const currentTags = link.tags || [];
    await updateLink({ code: link.shortCode, payload: { tags: currentTags.filter((t) => t !== tag) } });
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(shortUrl);
    if (success) {
      setCopied(true);
      toast.success('Link copied to clipboard!', { description: shortUrl });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteLink(link.shortCode);
      setIsDeleteOpen(false);
    } catch {}
  };

  const handleToggleHide = async () => {
    try {
      await updateLink({ code: link.shortCode, payload: { isHidden: !link.isHidden } });
      setIsHideModalOpen(false);
    } catch {}
  };

  let faviconDomain = '';
  try {
    faviconDomain = new URL(link.longUrl).hostname;
  } catch {
    faviconDomain = '';
  }

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleToggleTagMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTagMenuOpen((prev) => !prev);
  };

  return (
    <>
      {viewMode === 'compact' && (
        <LinkCardCompact
          link={link}
          isSelected={isSelected}
          onToggleSelect={onToggleSelect}
          shortUrl={shortUrl}
          displayShortCode={displayShortCode}
          copied={copied}
          onCopy={handleCopy}
          isMenuOpen={isMenuOpen}
          onToggleMenu={handleToggleMenu}
          onCloseMenu={() => setIsMenuOpen(false)}
          menuRef={compactMenuRef}
          onOpenHideModal={() => setIsHideModalOpen(true)}
          onOpenDeleteModal={() => setIsDeleteOpen(true)}
          faviconDomain={faviconDomain}
        />
      )}

      {viewMode === 'grid' && (
        <LinkCardGrid
          link={link}
          isSelected={isSelected}
          onToggleSelect={onToggleSelect}
          shortUrl={shortUrl}
          displayShortCode={displayShortCode}
          copied={copied}
          onCopy={handleCopy}
          onShare={handleShare}
          isMenuOpen={isMenuOpen}
          onToggleMenu={handleToggleMenu}
          onCloseMenu={() => setIsMenuOpen(false)}
          menuRef={gridMenuRef}
          isTagMenuOpen={isTagMenuOpen}
          onToggleTagMenu={handleToggleTagMenu}
          tagMenuRef={gridTagMenuRef}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onOpenHideModal={() => setIsHideModalOpen(true)}
          onOpenDeleteModal={() => setIsDeleteOpen(true)}
        />
      )}

      {viewMode === 'default' && (
        <LinkCardDefault
          link={link}
          isSelected={isSelected}
          onToggleSelect={onToggleSelect}
          shortUrl={shortUrl}
          displayShortCode={displayShortCode}
          copied={copied}
          onCopy={handleCopy}
          onShare={handleShare}
          isMenuOpen={isMenuOpen}
          onToggleMenu={handleToggleMenu}
          onCloseMenu={() => setIsMenuOpen(false)}
          mobileMenuRef={mobileMenuRef}
          desktopMenuRef={desktopMenuRef}
          isTagMenuOpen={isTagMenuOpen}
          onToggleTagMenu={handleToggleTagMenu}
          mobileTagMenuRef={mobileTagMenuRef}
          desktopTagMenuRef={desktopTagMenuRef}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onOpenHideModal={() => setIsHideModalOpen(true)}
          onOpenDeleteModal={() => setIsDeleteOpen(true)}
          faviconDomain={faviconDomain}
        />
      )}

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
        onConfirm={handleToggleHide}
        type="link"
        isHidden={link.isHidden || false}
        isLoading={isUpdating}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shortCode={link.shortCode}
        title={link.title || link.longUrl}
      />
    </>
  );
};
