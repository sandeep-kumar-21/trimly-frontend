'use client';

import { LocationCountryMetric, LocationCityMetric, BreakdownMetric } from '@/types/analytics.types';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { MapPin, Globe, Building2 } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';
import { SegmentedSwitch } from '@/components/ui/SegmentedSwitch';

export interface CountryBreakdownProps {
  data?: BreakdownMetric[];
  countries?: LocationCountryMetric[];
  cities?: LocationCityMetric[];
  totalClicks?: number;
  isLoading?: boolean;
}

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
  IT: { name: 'Italy', flag: '🇮🇹' },
  SE: { name: 'Sweden', flag: '🇸🇪' },
  CH: { name: 'Switzerland', flag: '🇨🇭' },
  ID: { name: 'Indonesia', flag: '🇮🇩' },
  PK: { name: 'Pakistan', flag: '🇵🇰' },
  BD: { name: 'Bangladesh', flag: '🇧🇩' },
};

export const CountryBreakdown: React.FC<CountryBreakdownProps> = ({
  data,
  countries = [],
  cities = [],
  totalClicks = 0,
  isLoading,
}) => {
  const { activeGeoTab, setActiveGeoTab } = useAnalyticsStore();

  if (isLoading) {
    return (
      <div className="h-80 w-full animate-pulse rounded-xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60" />
    );
  }

  const getCountryInfo = (codeOrName: string) => {
    const uppercase = codeOrName.toUpperCase();
    if (COUNTRY_MAP[uppercase]) {
      return { ...COUNTRY_MAP[uppercase], flag: COUNTRY_MAP[uppercase].flag };
    }
    for (const key of Object.keys(COUNTRY_MAP)) {
      if (COUNTRY_MAP[key].name.toLowerCase() === codeOrName.toLowerCase()) {
        return { ...COUNTRY_MAP[key], flag: COUNTRY_MAP[key].flag };
      }
    }
    return {
      name: codeOrName && codeOrName !== 'Unknown' ? codeOrName : 'Unknown / Direct',
      flag: null,
    };
  };

  const rawList = countries.length > 0 ? countries : data || [];
  const activeCountries = rawList.filter((c) => c.count > 0 || rawList.length > 0);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col">
      {/* Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#273144] dark:text-slate-100">
              Geographic Intelligence
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audience location & metropolitan breakdown
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <SegmentedSwitch<'countries' | 'cities'>
          size="sm"
          options={[
            { value: 'countries', label: 'Countries', icon: <Globe className="h-3 w-3" /> },
            { value: 'cities', label: 'Top Cities', icon: <Building2 className="h-3 w-3" /> },
          ]}
          value={activeGeoTab}
          onChange={setActiveGeoTab}
        />
      </div>

      {/* Content Body */}
      {activeGeoTab === 'countries' ? (
        activeCountries.length > 0 ? (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-12 text-xs font-semibold text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800">
              <div className="col-span-6">Country</div>
              <div className="col-span-3 text-right">Clicks</div>
              <div className="col-span-3 text-right">Share</div>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {activeCountries.slice(0, 7).map((item, index) => {
                const info = getCountryInfo(item.name);
                const pct = item.percentage ?? (totalClicks > 0 ? Math.round((item.count / totalClicks) * 100) : 0);
                return (
                  <div key={index} className="space-y-1 text-xs">
                    <div className="grid grid-cols-12 items-center py-0.5">
                      <div className="col-span-6 flex items-center gap-2 font-semibold text-[#273144] dark:text-slate-200 truncate">
                        {info.flag ? (
                          <span className="text-sm leading-none">{info.flag}</span>
                        ) : (
                          <Globe className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        )}
                        <span className="truncate">{info.name}</span>
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
              })}
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <Globe className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              No location data yet
            </p>
            <p className="text-[11px] text-slate-400 max-w-[240px]">
              Geographic metrics will appear as visitors interact with your links from around the world.
            </p>
          </div>
        )
      ) : (
        cities.length > 0 ? (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-12 text-xs font-semibold text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800">
              <div className="col-span-6">City</div>
              <div className="col-span-3 text-right">Clicks</div>
              <div className="col-span-3 text-right">Share</div>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {cities.slice(0, 7).map((cityItem, index) => {
                const info = getCountryInfo(cityItem.country);
                const pct = cityItem.percentage ?? (totalClicks > 0 ? Math.round((cityItem.count / totalClicks) * 100) : 0);
                return (
                  <div key={index} className="space-y-1 text-xs">
                    <div className="grid grid-cols-12 items-center py-0.5">
                      <div className="col-span-6 flex items-center gap-2 font-semibold text-[#273144] dark:text-slate-200 truncate">
                        {info.flag ? (
                          <span className="text-sm leading-none">{info.flag}</span>
                        ) : (
                          <Globe className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        )}
                        <span className="truncate">{cityItem.city}</span>
                        <span className="rounded-xs bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {cityItem.country}
                        </span>
                      </div>
                      <div className="col-span-3 text-right font-bold text-[#273144] dark:text-white">
                        {formatNumber(cityItem.count)}
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
              })}
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <Building2 className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
              No metropolitan city data yet
            </p>
            <p className="text-[11px] text-slate-400 max-w-[240px]">
              Specific city and regional locations will automatically resolve as users click your links.
            </p>
          </div>
        )
      )}
    </div>
  );
};

