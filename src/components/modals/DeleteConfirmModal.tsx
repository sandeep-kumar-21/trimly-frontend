'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2 } from 'lucide-react';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'qrcode' | 'link';
  itemName?: string;
  isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  itemName,
  isLoading = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const isQrMode = type === 'qrcode';
  const title = isQrMode ? 'Delete QR Code' : 'Delete link';
  const description = isQrMode
    ? `Are you sure you want to delete this QR Code${itemName ? ` ("${itemName}")` : ''}? This action is permanent and cannot be undone.`
    : `Are you sure you want to delete this link${itemName ? ` ("${itemName}")` : ''}? This action is permanent and cannot be undone.`;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto select-none">
      {/* Backdrop (No blur) */}
      <div
        className="fixed inset-0 bg-slate-900/60 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white p-4.5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in zoom-in-95 duration-150 space-y-4 sm:space-y-5 max-h-[calc(100vh-2rem)] overflow-y-auto my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <Trash2 className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
            <h2
              id="delete-modal-title"
              className="text-lg sm:text-xl font-bold tracking-tight text-[#273144] dark:text-slate-100 truncate"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <p className="text-xs sm:text-sm text-[#273144] dark:text-slate-300 leading-relaxed font-medium">
          {description}
        </p>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-9 sm:h-10 px-4 sm:px-5 rounded-lg sm:rounded-md border border-slate-300 bg-white font-bold text-[#273144] text-xs sm:text-sm hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="h-9 sm:h-10 px-4 sm:px-5 rounded-lg sm:rounded-md bg-red-600 font-bold text-white text-xs sm:text-sm hover:bg-red-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
