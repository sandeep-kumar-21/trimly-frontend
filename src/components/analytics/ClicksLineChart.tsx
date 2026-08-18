'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export interface DualLinePoint {
  date: string;
  current: number;
  previous: number;
}

export interface ClicksLineChartProps {
  data?: any[];
  title?: string;
  subtitle?: string;
}

export const ClicksLineChart: React.FC<ClicksLineChartProps> = ({
  data,
  title = 'Engagements over time',
  subtitle = 'Engagement and redirect activity trend',
}) => {
  const chartData = data && data.length > 0 ? data : [
    { date: 'Jul 19', current: 12, previous: 10 },
    { date: 'Jul 21', current: 19, previous: 16 },
    { date: 'Jul 23', current: 8, previous: 7 },
    { date: 'Jul 26', current: 31, previous: 25 },
    { date: 'Jul 28', current: 18, previous: 15 },
    { date: 'Jul 31', current: 35, previous: 29 },
    { date: 'Aug 02', current: 14, previous: 11 },
    { date: 'Aug 04', current: 40, previous: 33 },
    { date: 'Aug 06', current: 24, previous: 20 },
  ];

  // Map input count to current if single line
  const formattedData = chartData.map((d: any) => ({
    date: d.date,
    current: d.current ?? d.count ?? 0,
    previous: d.previous ?? Math.round((d.current ?? d.count ?? 0) * 0.8),
  }));

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-[#2563EB]" />
            <span>Engagements</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-[#93C5FD] border-b border-dashed border-[#2563EB]" />
            <span>Previous period</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
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
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="current"
              name="Engagements"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ r: 4, fill: '#2563EB' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="previous"
              name="Previous period"
              stroke="#60A5FA"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: '#60A5FA' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
