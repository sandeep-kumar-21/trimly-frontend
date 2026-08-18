'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle } from 'lucide-react';

export interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscard: () => void;
  onSaveAndProceed: () => void;
  isSaving?: boolean;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onClose,
  onDiscard,
  onSaveAndProceed,
  isSaving = false,
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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Full Page Backdrop covering Sidebar & Topbar */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in zoom-in-95 duration-150 space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="unsaved-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#2a5bd7] dark:text-blue-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <h2
              id="unsaved-modal-title"
              className="text-xl font-bold tracking-tight text-[#273144] dark:text-slate-100"
            >
              Unsaved changes
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <p className="text-sm text-[#273144] dark:text-slate-300 leading-relaxed font-medium">
          You have unsaved changes in this form. Would you like to save your changes before leaving, or discard them?
        </p>

        {/* Modal Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-10 px-4 rounded-lg border border-slate-300 bg-white font-bold text-[#273144] text-sm hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-50"
          >
            Keep editing
          </button>
          <button
            type="button"
            onClick={onDiscard}
            disabled={isSaving}
            className="h-10 px-4 rounded-lg border border-red-200 bg-red-50 font-bold text-red-600 text-sm hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            Discard & leave
          </button>
          <button
            type="button"
            onClick={onSaveAndProceed}
            disabled={isSaving}
            className="h-10 px-5 rounded-lg bg-[#2a5bd7] font-bold text-white text-sm hover:bg-[#1d4cc9] transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save & leave'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
