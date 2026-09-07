'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BreakdownMetric } from '@/types/analytics.types';
import { LinkIcon } from '@/components/icons/AppIcons';
import { Share2, Globe, Search, Mail, Megaphone } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';

export interface ReferrerBreakdownProps {
  data?: BreakdownMetric[];
  totalClicks?: number;
  isLoading?: boolean;
}

const formatReferrerName = (name: string): string => {
  if (!name || name.toLowerCase().includes('direct') || name.toLowerCase().includes('none')) {
    return 'Direct / None';
  }
  try {
    if (name.startsWith('http://') || name.startsWith('https://')) {
      const url = new URL(name);
      return url.hostname.replace(/^www\./, '');
    }
    return name.replace(/^www\./, '');
  } catch {
    return name;
  }
};

export const ReferrerBreakdown: React.FC<ReferrerBreakdownProps> = ({
  data = [],
  totalClicks = 0,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="h-80 w-full animate-pulse rounded-xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60" />
    );
  }

  const referrers = data || [];
  const hasData = referrers.length > 0 && totalClicks > 0;

  const getReferrerIcon = (name: string, category?: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('google') || lower.includes('bing') || category === 'Search')
      return <Search className="h-3.5 w-3.5 text-slate-500 shrink-0" />;
    if (lower.includes('trimly') || lower.includes('bitly'))
      return <LinkIcon className="h-3.5 w-3.5 text-slate-500 shrink-0" />;
    if (lower.includes('mail') || category === 'Email')
      return <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />;
    if (category === 'Ads')
      return <Megaphone className="h-3.5 w-3.5 text-slate-500 shrink-0" />;
    return <Globe className="h-3.5 w-3.5 text-slate-500 shrink-0" />;
  };

  const chartData = referrers.slice(0, 6).map((r) => {
    const formatted = formatReferrerName(r.name);
    return {
      name: formatted.length > 14 ? formatted.slice(0, 14) + '...' : formatted,
      fullName: formatted,
      count: r.count,
      percentage: r.percentage ?? (totalClicks > 0 ? Math.round((r.count / totalClicks) * 100) : 0),
    };
  });

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Share2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#273144] dark:text-slate-100">
              Traffic Sources & Referrers
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Top referring domains and inbound traffic channels
            </p>
          </div>
        </div>
      </div>

      {hasData ? (
        <>
          {/* Mini Bar Chart */}
          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/80" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${formatNumber(Number(val))} clicks`, 'Traffic']}
                />
                <Bar dataKey="count" fill="#2a5bd7" maxBarSize={32} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ranked List */}
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {referrers.slice(0, 6).map((item, index) => {
              const formattedName = formatReferrerName(item.name);
              const pct = item.percentage ?? (totalClicks > 0 ? Math.round((item.count / totalClicks) * 100) : 0);
              return (
                <div key={index} className="space-y-1 text-xs py-0.5 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate pr-2">
                      {getReferrerIcon(item.name, item.category)}
                      <span className="font-semibold text-[#273144] dark:text-slate-200 truncate">
                        {formattedName}
                      </span>
                      {item.category && (
                        <span className="rounded-xs bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {item.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-[#273144] dark:text-white">
                        {formatNumber(item.count)}
                      </span>
                      <span className="w-8 text-right font-medium text-slate-400">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-[#2a5bd7] transition-all duration-300"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <Share2 className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            No referrer sources yet
          </p>
          <p className="text-[11px] text-slate-400 max-w-[240px]">
            Inbound domains, social networks, and search traffic will populate automatically here.
          </p>
        </div>
      )}
    </div>
  );
};
