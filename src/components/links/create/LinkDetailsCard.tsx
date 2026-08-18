'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface LinkDetailsCardProps {
  destinationUrl: string;
  onDestinationUrlChange: (val: string) => void;
  domain: string;
  onDomainChange: (val: string) => void;
  backHalf: string;
  onBackHalfChange: (val: string) => void;
  onGenerateBackHalf: () => void;
  title: string;
  onTitleChange: (val: string) => void;
  tags: string;
  onTagsChange: (val: string) => void;
  errorUrl?: string;
}

export const LinkDetailsCard: React.FC<LinkDetailsCardProps> = ({
  destinationUrl,
  onDestinationUrlChange,
  domain,
  onDomainChange,
  backHalf,
  onBackHalfChange,
  onGenerateBackHalf,
  title,
  onTitleChange,
  tags,
  onTagsChange,
  errorUrl,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showDynamicBanner, setShowDynamicBanner] = useState(true);

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h2 className="text-lg font-bold text-[#273144] dark:text-slate-100">
          Link details
        </h2>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Collapse Link details section"
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-5">
          <p className="text-sm text-[#526281] dark:text-slate-400">
            You have <strong className="font-bold text-[#273144] dark:text-slate-200">49 links</strong> and <strong className="font-bold text-[#273144] dark:text-slate-200">3 custom back-halves</strong> remaining this month.{' '}
            <span className="text-[#2a5bd7] font-semibold underline cursor-pointer">Upgrade for more</span>.
          </p>

          {/* Destination URL */}
          <div className="space-y-1.5">
            <label htmlFor="destination-url" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Destination URL *
            </label>
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

          {/* Dynamic Routing Promo Banner matching Bitly screenshot */}
          {showDynamicBanner && (
            <div className="rounded-xl border border-blue-200/90 bg-blue-50/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm dark:border-blue-900/60 dark:bg-blue-950/40">
              <div className="flex items-start sm:items-center gap-2 text-blue-950 dark:text-blue-200">
                <span className="text-[#2a5bd7] font-bold shrink-0">⚡ New:</span>
                <span>
                  <strong>Dynamic routing</strong> — send visitors to different URLs based on device or location.
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => alert('Dynamic routing setup')}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-bold text-[#273144] hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Set it up
                </button>
                <button
                  type="button"
                  onClick={() => setShowDynamicBanner(false)}
                  className="p-1 text-blue-800 hover:text-blue-950 dark:text-blue-300 cursor-pointer"
                  aria-label="Close banner"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Short Link Domain & Back-Half */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5 space-y-1.5">
              <label htmlFor="domain-select" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                Short link domain
              </label>
              <select
                id="domain-select"
                value={domain}
                onChange={(e) => onDomainChange(e.target.value)}
                className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="trim.ly">trim.ly</option>
                <option value="bit.ly">bit.ly</option>
              </select>
            </div>

            <div className="hidden sm:flex items-center justify-center h-11 text-slate-400 font-bold text-lg">
              /
            </div>

            <div className="sm:col-span-6 space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="back-half-input" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                  Back-half <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <button
                  type="button"
                  onClick={onGenerateBackHalf}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 border border-amber-300 bg-amber-50 px-2 py-0.5 rounded-md hover:bg-amber-100 transition-colors cursor-pointer dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                >
                  <Sparkles className="h-3 w-3 text-amber-600" />
                  <span>Generate</span>
                </button>
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

          {/* Title (optional) */}
          <div className="space-y-1.5">
            <label htmlFor="link-title" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Title <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              id="link-title"
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Summer Promo Link"
              className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label htmlFor="link-tags" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Tags
            </label>
            <input
              id="link-tags"
              type="text"
              value={tags}
              onChange={(e) => onTagsChange(e.target.value)}
              placeholder="Select tags or type custom tags"
              className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      )}
    </section>
  );
};
