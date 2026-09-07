'use client';

import React from 'react';
import { UtmMetric } from '@/types/analytics.types';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { Tag, Megaphone, Layers, Split } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';
import { SegmentedSwitch } from '@/components/ui/SegmentedSwitch';

export interface UtmBreakdownProps {
  sources?: UtmMetric[];
  mediums?: UtmMetric[];
  campaigns?: UtmMetric[];
  totalClicks?: number;
  isLoading?: boolean;
}

export const UtmBreakdown: React.FC<UtmBreakdownProps> = ({
  sources = [],
  mediums = [],
  campaigns = [],
  totalClicks = 0,
  isLoading = false,
}) => {
  const { activeUtmTab, setActiveUtmTab } = useAnalyticsStore();

  const activeList =
    activeUtmTab === 'sources'
      ? sources
      : activeUtmTab === 'mediums'
      ? mediums
      : campaigns;

  if (isLoading) {
    return (
      <div className="h-80 w-full animate-pulse rounded-xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60" />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Tag className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#273144] dark:text-slate-100">
              UTM Campaign Tracking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inbound marketing attribution by Source, Medium & Campaign
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <SegmentedSwitch<'sources' | 'mediums' | 'campaigns'>
          size="sm"
          options={[
            { value: 'sources', label: 'Source', icon: <Split className="h-3 w-3" /> },
            { value: 'mediums', label: 'Medium', icon: <Layers className="h-3 w-3" /> },
            { value: 'campaigns', label: 'Campaign', icon: <Megaphone className="h-3 w-3" /> },
          ]}
          value={activeUtmTab}
          onChange={setActiveUtmTab}
        />
      </div>

      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-12 text-xs font-semibold text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="col-span-8">Parameter Value</div>
          <div className="col-span-4 text-right">Engagements</div>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {activeList.length > 0 ? (
            activeList.map((item, index) => {
              const pct = totalClicks > 0 ? Math.round((item.count / totalClicks) * 100) : 0;
              return (
                <div key={index} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="font-semibold text-[#273144] dark:text-slate-200 truncate">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#273144] dark:text-white">
                        {formatNumber(item.count)}
                      </span>
                      <span className="text-[11px] text-slate-400">({pct}%)</span>
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
              No {activeUtmTab.slice(0, -1)} parameters tagged on clicked links yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
