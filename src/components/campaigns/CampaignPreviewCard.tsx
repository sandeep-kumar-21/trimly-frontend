'use client';

import React from 'react';
import { ChevronDown, BarChart2, Layers, Link2 } from 'lucide-react';

interface CampaignPreviewCardProps {
  campaignName: string;
  selectedChannels: string[];
  initialLinkUrl?: string;
}

const CHANNEL_LABELS: Record<string, string> = {
  email: 'Email',
  social: 'Social Media',
  sms: 'SMS',
  paid: 'Paid / Ads',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  newsletters: 'Newsletters',
  other: 'Other',
};

const CHANNEL_DOT_COLORS: Record<string, string> = {
  email: 'bg-sky-500',
  social: 'bg-indigo-500',
  sms: 'bg-emerald-500',
  paid: 'bg-amber-500',
  linkedin: 'bg-blue-600',
  youtube: 'bg-red-500',
  newsletters: 'bg-purple-500',
  other: 'bg-slate-500',
};

export const CampaignPreviewCard: React.FC<CampaignPreviewCardProps> = ({
  campaignName,
  selectedChannels,
  initialLinkUrl,
}) => {
  const displayName = campaignName.trim() || 'Fall Promo';
  const activeChannels = selectedChannels;

  return (
    <div className="space-y-3 sticky top-6">
      <div className="flex items-center justify-between text-sm font-bold text-slate-500 uppercase tracking-wider">
        <span>Preview</span>
        <span className="text-[#2a5bd7] flex items-center gap-1 font-semibold normal-case">
          Live campaign view
        </span>
      </div>

      {/* Main Laptop / Desktop Mockup Frame */}
      <div className="relative rounded-xl border border-slate-200/90 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Laptop Screen Border Outer */}
        <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 space-y-4 shadow-inner">
          {/* Mock Browser Header / Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 dark:border-slate-800 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
              trimly.link/campaigns/{displayName.toLowerCase().replace(/\s+/g, '-')}
            </span>
            <div className="h-2 w-8 bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>

          {/* Campaign Header Box Mockup */}
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-[#273144] dark:text-slate-100">
                  <span>{displayName}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] font-semibold text-slate-400">
                  {activeChannels.length} Channels | {initialLinkUrl ? (activeChannels.length > 0 ? activeChannels.length : 1) : 0} {initialLinkUrl ? (activeChannels.length === 1 || activeChannels.length === 0 ? 'Link' : 'Links') : 'Links'}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-[#2a5bd7] bg-blue-50 px-2.5 py-1 rounded-md dark:bg-blue-950/50 dark:text-blue-400">
                <Layers className="h-3.5 w-3.5" />
                <span>Active</span>
              </div>
            </div>

            {/* Channels Stack Mockup */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Grouped Channels ({activeChannels.length})
              </span>

              {activeChannels.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 p-4 text-center">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    No marketing channels selected
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    Pick channels on the left to organize your campaign links
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {activeChannels.map((chKey, idx) => {
                    const label = CHANNEL_LABELS[chKey] || chKey.charAt(0).toUpperCase() + chKey.slice(1);
                    const dotColor = CHANNEL_DOT_COLORS[chKey.toLowerCase()] || 'bg-[#2a5bd7]';
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-2xs dark:border-slate-800 dark:bg-slate-900 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart2 className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-500 text-[11px]">
                            0 clicks
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {initialLinkUrl && (
              <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-2.5 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <Link2 className="h-3.5 w-3.5 shrink-0 text-[#2a5bd7]" />
                  <span className="truncate font-medium">{initialLinkUrl}</span>
                </div>
                <span className="text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded text-[#2a5bd7] dark:text-blue-300 shrink-0">
                  Initial Link
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Trimly Campaigns organizes links into channels for performance tracking.
        </p>
      </div>
    </div>
  );
};
