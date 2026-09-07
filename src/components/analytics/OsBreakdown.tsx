'use client';

import React, { useState } from 'react';
import { BreakdownMetric } from '@/types/analytics.types';
import { Laptop, Compass, Cpu, Smartphone, Globe, Terminal } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';
import { SegmentedSwitch } from '@/components/ui/SegmentedSwitch';

export interface OsBreakdownProps {
  osData?: BreakdownMetric[];
  browserData?: BreakdownMetric[];
  totalClicks?: number;
  isLoading?: boolean;
}

export const OsBreakdown: React.FC<OsBreakdownProps> = ({
  osData = [],
  browserData = [],
  totalClicks = 0,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'os' | 'browsers'>('os');

  if (isLoading) {
    return (
      <div className="h-80 w-full animate-pulse rounded-xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60" />
    );
  }

  const activeList = activeTab === 'os' ? osData : browserData;

  const getPlatformIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('ios') || lower.includes('mac') || lower.includes('apple'))
      return <Laptop className="h-3.5 w-3.5 text-slate-500" />;
    if (lower.includes('android'))
      return <Smartphone className="h-3.5 w-3.5 text-slate-500" />;
    if (lower.includes('windows'))
      return <Laptop className="h-3.5 w-3.5 text-slate-500" />;
    if (lower.includes('linux'))
      return <Terminal className="h-3.5 w-3.5 text-slate-500" />;
    if (lower.includes('chrome') || lower.includes('safari') || lower.includes('firefox') || lower.includes('edge'))
      return <Globe className="h-3.5 w-3.5 text-slate-500" />;
    return <Cpu className="h-3.5 w-3.5 text-slate-500" />;
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#273144] dark:text-slate-100">
              Platform & OS Intelligence
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Operating system and browser software environment
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <SegmentedSwitch<'os' | 'browsers'>
          size="sm"
          options={[
            { value: 'os', label: 'OS', icon: <Laptop className="h-3 w-3" /> },
            { value: 'browsers', label: 'Browsers', icon: <Compass className="h-3 w-3" /> },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-12 text-xs font-semibold text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="col-span-6">{activeTab === 'os' ? 'Operating System' : 'Web Browser'}</div>
          <div className="col-span-3 text-right">Clicks</div>
          <div className="col-span-3 text-right">Share</div>
        </div>

        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
          {activeList.length > 0 ? (
            activeList.slice(0, 6).map((item, index) => {
              const pct = item.percentage ?? (totalClicks > 0 ? Math.round((item.count / totalClicks) * 100) : 0);
              return (
                <div key={index} className="space-y-1 text-xs">
                  <div className="grid grid-cols-12 items-center py-0.5">
                    <div className="col-span-6 flex items-center gap-2 font-semibold text-[#273144] dark:text-slate-200 truncate">
                      {getPlatformIcon(item.name)}
                      <span className="truncate">{item.name}</span>
                    </div>
                    <div className="col-span-3 text-right font-bold text-[#273144] dark:text-white">
                      {formatNumber(item.count)}
                    </div>
                    <div className="col-span-3 text-right font-medium text-slate-500 dark:text-slate-400">
                      {pct}%
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
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No platform analytics recorded for this period yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
