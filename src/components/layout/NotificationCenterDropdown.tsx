'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MoreHorizontal, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

export interface NotificationItem {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  isRead: boolean;
}

export interface NotificationCenterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterDropdown: React.FC<NotificationCenterDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Your first link is ready to share.',
      timestamp: 'Jul 28',
      description: "The easiest way to get your first click? Share it somewhere you're already active.",
      ctaText: 'Share your link',
      ctaLink: '/links',
      isRead: false,
    },
  ]);

  // Close overflow menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setIsOverflowOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setIsOverflowOpen(false);
    toast.success('All notifications marked as read');
  };

  const handleToggleItemRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  return (
    <div className="fixed sm:absolute right-2 sm:right-0 top-14 sm:top-full sm:mt-2 w-[calc(100vw-1rem)] sm:w-[410px] max-w-md rounded-lg border border-slate-200/90 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#273144] dark:text-slate-100">
      {/* Panel Header */}
      <header className="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
          Notifications
        </h3>

        {/* Overflow Menu (No "Give feedback" option as instructed) */}
        <div className="relative" ref={overflowRef}>
          <button
            type="button"
            onClick={() => setIsOverflowOpen(!isOverflowOpen)}
            aria-label="Notification options"
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {isOverflowOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 rounded-lg border border-slate-200/90 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95 duration-100">
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <Check className="h-4 w-4 text-slate-500" />
                <span>Mark all as read</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Panel Sections */}
      <div className="px-5 py-4 space-y-4 max-h-[440px] overflow-y-auto">
        <section className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
            Earlier ({notifications.length})
          </h4>

          <ul className="space-y-5">
            {notifications.map((item) => (
              <li key={item.id} className="group">
                <article className="space-y-2">
                  <div className="flex items-start gap-3">
                    {/* Outline Check Circle Icon (Exact Bitly design) */}
                    <button
                      type="button"
                      onClick={() => handleToggleItemRead(item.id)}
                      title={item.isRead ? 'Mark as unread' : 'Mark as read'}
                      className="mt-0.5 shrink-0 text-[#273144] dark:text-slate-200 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-base font-bold text-[#273144] dark:text-slate-100 leading-snug">
                          {item.title}
                        </p>
                        <span className="text-sm font-normal text-[#6b7280] dark:text-slate-400 shrink-0">
                          {item.timestamp}
                        </span>
                      </div>

                      <p className="text-sm text-[#475569] dark:text-slate-300 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* CTA Action Link sitting directly under text */}
                  <div className="pl-8 pt-1">
                    <Link
                      href={item.ctaLink}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer transition-all"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
