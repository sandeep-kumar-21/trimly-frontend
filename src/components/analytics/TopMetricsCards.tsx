'use client';

import React from 'react';
import { AnalyticsSummary } from '@/types/analytics.types';
import { formatNumber } from '@/lib/utils/formatNumber';
import { QrCodeIcon, LinkIcon } from '@/components/icons/AppIcons';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MousePointerClick,
  Globe,
  Share2,
  Award,
} from 'lucide-react';

export interface TopMetricsCardsProps {
  summary?: AnalyticsSummary;
  isLoading?: boolean;
}

export const TopMetricsCards: React.FC<TopMetricsCardsProps> = ({
  summary,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60"
          />
        ))}
      </div>
    );
  }

  const totalClicks = summary?.totalClicks ?? 0;
  const clicksGrowth = summary?.clicksGrowth ?? 0;
  const uniqueVisitors = summary?.uniqueVisitors ?? 0;
  const uniqueGrowth = summary?.uniqueGrowth ?? 0;
  const qrScans = summary?.qrScans ?? 0;
  const qrPercentage = summary?.qrPercentage ?? 0;
  const topCountry = summary?.topCountry || 'Global';
  const topReferrer = summary?.topReferrer || 'Direct / None';
  const topLink = summary?.topLink;

  const uniquenessRatio =
    totalClicks > 0 ? Math.round((uniqueVisitors / totalClicks) * 100) : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Engagements */}
      <div className="group relative rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Engagements
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <MousePointerClick className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
            {formatNumber(totalClicks)}
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
              {clicksGrowth >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              )}
              {clicksGrowth >= 0 ? `+${clicksGrowth}%` : `${clicksGrowth}%`}
            </span>
            <span>vs prior period</span>
          </div>
        </div>
      </div>

      {/* 2. Unique Visitors */}
      <div className="group relative rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Unique Audience
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <Users className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
            {formatNumber(uniqueVisitors)}
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
              {uniqueGrowth >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              )}
              {uniqueGrowth >= 0 ? `+${uniqueGrowth}%` : `${uniqueGrowth}%`}
            </span>
            <span>·</span>
            <span>{uniquenessRatio}% unique rate</span>
          </div>
        </div>
      </div>

      {/* 3. QR Scans vs Direct Clicks */}
      <div className="group relative rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            QR Scans vs Web
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <QrCodeIcon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
              {formatNumber(qrScans)}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {qrPercentage}% scans
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-[#2a5bd7] transition-all duration-500"
              style={{ width: `${qrPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Top Performing Asset / Location */}
      <div className="group relative rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Top Performing Driver
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {topLink ? <LinkIcon className="h-4 w-4" /> : <Award className="h-4 w-4" />}
          </div>
        </div>

        <div className="mt-3">
          <div className="text-base sm:text-lg font-bold text-[#273144] dark:text-slate-100 truncate">
            {topLink ? topLink.title || `trim.ly/${topLink.shortCode}` : topReferrer}
          </div>

          <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="truncate text-slate-500">
              {topLink ? `trim.ly/${topLink.shortCode}` : `Top geo: ${topCountry}`}
            </span>
            {topLink && (
              <span className="font-semibold text-[#2a5bd7] dark:text-blue-400">
                {topLink.percentage}% share
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

