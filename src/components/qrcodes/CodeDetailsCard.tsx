'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Sparkles, X, CornerDownLeft } from 'lucide-react';

export interface CodeDetailsCardProps {
  destinationUrl: string;
  onDestinationUrlChange: (val: string) => void;
  title: string;
  onTitleChange: (val: string) => void;
}

export const CodeDetailsCard: React.FC<CodeDetailsCardProps> = ({
  destinationUrl,
  onDestinationUrlChange,
  title,
  onTitleChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showDynamicBanner, setShowDynamicBanner] = useState(true);

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h2 className="text-lg font-bold text-[#273144] dark:text-slate-100">
          Code details
        </h2>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Collapse Code details section"
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-5">
          <p className="text-sm text-[#526281] dark:text-slate-400">
            You can create <strong className="font-bold text-[#273144] dark:text-slate-200">2</strong> more codes this month.{' '}
            <a className="text-[#2a5bd7] underline font-semibold cursor-pointer" href="#upgrade">
              Upgrade for more
            </a>
            .
          </p>

          {/* Destination URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="destination-url" className="font-bold text-[#273144] dark:text-slate-200">
                Destination URL
              </label>
              <span className="text-slate-400 flex items-center gap-1 font-medium">
                Hit <strong className="text-[#273144] dark:text-slate-300">Enter</strong>
                <CornerDownLeft className="h-3 w-3" /> to create
              </span>
            </div>
            <input
              id="destination-url"
              type="text"
              value={destinationUrl}
              onChange={(e) => onDestinationUrlChange(e.target.value)}
              placeholder="https://example.com/my-long-url"
              className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:ring-2 focus:ring-blue-100 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
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
                  onClick={() => alert('Dynamic routing setup active')}
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
              className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Tags
            </label>
            <div className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-400 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
              <span>Select tags</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
