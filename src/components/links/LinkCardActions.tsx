'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShortLink } from '@/types/link.types';
import {
  Share2,
  MoreHorizontal,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';
import { QrCodeIcon } from '@/components/icons/AppIcons';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { HideModal } from '@/components/modals/HideModal';
import { ShareModal } from '@/components/modals/ShareModal';
import { useLinks } from '@/hooks/useLinks';
import { toast } from 'sonner';

export interface LinkCardActionsProps {
  link: ShortLink;
}

export const LinkCardActions: React.FC<LinkCardActionsProps> = ({ link }) => {
  const router = useRouter();
  const { deleteLink, isDeleting, updateLink } = useLinks();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      await deleteLink(link.shortCode);
      setIsDeleteOpen(false);
    } catch {
      // Handled in mutation
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="p-1.5 rounded-md text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Share link"
        >
          <Share2 className="h-4.5 w-4.5" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isMenuOpen
                ? 'text-[#2a5bd7] bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400 font-bold'
                : 'text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
            aria-label="Link actions menu"
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
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <ExternalLink className="h-4.5 w-4.5 shrink-0" />
                <span>View link details</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push(`/qrcodes/create?code=${link.shortCode}`);
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <QrCodeIcon className="h-4.5 w-4.5 shrink-0" />
                <span>Customize QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsHideModalOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
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
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-rose-50 hover:text-rose-600 dark:text-slate-200 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer group/delete"
              >
                <Trash2 className="h-4.5 w-4.5 shrink-0 text-[#273144] group-hover/delete:text-rose-600 dark:text-slate-200 dark:group-hover/delete:text-rose-400 transition-colors" />
                <span>Delete</span>
              </button>
            </div>
          )}
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
          await updateLink({ code: link.shortCode, payload: { isHidden: !link.isHidden } });
        }}
        type="link"
        isHidden={link.isHidden}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shortCode={link.shortCode}
        title={link.title || undefined}
      />
    </>
  );
};
