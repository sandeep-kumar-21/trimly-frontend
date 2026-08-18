'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, ChevronLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortCode?: string;
  title?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shortCode = '45MM1F1',
  title = 'Trimly Link',
}) => {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const displayShortLink = `trim.ly/${shortCode}`;
  const fullUrl = `https://${displayShortLink}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      color: '#25D366',
      action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullUrl)}`, '_blank'),
      icon: (
        <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.6031 2.32521C12.1064 0.826229 10.116 0.000884613 7.99513 0C3.6247 0 0.0681152 3.55615 0.066346 7.9279C0.0654614 9.32515 0.430807 10.6892 1.12479 11.8914L0 16L4.2028 14.8978C5.36076 15.5298 6.66468 15.862 7.9916 15.8624H7.99513C12.3647 15.8624 15.9217 12.3059 15.923 7.93454C15.9239 5.81589 15.0999 3.82418 13.6031 2.32565V2.32521ZM7.99513 14.5231H7.99248C6.8102 14.5231 5.65047 14.2051 4.63847 13.6045L4.39786 13.4616L1.90369 14.1158L2.56936 11.684L2.41278 11.4345C1.7533 10.3854 1.40477 9.17255 1.40521 7.92746C1.40654 4.29435 4.36291 1.33842 7.99779 1.33842C9.75773 1.3393 11.4124 2.02532 12.6566 3.2713C13.9008 4.51684 14.5855 6.17283 14.5846 7.93321C14.5829 11.5668 11.6269 14.5227 7.99513 14.5227V14.5231ZM11.6097 9.58832C11.4115 9.48925 10.4376 9.01023 10.2558 8.94388C10.074 8.87754 9.94217 8.84481 9.81036 9.04296C9.67855 9.24155 9.29861 9.68784 9.18317 9.81965C9.06773 9.9519 8.95184 9.96826 8.75413 9.86919C8.55598 9.77011 7.91773 9.5609 7.16094 8.88594C6.57223 8.36048 6.1746 7.71206 6.05872 7.51346C5.94327 7.31487 6.04633 7.20783 6.14541 7.10919C6.23431 7.02029 6.34356 6.87787 6.44264 6.76198C6.54172 6.64654 6.57445 6.56339 6.64079 6.43158C6.70714 6.29933 6.67397 6.18389 6.62443 6.08437C6.57489 5.98529 6.17902 5.01001 6.0136 4.6137C5.8526 4.22757 5.68939 4.27976 5.5682 4.27357C5.45276 4.26782 5.32051 4.26693 5.18826 4.26693C5.05601 4.26693 4.84149 4.31647 4.6597 4.51462C4.47791 4.71322 3.96616 5.19224 3.96616 6.16708C3.96616 7.14192 4.67607 8.08404 4.77514 8.21673C4.87422 8.34898 6.17239 10.35 8.15923 11.208C8.63161 11.4124 9.00094 11.534 9.28888 11.6256C9.76348 11.7764 10.1952 11.7552 10.5366 11.7043C10.917 11.6473 11.7087 11.2249 11.8737 10.7622C12.0387 10.2996 12.0387 9.9028 11.9892 9.82009C11.9396 9.73738 11.8074 9.68784 11.6092 9.58877V9.58788L11.6097 9.58832Z"
            fill="#25D366"
          />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      color: '#1877F2',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank'),
      icon: (
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
          <path
            d="M48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 35.9789 8.77641 45.908 20.25 47.7084V30.9375H14.1562V24H20.25V18.7125C20.25 12.6975 23.8331 9.375 29.3152 9.375C31.9402 9.375 34.6875 9.84375 34.6875 9.84375V15.75H31.6613C28.68 15.75 27.75 17.6002 27.75 19.5V24H34.4062L33.3422 30.9375H27.75V47.7084C39.2236 45.908 48 35.9789 48 24Z"
            fill="#1877F2"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      color: '#E4405F',
      action: () => {
        navigator.clipboard.writeText(fullUrl);
        toast.success('Link copied! Open Instagram to share.');
      },
      icon: (
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="url(#ig-grad)" />
          <path
            d="M24 14C18.477 14 14 18.477 14 24C14 29.523 18.477 34 24 34C29.523 34 34 29.523 34 24C34 18.477 29.523 14 24 14ZM24 30.5C20.41 30.5 17.5 27.59 17.5 24C17.5 20.41 20.41 17.5 24 17.5C27.59 17.5 30.5 20.41 30.5 24C30.5 27.59 27.59 30.5 24 30.5ZM34.5 16C33.67 16 33 15.33 33 14.5C33 13.67 33.67 13 34.5 13C35.33 13 36 13.67 36 14.5C36 15.33 35.33 16 34.5 16Z"
            fill="white"
          />
          <defs>
            <linearGradient id="ig-grad" x1="0" y1="48" x2="48" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFC107" />
              <stop offset="0.3" stopColor="#F44336" />
              <stop offset="0.6" stopColor="#E91E63" />
              <stop offset="1" stopColor="#9C27B0" />
            </linearGradient>
          </defs>
        </svg>
      ),
    },
    {
      name: 'X',
      color: '#000000',
      action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}`, '_blank'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Email',
      color: '#4B5563',
      action: () => window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(fullUrl)}`, '_blank'),
      icon: <Mail className="h-6 w-6 text-slate-700 dark:text-slate-200" />,
    },
    {
      name: 'LinkedIn',
      color: '#0A66C2',
      action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`, '_blank'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
  ];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
            Share your Trimly Link
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Social Share Carousel Row */}
        <div className="relative group">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 hidden group-hover:flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1 px-1 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {shareOptions.map((opt) => (
              <div key={opt.name} className="flex flex-col items-center gap-2 shrink-0 w-16">
                <button
                  type="button"
                  onClick={opt.action}
                  aria-label={`Share via ${opt.name}`}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer dark:border-slate-800 dark:bg-slate-800"
                >
                  {opt.icon}
                </button>
                <span className="text-xs font-semibold text-[#526281] dark:text-slate-300 truncate w-full text-center">
                  {opt.name}
                </span>
              </div>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Copy Link Input Bar */}
        <div className="flex items-center justify-between rounded-xl border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-800">
          <span className="pl-2 text-sm font-semibold text-[#273144] dark:text-slate-100 truncate">
            {displayShortLink}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className={`h-9 px-4 rounded-lg font-bold text-sm transition-colors cursor-pointer shrink-0 ${
              copied
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-[#e8effe] text-[#2a5bd7] hover:bg-[#dbe7ff] dark:bg-slate-700 dark:text-blue-300'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
