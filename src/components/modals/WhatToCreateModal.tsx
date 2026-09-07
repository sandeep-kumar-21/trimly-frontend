'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { LinkIcon, QrCodeIcon } from '@/components/icons/AppIcons';

export const WhatToCreateModal: React.FC = () => {
  const { isCreateModalOpen, closeCreateModal } = useUIStore();
  const router = useRouter();

  // Listen for global keyboard shortcuts 'L' and 'Q'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          (activeEl as HTMLElement).isContentEditable);

      if (isInput) return;

      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        closeCreateModal();
        router.push('/links/create');
      } else if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        closeCreateModal();
        router.push('/qrcodes/create');
      } else if (e.key === 'Escape' && isCreateModalOpen) {
        closeCreateModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreateModalOpen, closeCreateModal, router]);

  if (!isCreateModalOpen) return null;

  const handleSelectLink = () => {
    closeCreateModal();
    router.push('/links/create');
  };

  const handleSelectQr = () => {
    closeCreateModal();
    router.push('/qrcodes/create');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200/90 bg-white p-4.5 sm:p-6 md:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4 sm:space-y-6 max-h-[calc(100vh-2rem)] overflow-y-auto my-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
            What do you want to create?
          </h2>
          <button
            type="button"
            onClick={closeCreateModal}
            aria-label="Close modal"
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 2 Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Option 1: Shorten a link */}
          <button
            type="button"
            onClick={handleSelectLink}
            className="group flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 text-left shadow-2xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600"
          >
            <div className="flex items-center gap-3 sm:gap-3.5">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-slate-700">
                <LinkIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </span>
              <span className="text-sm sm:text-base font-bold text-[#273144] dark:text-slate-100">
                Shorten a link
              </span>
            </div>
            <span
              title="Press L anywhere to start shortening links"
              className="hidden sm:flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300"
            >
              L
            </span>
          </button>

          {/* Option 2: Create a QR Code */}
          <button
            type="button"
            onClick={handleSelectQr}
            className="group flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 text-left shadow-2xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-slate-600"
          >
            <div className="flex items-center gap-3 sm:gap-3.5">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-200 transition-colors dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-slate-700">
                <QrCodeIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </span>
              <span className="text-sm sm:text-base font-bold text-[#273144] dark:text-slate-100">
                Create a QR Code
              </span>
            </div>
            <span
              title="Press Q anywhere to start making QR codes"
              className="hidden sm:flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300"
            >
              Q
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
