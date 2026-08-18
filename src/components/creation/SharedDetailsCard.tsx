'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Sparkles, X, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SharedDetailsCardProps {
  type: 'link' | 'qrcode';
  destinationUrl: string;
  onDestinationUrlChange: (val: string) => void;
  domain?: string;
  onDomainChange?: (val: string) => void;
  backHalf?: string;
  onBackHalfChange?: (val: string) => void;
  onGenerateBackHalf?: () => void;
  title: string;
  onTitleChange: (val: string) => void;
  tags?: string;
  onTagsChange?: (val: string) => void;
  errorUrl?: string;
  onSetItUpClick?: () => void;
}

export const SharedDetailsCard: React.FC<SharedDetailsCardProps> = ({
  type,
  destinationUrl,
  onDestinationUrlChange,
  domain = 'trim.ly',
  onDomainChange,
  backHalf = '',
  onBackHalfChange,
  onGenerateBackHalf,
  title,
  onTitleChange,
  tags = '',
  onTagsChange,
  errorUrl,
  onSetItUpClick,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showDynamicBanner, setShowDynamicBanner] = useState(true);

  const isLinkMode = type === 'link';

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h2 className="text-lg font-bold text-[#273144] dark:text-slate-100">
          {isLinkMode ? 'Link details' : 'Code details'}
        </h2>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={`Collapse ${isLinkMode ? 'Link' : 'Code'} details section`}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-5">
          {/* Subtitle limit text (No upgrade links since Trimly is completely free) */}
          <p className="text-sm text-[#526281] dark:text-slate-400">
            {isLinkMode ? (
              <span>
                You have <strong className="font-bold text-[#273144] dark:text-slate-200">49 links</strong> and <strong className="font-bold text-[#273144] dark:text-slate-200">3 custom back-halves</strong> remaining this month.
              </span>
            ) : (
              <span>
                You can create <strong className="font-bold text-[#273144] dark:text-slate-200">2</strong> more codes this month.
              </span>
            )}
          </p>

          {/* Destination URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="destination-url" className="font-bold text-[#273144] dark:text-slate-200">
                Destination URL *
              </label>
              {!isLinkMode && (
                <span className="text-slate-400 flex items-center gap-1 font-medium text-xs sm:text-sm">
                  Hit <strong className="text-[#273144] dark:text-slate-300">Enter</strong>
                  <CornerDownLeft className="h-3 w-3" /> to create
                </span>
              )}
            </div>
            <input
              id="destination-url"
              type="text"
              value={destinationUrl}
              onChange={(e) => onDestinationUrlChange(e.target.value)}
              placeholder="https://example.com/my-long-url"
              className={cn(
                'w-full h-11 rounded-lg border bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:ring-2 focus:ring-blue-100 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
                errorUrl ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300'
              )}
            />
            {errorUrl && <p className="text-sm font-medium text-red-600">{errorUrl}</p>}
          </div>

          {/* Dynamic Routing Feature Alert Banner matching Bitly exact design */}
          {showDynamicBanner && (
            <aside className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#cce0ff] bg-[#edf4ff] px-4 py-3 dark:border-blue-900/80 dark:bg-blue-950/50">
              <div className="flex items-center gap-2.5">
                {/* Google Material / Bitly exact arrow_split SVG icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4cc9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <line x1="3" y1="12" x2="9" y2="12" />
                  <path d="M9 12l6-6h4" />
                  <polyline points="16 3 20 3 20 7" />
                  <path d="M9 12l6 6h4" />
                  <polyline points="16 21 20 21 20 17" />
                </svg>
                <span className="text-sm font-normal text-[#1d4cc9] dark:text-blue-300 leading-snug">
                  <strong className="font-bold mr-1 text-[#1d4cc9] dark:text-blue-200">New:</strong>
                  Dynamic routing — send visitors to different URLs based on device or location.
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (onSetItUpClick) onSetItUpClick();
                  }}
                  className="rounded-md border border-slate-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#273144] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Set it up
                </button>
                <button
                  type="button"
                  onClick={() => setShowDynamicBanner(false)}
                  aria-label="Close"
                  className="text-[#1d4cc9] hover:text-blue-900 dark:text-blue-300 p-0.5 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </aside>
          )}

          {/* Short Link Domain & Back-Half (Rendered for link mode or when domain handler is provided) */}
          {isLinkMode && onDomainChange && onBackHalfChange && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5 space-y-1.5">
                <label htmlFor="domain-select" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                  Short link domain
                </label>
                <div className="relative flex items-center">
                  <select
                    id="domain-select"
                    value={domain}
                    onChange={(e) => onDomainChange(e.target.value)}
                    className="w-full h-11 rounded-lg border border-slate-300 bg-white pl-3.5 pr-9 text-sm font-semibold text-slate-900 shadow-2xs appearance-none focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="trim.ly">trim.ly</option>
                    <option value="bit.ly">bit.ly</option>
                  </select>
                  <ChevronDown className="h-4 w-4 absolute right-3.5 pointer-events-none text-slate-400 dark:text-slate-400" />
                </div>
              </div>

              <div className="hidden sm:flex items-center justify-center h-11 text-slate-400 font-bold text-lg">
                /
              </div>

              <div className="sm:col-span-6 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="back-half-input" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                    Back-half <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  {onGenerateBackHalf && (
                    <div className="generate-backhalf-container">
                      <button
                        type="button"
                        onClick={onGenerateBackHalf}
                        tabIndex={0}
                        className="relative inline-flex items-center justify-center p-[1.5px] rounded-lg bg-gradient-to-r from-[#219ACD] via-[#A950A4] to-[#FF950A] hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                      >
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-[7px] bg-white dark:bg-slate-900 text-xs font-bold text-[#273144] dark:text-slate-100">
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.3636 7.27273L17.5 4.77273L20 3.63636L17.5 2.5L16.3636 0L15.2273 2.5L12.7273 3.63636L15.2273 4.77273L16.3636 7.27273ZM9.54545 7.72727L7.27273 2.72727L5 7.72727L0 10L5 12.2727L7.27273 17.2727L9.54545 12.2727L14.5455 10L9.54545 7.72727ZM16.3636 12.7273L15.2273 15.2273L12.7273 16.3636L15.2273 17.5L16.3636 20L17.5 17.5L20 16.3636L17.5 15.2273L16.3636 12.7273Z" fill="url(#paint0_linear_2_2)" />
                            <defs>
                              <linearGradient id="paint0_linear_2_2" x1="0.182173" y1="0.181841" x2="19.8185" y2="19.8182" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#219ACD" />
                                <stop offset="0.5" stopColor="#A950A4" />
                                <stop offset="1" stopColor="#FF950A" />
                              </linearGradient>
                            </defs>
                          </svg>
                          Generate
                        </span>
                      </button>
                    </div>
                  )}
                </div>
                <input
                  id="back-half-input"
                  type="text"
                  value={backHalf}
                  onChange={(e) => onBackHalfChange(e.target.value)}
                  placeholder="my-custom-back-half"
                  className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Title (optional) */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Title <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={isLinkMode ? "e.g. Summer Promo Link" : "e.g. Campaign QR Code"}
              className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label htmlFor="tags-input" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Tags
            </label>
            {onTagsChange ? (
              <input
                id="tags-input"
                type="text"
                value={tags}
                onChange={(e) => onTagsChange(e.target.value)}
                placeholder="Select tags or type custom tags"
                className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            ) : (
              <div className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-400 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
                <span>Select tags</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
