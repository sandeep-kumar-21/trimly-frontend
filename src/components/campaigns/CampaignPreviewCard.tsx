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

export const CampaignPreviewCard: React.FC<CampaignPreviewCardProps> = ({
  campaignName,
  selectedChannels,
  initialLinkUrl,
}) => {
  const displayName = campaignName.trim() || 'Fall Promo';
  const activeChannels = selectedChannels.length > 0 ? selectedChannels : ['linkedin', 'youtube', 'newsletters', 'email'];

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
                  {activeChannels.length} Channels | {initialLinkUrl ? 1 : 0} Link
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-[#0c3ebb] bg-blue-50 px-2.5 py-1 rounded-md dark:bg-blue-950/50 dark:text-blue-400">
                <Layers className="h-3.5 w-3.5" />
                <span>Active</span>
              </div>
            </div>

            {/* Channels Stack Mockup */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Grouped Channels
              </span>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {activeChannels.slice(0, 5).map((chKey, idx) => {
                  const label = CHANNEL_LABELS[chKey] || chKey;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-2xs dark:border-slate-800 dark:bg-slate-900 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#0c3ebb]" />
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
