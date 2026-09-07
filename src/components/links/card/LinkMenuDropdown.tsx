'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  MoreHorizontal,
  ExternalLink,
  Edit2,
  Eye,
  EyeOff,
  Trash2,
} from 'lucide-react';
import { QrCodeIcon } from '@/components/icons/AppIcons';

export interface LinkMenuDropdownProps {
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
  onClose: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  shortCode: string;
  isHidden?: boolean;
  onOpenHideModal: () => void;
  onOpenDeleteModal: () => void;
  buttonClassName?: string;
}

export const LinkMenuDropdown: React.FC<LinkMenuDropdownProps> = ({
  isOpen,
  onToggle,
  onClose,
  menuRef,
  shortCode,
  isHidden = false,
  onOpenHideModal,
  onOpenDeleteModal,
  buttonClassName = 'p-1.5',
}) => {
  const router = useRouter();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        title="More options"
        className={`${buttonClassName} rounded-lg transition-colors cursor-pointer ${
          isOpen
            ? 'text-[#2a5bd7] bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400 font-bold'
            : 'text-[#273144] hover:bg-slate-100 hover:text-[#2a5bd7] dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        <MoreHorizontal className="h-4.5 w-4.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-md border border-slate-200/90 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push(`/links/${shortCode}/details`);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <ExternalLink className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
            <span>View link details</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              router.push(`/qrcodes/${shortCode}/details`);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <QrCodeIcon className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
            <span>View QR Code</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              router.push(`/links/${shortCode}/edit`);
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <Edit2 className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
            <span>Edit link</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenHideModal();
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

          <hr className="my-1 border-t border-slate-100 dark:border-slate-800" />

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDeleteModal();
            }}
            className="flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-left text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};
