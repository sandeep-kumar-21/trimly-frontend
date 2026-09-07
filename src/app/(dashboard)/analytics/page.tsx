'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsFilterBar } from '@/components/analytics/AnalyticsFilterBar';
import { TopMetricsCards } from '@/components/analytics/TopMetricsCards';
import { ReferrerBreakdown } from '@/components/analytics/ReferrerBreakdown';
import { DeviceBreakdown } from '@/components/analytics/DeviceBreakdown';
import { CountryBreakdown } from '@/components/analytics/CountryBreakdown';
import { OsBreakdown } from '@/components/analytics/OsBreakdown';
import { UtmBreakdown } from '@/components/analytics/UtmBreakdown';
import { LiveActivityFeed } from '@/components/analytics/LiveActivityFeed';

const ClicksLineChart = dynamic(
  () => import('@/components/analytics/ClicksLineChart').then((mod) => mod.ClicksLineChart),
  { ssr: false }
);

export default function AnalyticsDashboardPage() {
  const { data: analyticsData, isLoading } = useAnalytics();

  const summary = analyticsData?.summary;
  const timeSeries = analyticsData?.timeSeries || [];
  const countries = analyticsData?.locations?.countries || [];
  const cities = analyticsData?.locations?.cities || [];
  const referrers = analyticsData?.referrers || [];
  const devices = analyticsData?.platforms?.devices || [];
  const os = analyticsData?.platforms?.os || [];
  const browsers = analyticsData?.platforms?.browsers || [];
  const utmSources = analyticsData?.utms?.sources || [];
  const utmMediums = analyticsData?.utms?.mediums || [];
  const utmCampaigns = analyticsData?.utms?.campaigns || [];
  const recentClicks = analyticsData?.recentActivity || [];
  const totalClicks = summary?.totalClicks || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
          Analytics & Insights
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time audience intelligence, traffic attribution, location telemetry, and hardware breakdowns.
        </p>
      </div>

      {/* 1. Global Filter Control Bar */}
      <AnalyticsFilterBar analyticsData={analyticsData} isLoading={isLoading} />

      {/* 2. Executive KPI Scorecards */}
      <TopMetricsCards summary={summary} isLoading={isLoading} />

      {/* 4. Engagements Over Time Dual-Period Line/Area Chart */}
      <ClicksLineChart data={timeSeries} isLoading={isLoading} />

      {/* 5. Row: Traffic Sources & Hardware Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReferrerBreakdown
          data={referrers}
          totalClicks={totalClicks}
          isLoading={isLoading}
        />
        <DeviceBreakdown
          data={devices}
          totalClicks={totalClicks}
          isLoading={isLoading}
        />
      </div>

      {/* 6. Row: Geographic Intelligence & Platform/OS Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CountryBreakdown
          countries={countries}
          cities={cities}
          totalClicks={totalClicks}
          isLoading={isLoading}
        />
        <OsBreakdown
          osData={os}
          browserData={browsers}
          totalClicks={totalClicks}
          isLoading={isLoading}
        />
      </div>

      {/* 7. Row: Inbound UTM Campaign Tracking */}
      <UtmBreakdown
        sources={utmSources}
        mediums={utmMediums}
        campaigns={utmCampaigns}
        totalClicks={totalClicks}
        isLoading={isLoading}
      />

      {/* 8. Row: Live Activity Stream (15s Auto-polling) */}
      <LiveActivityFeed initialClicks={recentClicks} />
    </div>
  );
}

