'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CampaignDetailsFormCardProps {
  campaignName: string;
  onCampaignNameChange: (val: string) => void;
  selectedChannels: string[];
  onToggleChannel: (channel: string) => void;
  initialLinkUrl: string;
  onInitialLinkUrlChange: (val: string) => void;
  initialLinkChannel: string;
  onInitialLinkChannelChange: (val: string) => void;
  initialLinkTitle: string;
  onInitialLinkTitleChange: (val: string) => void;
  errorName?: string;
}

const AVAILABLE_CHANNELS = [
  { id: 'email', label: 'Email' },
  { id: 'social', label: 'Social Media' },
  { id: 'sms', label: 'SMS' },
  { id: 'paid', label: 'Paid / Ads' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'newsletters', label: 'Newsletters' },
  { id: 'other', label: 'Other' },
];

export const CampaignDetailsFormCard: React.FC<CampaignDetailsFormCardProps> = ({
  campaignName,
  onCampaignNameChange,
  selectedChannels,
  onToggleChannel,
  initialLinkUrl,
  onInitialLinkUrlChange,
  initialLinkChannel,
  onInitialLinkChannelChange,
  initialLinkTitle,
  onInitialLinkTitleChange,
  errorName,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-[#273144] dark:text-slate-100">
            Campaign details
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Collapse Campaign details section"
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-5">
          <p className="text-sm text-[#526281] dark:text-slate-400">
            Create a campaign to group your links by marketing channels and track combined performance.
          </p>

          {/* Campaign Name */}
          <div className="space-y-1.5">
            <label htmlFor="campaign-name" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Campaign Name *
            </label>
            <input
              id="campaign-name"
              type="text"
              value={campaignName}
              onChange={(e) => onCampaignNameChange(e.target.value)}
              placeholder="e.g. Fall Promo 2026, Q3 Product Launch"
              className={cn(
                'w-full h-11 rounded-lg border bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:ring-2 focus:ring-blue-100 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
                errorName ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300'
              )}
            />
            {errorName && <p className="text-sm font-medium text-red-600">{errorName}</p>}
          </div>

          {/* Channel Selection Chips */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Marketing Channels <span className="font-normal text-slate-400">(select channels for this campaign)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_CHANNELS.map((ch) => {
                const isSelected = selectedChannels.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => onToggleChannel(ch.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all cursor-pointer select-none',
                      isSelected
                        ? 'bg-blue-50 border-[#2a5bd7] text-[#2a5bd7] dark:bg-blue-950/60 dark:border-blue-500 dark:text-blue-400 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                    )}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                    <span>{ch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional First Link Section */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#273144] dark:text-slate-200">
                Add initial link to campaign <span className="font-normal text-slate-400">(optional)</span>
              </h3>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="initial-link-url" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                Destination URL
              </label>
              <input
                id="initial-link-url"
                type="text"
                value={initialLinkUrl}
                onChange={(e) => onInitialLinkUrlChange(e.target.value)}
                placeholder="https://example.com/my-campaign-landing"
                className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                  Channel for this link
                </label>
                <select
                  value={initialLinkChannel}
                  onChange={(e) => onInitialLinkChannelChange(e.target.value)}
                  className="w-full h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="email">Email</option>
                  <option value="social">Social Media</option>
                  <option value="sms">SMS</option>
                  <option value="paid">Paid / Ads</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="newsletters">Newsletters</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="link-title" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                  Link Title <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  id="link-title"
                  type="text"
                  value={initialLinkTitle}
                  onChange={(e) => onInitialLinkTitleChange(e.target.value)}
                  placeholder="e.g. Promo Newsletter Link"
                  className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
