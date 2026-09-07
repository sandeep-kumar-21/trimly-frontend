'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface HideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'qrcode' | 'link';
  isHidden?: boolean;
  isLoading?: boolean;
}

export const HideModal: React.FC<HideModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  isHidden = false,
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
  const title = isHidden
    ? isQrMode
      ? 'Unhide QR Code'
      : 'Unhide link'
    : isQrMode
    ? 'Hide QR Code'
    : 'Hide link';

  const description = isHidden
    ? isQrMode
      ? 'Unhiding this QR code will make it visible in your active QR Codes list again.'
      : 'Unhiding this link will make it visible in your active links list again.'
    : isQrMode
    ? "Hidden codes will still function but they won't show up on your list of QR Codes."
    : 'Are you sure you want to hide the selected link? This action can be undone any time.';

  const confirmText = isHidden
    ? isQrMode
      ? 'Unhide QR Code'
      : 'Unhide link'
    : isQrMode
    ? 'Hide QR Code'
    : 'Hide link';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto select-none">
      {/* Full Page Backdrop covering Sidebar & Topbar (No blur) */}
      <div
        className="fixed inset-0 bg-slate-900/60 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white p-4.5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in zoom-in-95 duration-150 space-y-4 sm:space-y-5 max-h-[calc(100vh-2rem)] overflow-y-auto my-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hide-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3">
          <h2
            id="hide-modal-title"
            className="text-lg sm:text-2xl font-bold tracking-tight text-[#273144] dark:text-slate-100 truncate"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body / Content */}
        <p className="text-xs sm:text-sm text-[#273144] dark:text-slate-300 leading-relaxed font-medium">
          {description}
        </p>

        {/* Modal Footer Buttons (Responsive flex) */}
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
            className="h-9 sm:h-10 px-4 sm:px-5 rounded-lg sm:rounded-md bg-[#2a5bd7] font-bold text-white text-xs sm:text-sm hover:bg-[#1d4cc9] transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
