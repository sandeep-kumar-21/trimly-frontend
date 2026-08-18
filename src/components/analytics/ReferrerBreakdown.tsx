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
import { Share2, Globe, Search, Link2 } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';

export interface ReferrerDataPoint {
  name: string;
  count: number;
  prevCount?: number;
}

export interface ReferrerBreakdownProps {
  data: ReferrerDataPoint[];
  totalClicks?: number;
}

export const ReferrerBreakdown: React.FC<ReferrerBreakdownProps> = ({ data, totalClicks }) => {
  const referrers = data && data.length > 0 ? data : [
    { name: 'LinkedIn', count: 40, prevCount: 33 },
    { name: 'Google', count: 20, prevCount: 16 },
    { name: 'Trimly', count: 15, prevCount: 12 },
    { name: 'Direct', count: 8, prevCount: 7 },
    { name: 'Facebook', count: 5, prevCount: 4 },
    { name: 'Twitter', count: 5, prevCount: 4 },
    { name: 'Other', count: 4, prevCount: 3 },
  ];

  const total = totalClicks || referrers.reduce((acc, curr) => acc + curr.count, 0);

  const getReferrerIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('google')) return <Search className="h-4 w-4 text-red-500" />;
    if (lower.includes('trimly') || lower.includes('bitly')) return <Link2 className="h-4 w-4 text-indigo-600" />;
    return <Globe className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Share2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Engagements by referrer
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Top traffic sources & referring domains
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-xs bg-[#2563EB]" />
            <span>Engagements</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-xs bg-[#93C5FD]" />
            <span>Previous period</span>
          </div>
        </div>
      </div>

      {/* Dual Bar Chart */}
      <div className="h-52 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={referrers} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              angle={-30}
              textAnchor="end"
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
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" name="Engagements" fill="#2563EB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="prevCount" name="Previous period" fill="#93C5FD" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Structured Referrer List */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        {referrers.slice(0, 5).map((item, index) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 100;
          return (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 truncate max-w-[65%]">
                {getReferrerIcon(item.name)}
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <span className="text-slate-900 font-bold dark:text-white">
                  {formatNumber(item.count)}
                </span>
                <span className="text-slate-400 dark:text-slate-500">
                  ({pct}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
