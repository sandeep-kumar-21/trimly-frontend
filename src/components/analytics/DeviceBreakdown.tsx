'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { BreakdownMetric } from '@/types/analytics.types';
import { Smartphone, Monitor, Tablet, HelpCircle, HardDrive } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';

export interface DeviceBreakdownProps {
  data: BreakdownMetric[];
  totalClicks?: number;
}

const PIE_COLORS = ['#0EA5E9', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'];

export const DeviceBreakdown: React.FC<DeviceBreakdownProps> = ({ data, totalClicks = 0 }) => {
  const devices = data && data.length > 0 ? data : [
    { name: 'Desktop', count: totalClicks || 0 },
  ];

  const getDeviceIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('mobile') || lower.includes('phone')) return <Smartphone className="h-4 w-4 text-sky-500" />;
    if (lower.includes('tablet')) return <Tablet className="h-4 w-4 text-amber-500" />;
    if (lower.includes('desktop')) return <Monitor className="h-4 w-4 text-blue-500" />;
    return <HardDrive className="h-4 w-4 text-purple-500" />;
  };

  const chartData = devices.map((d) => ({
    name: d.name,
    value: d.count,
  }));

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
          <Monitor className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Engagements by Device
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hardware & OS platform breakdown
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 py-2">
        {/* Recharts Donut Pie Chart with center total count */}
        <div className="relative h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
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
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val} Clicks`, 'Device']}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {formatNumber(totalClicks)}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Clicks
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2.5">
          {devices.map((item, index) => {
            const pct = totalClicks > 0 ? Math.round((item.count / totalClicks) * 100) : 100;
            const color = PIE_COLORS[index % PIE_COLORS.length];
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold">
                    {getDeviceIcon(item.name)}
                    <span>{item.name}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatNumber(item.count)} <span className="text-slate-400 font-normal">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
