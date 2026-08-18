'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useOverallAnalytics } from '@/hooks/useOverallAnalytics';
import { ReferrerBreakdown } from '@/components/analytics/ReferrerBreakdown';
import { DeviceBreakdown } from '@/components/analytics/DeviceBreakdown';
import { CountryBreakdown } from '@/components/analytics/CountryBreakdown';
import { TopMetricsCards } from '@/components/analytics/TopMetricsCards';
import { Button } from '@/components/ui/Button';
import {
  BarChart2,
  Plus,
  Calendar,
  Download,
  ArrowLeft,
  ChevronRight,
  Filter,
  Globe,
  Trophy,
} from 'lucide-react';
import { AiSparklesIcon } from '@/components/icons/AppIcons';

const ClicksLineChart = dynamic(
  () => import('@/components/analytics/ClicksLineChart').then((mod) => mod.ClicksLineChart),
  { ssr: false }
);

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'main' | 'preview'>('main');

  const { data: analyticsData, isLoading } = useOverallAnalytics();

  const clicksOverTime = (analyticsData as any)?.clicksByDate || (analyticsData as any)?.timeSeries || [];
  const topReferrers = analyticsData?.referrers || [];
  const topDevices = analyticsData?.devices || [];
  const topCountries = analyticsData?.countries || [];

  // Render Preview Dashboard View
  if (activeView === 'preview') {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Top Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveView('main')}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Dashboards
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Preview dashboard
            </h1>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveView('main')}
          >
            Done
          </Button>
        </div>

        {/* Top Metrics Row */}
        <TopMetricsCards topDay={analyticsData?.topDay} topCountry={analyticsData?.topCountry} />

        {/* Main Chart */}
        <ClicksLineChart data={clicksOverTime} />

        {/* 3 Breakdown Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ReferrerBreakdown data={topReferrers} />
          <DeviceBreakdown data={topDevices} />
          <CountryBreakdown data={topCountries} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Analytics & Insights
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track engagement, redirects, device stats, and geographical data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" leftIcon={<Calendar className="h-4 w-4" />}>
            Last 7 days
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <TopMetricsCards topDay={analyticsData?.topDay} topCountry={analyticsData?.topCountry} />

      {/* Engagements Chart */}
      <ClicksLineChart data={clicksOverTime} />

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ReferrerBreakdown data={topReferrers} />
        <DeviceBreakdown data={topDevices} />
        <CountryBreakdown data={topCountries} />
      </div>
    </div>
  );
}
