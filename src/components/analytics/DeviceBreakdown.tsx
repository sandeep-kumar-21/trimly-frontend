'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { BreakdownMetric } from '@/types/analytics.types';
import { Smartphone, Monitor, Tablet, HardDrive } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';

export interface DeviceBreakdownProps {
  data?: BreakdownMetric[];
  totalClicks?: number;
  isLoading?: boolean;
}

const PIE_COLORS = ['#2a5bd7', '#4f46e5', '#6366f1', '#93c5fd', '#cbd5e1'];

export const DeviceBreakdown: React.FC<DeviceBreakdownProps> = ({
  data = [],
  totalClicks = 0,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="h-80 w-full animate-pulse rounded-xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60" />
    );
  }

  const devices = data || [];
  const hasData = devices.length > 0 && totalClicks > 0;

  const getDeviceIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('mobile') || lower.includes('phone'))
      return <Smartphone className="h-3.5 w-3.5 text-slate-500" />;
    if (lower.includes('tablet'))
      return <Tablet className="h-3.5 w-3.5 text-slate-500" />;
    if (lower.includes('desktop'))
      return <Monitor className="h-3.5 w-3.5 text-slate-500" />;
    return <HardDrive className="h-3.5 w-3.5 text-slate-500" />;
  };

  const chartData = devices.map((d) => ({
    name: d.name,
    value: d.count,
  }));

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Monitor className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#273144] dark:text-slate-100">
              Device Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Desktop, Mobile & Tablet hardware breakdown
            </p>
          </div>
        </div>

        {hasData && (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {formatNumber(totalClicks)} Clicks
          </span>
        )}
      </div>

      {hasData ? (
        <div className="flex flex-col justify-between gap-4 pt-1">
          {/* Recharts Donut Pie Chart with center total count */}
          <div className="relative h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${formatNumber(Number(val))} clicks`, 'Device']}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-[#273144] dark:text-white">
                {formatNumber(totalClicks)}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Clicks
              </span>
            </div>
          </div>

          {/* Detailed Progress Bars List */}
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {devices.map((item, index) => {
              const pct = item.percentage ?? (totalClicks > 0 ? Math.round((item.count / totalClicks) * 100) : 0);
              const color = PIE_COLORS[index % PIE_COLORS.length];
              return (
                <div key={index} className="space-y-1 text-xs py-0.5 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      {getDeviceIcon(item.name)}
                      <span className="font-semibold text-[#273144] dark:text-slate-200 truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-[#273144] dark:text-white">
                        {formatNumber(item.count)}
                      </span>
                      <span className="w-10 text-right font-medium text-slate-400">
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <Monitor className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            No device telemetry yet
          </p>
          <p className="text-[11px] text-slate-400 max-w-[240px]">
            Desktop, mobile, and tablet platform metrics will appear as traffic interacts with your links.
          </p>
        </div>
      )}
    </div>
  );
};
