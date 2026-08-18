'use client';

import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';
import { formatDate } from '@/lib/utils/formatDate';

export interface TopMetricsCardsProps {
  topDay?: { date: string; count: number } | null;
  topCountry?: { name: string; count: number } | null;
}

const COUNTRY_FLAGS: Record<string, { name: string; flag: string }> = {
  IN: { name: 'India', flag: '🇮🇳' },
  US: { name: 'United States', flag: '🇺🇸' },
  GB: { name: 'United Kingdom', flag: '🇬🇧' },
  CA: { name: 'Canada', flag: '🇨🇦' },
  AU: { name: 'Australia', flag: '🇦🇺' },
  DE: { name: 'Germany', flag: '🇩🇪' },
  FR: { name: 'France', flag: '🇫🇷' },
  ES: { name: 'Spain', flag: '🇪🇸' },
};

export const TopMetricsCards: React.FC<TopMetricsCardsProps> = ({ topDay, topCountry }) => {
  const dayStr = topDay?.date ? formatDate(topDay.date) : 'No recent traffic';
  const dayCount = topDay?.count || 0;

  const countryKey = topCountry?.name ? topCountry.name.toUpperCase() : 'IN';
  const countryInfo = COUNTRY_FLAGS[countryKey] || {
    name: topCountry?.name || 'India',
    flag: '🇮🇳',
  };
  const countryCount = topCountry?.count || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Top Day Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>Top day by engagements</span>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {dayStr}
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatNumber(dayCount)}
            </span>
            <span className="text-sm font-semibold text-slate-500">engagements</span>
          </div>
        </div>
      </div>

      {/* Top Location Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>Top location by engagements</span>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-2xl">{countryInfo.flag}</span>
            <span>{countryInfo.name}</span>
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatNumber(countryCount)}
            </span>
            <span className="text-sm font-semibold text-slate-500">engagements</span>
          </div>
        </div>
      </div>
    </div>
  );
};
