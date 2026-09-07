'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TimeSeriesPoint } from '@/types/analytics.types';
import { useAnalyticsStore, ChartMetric } from '@/store/useAnalyticsStore';
import { TrendingUp, MousePointerClick, Users } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';
import { SegmentedSwitch } from '@/components/ui/SegmentedSwitch';

export interface ClicksLineChartProps {
  data?: any[];
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
}

export const ClicksLineChart: React.FC<ClicksLineChartProps> = ({
  data = [],
  title = 'Engagements over time',
  subtitle = 'Engagement and redirect activity trend',
  isLoading,
}) => {
  const { compareMode, chartMetric, setChartMetric } = useAnalyticsStore();

  if (isLoading) {
    return (
      <div className="h-80 w-full animate-pulse rounded-xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60" />
    );
  }

  const generateZeroBaseline = () => {
    const days = 7;
    const points = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      points.push({
        date: label,
        current: 0,
        previous: 0,
        currentUniques: 0,
      });
    }
    return points;
  };

  const chartData =
    data && data.length > 0
      ? data.map((d: any) => {
          const count = d.current ?? d.count ?? 0;
          return {
            date: d.date,
            current: chartMetric === 'uniques' ? (d.currentUniques ?? count) : count,
            previous: d.previous ?? Math.round(count * 0.8),
            currentUniques: d.currentUniques ?? count,
          };
        })
      : generateZeroBaseline();

  const isZeroState = chartData.every((pt) => pt.current === 0);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-[#273144] dark:text-slate-100">
              {title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {subtitle || 'Daily link clicks and QR code scans'}
          </p>
        </div>

        {/* Metric Selector & Legend */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Clicks vs Uniques Switcher */}
          <SegmentedSwitch<ChartMetric>
            size="sm"
            options={[
              { value: 'clicks', label: 'Clicks', icon: <MousePointerClick className="h-3 w-3" /> },
              { value: 'uniques', label: 'Unique Visitors', icon: <Users className="h-3 w-3" /> },
            ]}
            value={chartMetric}
            onChange={setChartMetric}
          />

          {/* Chart Legend */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2a5bd7]" />
              <span>Current</span>
            </div>
            {compareMode && (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#93c5fd]" />
                <span className="text-slate-400">Previous</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-72 w-full pt-2">
        {isZeroState && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <div className="rounded-xl border border-slate-200/80 bg-white/95 px-4 py-2.5 text-center shadow-xs backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/95">
              <p className="text-xs font-bold text-[#273144] dark:text-slate-200">
                No engagements recorded for this period yet
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Share your short links or QR codes to start capturing live audience insights
              </p>
            </div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2a5bd7" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2a5bd7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/80" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={16}
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
              formatter={(val: any, name: any) => [
                `${formatNumber(Number(val))} ${chartMetric === 'clicks' ? 'clicks' : 'uniques'}`,
                name === 'current' ? 'Current Period' : 'Previous Period',
              ]}
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#2a5bd7"
              strokeWidth={2.5}
              fill="url(#currentGradient)"
              dot={{ r: 3, fill: '#2a5bd7', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#2a5bd7', stroke: '#ffffff', strokeWidth: 2 }}
            />
            {compareMode && (
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#93c5fd"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
