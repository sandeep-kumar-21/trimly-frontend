'use client';

import React from 'react';
import { BreakdownMetric } from '@/types/analytics.types';
import { MapPin, Globe } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';

export interface CountryBreakdownProps {
  data: BreakdownMetric[];
  totalClicks?: number;
}

// Map ISO country codes to country name & emoji flag
const COUNTRY_MAP: Record<string, { name: string; flag: string }> = {
  IN: { name: 'India', flag: '🇮🇳' },
  US: { name: 'United States', flag: '🇺🇸' },
  GB: { name: 'United Kingdom', flag: '🇬🇧' },
  CA: { name: 'Canada', flag: '🇨🇦' },
  AU: { name: 'Australia', flag: '🇦🇺' },
  DE: { name: 'Germany', flag: '🇩🇪' },
  FR: { name: 'France', flag: '🇫🇷' },
  ES: { name: 'Spain', flag: '🇪🇸' },
  MX: { name: 'Mexico', flag: '🇲🇽' },
  JP: { name: 'Japan', flag: '🇯🇵' },
  BR: { name: 'Brazil', flag: '🇧🇷' },
  NL: { name: 'Netherlands', flag: '🇳🇱' },
  SG: { name: 'Singapore', flag: '🇸🇬' },
  AE: { name: 'United Arab Emirates', flag: '🇦🇪' },
};

export const CountryBreakdown: React.FC<CountryBreakdownProps> = ({ data, totalClicks = 0 }) => {
  const countries = data && data.length > 0 ? data : [
    { name: 'US', count: totalClicks || 0 },
  ];

  const getCountryInfo = (codeOrName: string) => {
    const uppercase = codeOrName.toUpperCase();
    if (COUNTRY_MAP[uppercase]) {
      return COUNTRY_MAP[uppercase];
    }
    // Check if code matches a country name key directly
    for (const key of Object.keys(COUNTRY_MAP)) {
      if (COUNTRY_MAP[key].name.toLowerCase() === codeOrName.toLowerCase()) {
        return COUNTRY_MAP[key];
      }
    }
    return { name: codeOrName !== 'Unknown' ? codeOrName : 'Unknown / Direct', flag: '🌐' };
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <MapPin className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Engagements by Location
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Geographic location distribution of link clicks
          </p>
        </div>
      </div>

      {/* Table Header */}
      <div className="space-y-3 pt-2">
        <div className="grid grid-cols-12 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="col-span-6">Country</div>
          <div className="col-span-3 text-right">Engagements</div>
          <div className="col-span-3 text-right">%</div>
        </div>

        {countries.slice(0, 7).map((item, index) => {
          const info = getCountryInfo(item.name);
          const pct = totalClicks > 0 ? Math.round((item.count / totalClicks) * 100) : 100;
          return (
            <div key={index} className="space-y-1 text-sm">
              <div className="grid grid-cols-12 items-center py-1">
                <div className="col-span-6 flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 truncate">
                  <span className="text-base leading-none">{info.flag}</span>
                  <span className="truncate">{info.name}</span>
                </div>
                <div className="col-span-3 text-right font-bold text-slate-900 dark:text-white">
                  {formatNumber(item.count)}
                </div>
                <div className="col-span-3 text-right font-medium text-slate-500 dark:text-slate-400">
                  {pct}%
                </div>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300 dark:bg-emerald-400"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
