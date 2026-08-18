'use client';

import React from 'react';
import { ChannelGroup } from '@/types/campaign.types';
import { StatCard } from '@/components/analytics/StatCard';
import { formatNumber } from '@/lib/utils/formatNumber';
import { toast } from 'sonner';
import {
  Mail,
  Share2,
  MessageSquare,
  DollarSign,
  Globe,
  ExternalLink,
  Copy,
  Link2,
  MousePointerClick,
  Layers,
} from 'lucide-react';

interface ChannelBreakdownProps {
  channels: ChannelGroup[];
  totalClicks: number;
  totalLinks: number;
}

const channelIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-5 w-5 text-sky-500" />,
  social: <Share2 className="h-5 w-5 text-indigo-500" />,
  sms: <MessageSquare className="h-5 w-5 text-emerald-500" />,
  paid: <DollarSign className="h-5 w-5 text-amber-500" />,
  other: <Globe className="h-5 w-5 text-purple-500" />,
};

const channelBadgeStyles: Record<string, string> = {
  email: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800',
  social: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
  sms: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  paid: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  other: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
};

const channelProgressColors: Record<string, string> = {
  email: 'bg-sky-500',
  social: 'bg-indigo-500',
  sms: 'bg-emerald-500',
  paid: 'bg-amber-500',
  other: 'bg-purple-500',
};

export const ChannelBreakdown: React.FC<ChannelBreakdownProps> = ({
  channels,
  totalClicks,
  totalLinks,
}) => {
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Copied link to clipboard!', { description: url });
  };

  return (
    <div className="space-y-8">
      {/* Overview StatCards (Reusing existing StatCard component) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Campaign Clicks"
          value={formatNumber(totalClicks)}
          description="Aggregated engagements across all channels"
          icon={<MousePointerClick className="h-5 w-5 text-emerald-500" />}
        />
        <StatCard
          title="Total Links"
          value={formatNumber(totalLinks)}
          description="Active campaign short links"
          icon={<Link2 className="h-5 w-5 text-indigo-500" />}
        />
        <StatCard
          title="Active Channels"
          value={channels.length}
          description="Distribution across marketing channels"
          icon={<Layers className="h-5 w-5 text-sky-500" />}
        />
      </div>

      {/* Channel Groups Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Links Grouped by Channel
        </h2>

        {channels.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            No links have been assigned to this campaign yet.
          </div>
        ) : (
          channels.map((group) => {
            const channelKey = group.channel ? group.channel.toLowerCase() : 'other';
            const icon = channelIcons[channelKey] || channelIcons.other;
            const badgeStyle = channelBadgeStyles[channelKey] || channelBadgeStyles.other;
            const progressColor = channelProgressColors[channelKey] || channelProgressColors.other;
            const pct = totalClicks > 0 ? Math.round((group.totalClicks / totalClicks) * 100) : 0;

            return (
              <div
                key={group.channel}
                className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                {/* Channel Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold capitalize text-slate-900 dark:text-slate-100">
                          {group.channel || 'Other / Unassigned'}
                        </h3>
                        <span
                          className={`text-sm font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}
                        >
                          {group.links.length} {group.links.length === 1 ? 'link' : 'links'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {formatNumber(group.totalClicks)} clicks ({pct}% of campaign total)
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-48">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Grouped Links List */}
                <div className="space-y-3 pt-2">
                  {group.links.map((link) => {
                    const shortUrl = link.shortUrl || `/${link.shortCode}`;
                    return (
                      <div
                        key={link._id || link.shortCode}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-800/30 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400 truncate">
                              /{link.shortCode}
                            </span>
                            {link.title && (
                              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">
                                • {link.title}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate max-w-xl">
                            {link.longUrl}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-200">
                            <MousePointerClick className="h-3.5 w-3.5 text-emerald-500" />
                            <span>{formatNumber(link.clickCount || 0)} clicks</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopyLink(shortUrl)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                              title="Copy short link"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <a
                              href={shortUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                              title="Open short link"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
