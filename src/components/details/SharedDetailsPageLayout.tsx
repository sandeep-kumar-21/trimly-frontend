'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { linksApi } from '@/lib/api/links.api';
import { formatDate } from '@/lib/utils/formatDate';
import { SharedDetailsTitleBar } from '@/components/details/SharedDetailsTitleBar';
import { SharedDetailsInfoCard } from '@/components/details/SharedDetailsInfoCard';
import { SharedDetailsSharingCard } from '@/components/details/SharedDetailsSharingCard';
import { SharedDynamicRoutingCard } from '@/components/details/SharedDynamicRoutingCard';
import { useLinkAnalytics } from '@/hooks/useLinkAnalytics';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';

import { AnalyticsFilterBar } from '@/components/analytics/AnalyticsFilterBar';
import { TopMetricsCards } from '@/components/analytics/TopMetricsCards';
import { ClicksLineChart } from '@/components/analytics/ClicksLineChart';
import { ReferrerBreakdown } from '@/components/analytics/ReferrerBreakdown';
import { DeviceBreakdown } from '@/components/analytics/DeviceBreakdown';
import { CountryBreakdown } from '@/components/analytics/CountryBreakdown';
import { OsBreakdown } from '@/components/analytics/OsBreakdown';
import { UtmBreakdown } from '@/components/analytics/UtmBreakdown';

export interface SharedDetailsPageLayoutProps {
  type: 'link' | 'qrcode';
}

export const SharedDetailsPageLayout: React.FC<SharedDetailsPageLayoutProps> = ({ type }) => {
  const params = useParams();
  const code = (params?.code as string) || '';
  const isQrMode = type === 'qrcode';

  const { datePreset, customFrom, customTo } = useAnalyticsStore();

  const { data: analytics, isLoading: isAnalyticsLoading } = useLinkAnalytics(code, {
    preset: datePreset,
    from: customFrom || undefined,
    to: customTo || undefined,
  });

  const { data: link } = useQuery({
    queryKey: ['link', code],
    queryFn: () => linksApi.getLinkByCode(code),
    enabled: !!code,
  });

  const destinationUrl = link?.longUrl || '';
  const shortUrl = link?.shortUrl;

  const rawDomain = destinationUrl
    ? (() => {
        try {
          return new URL(destinationUrl).hostname;
        } catch {
          return 'trimly.link';
        }
      })()
    : 'trimly.link';

  const title = link?.title || (isQrMode ? `Untitled ${code}` : `${rawDomain} – untitled`);
  const createdOn = link?.createdAt ? formatDate(link.createdAt) : 'Recently';
  const totalClicks = analytics?.summary?.totalClicks ?? 0;

  const hasUtmData = Boolean(
    (analytics?.utms?.sources && analytics.utms.sources.length > 0) ||
    (analytics?.utms?.mediums && analytics.utms.mediums.length > 0) ||
    (analytics?.utms?.campaigns && analytics.utms.campaigns.length > 0)
  );

  return (
    <div className="w-full space-y-6">
      {/* 1. Details Title Bar */}
      <SharedDetailsTitleBar
        type={type}
        title={title}
        shortCode={code}
        faviconDomain={rawDomain}
        isHidden={link?.isHidden}
        visibleAsLink={link?.visibleAsLink}
        linkId={link?._id}
      />

      {/* 2. Top Heading 2-Column Grid (Details Info Card + QR Code Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Details Info Card */}
        <div className="lg:col-span-7 flex flex-col">
          <SharedDetailsInfoCard
            type={type}
            shortCode={code}
            destinationUrl={destinationUrl}
            shortUrl={shortUrl}
            createdOn={createdOn}
            tags={link?.tags || []}
            visibleAsLink={link?.visibleAsLink}
          />
        </div>

        {/* Right Column: QR Code Card */}
        <div className="lg:col-span-5 flex flex-col">
          <SharedDetailsSharingCard
            type={type}
            shortCode={code}
            destinationUrl={destinationUrl}
            shortUrl={shortUrl}
            hasQR={link?.hasQR}
          />
        </div>
      </div>

      {/* 3. Dynamic Routing Banner (Bitly-style feature placeholder) */}
      <SharedDynamicRoutingCard />

      {/* 4. Complete Analytics Engine for this specific Link or QR Code */}
      <div className="space-y-6 pt-2">
        {/* Filter Bar (Date Presets, Compare Toggle, CSV Export) */}
        <AnalyticsFilterBar
          analyticsData={analytics}
          isLoading={isAnalyticsLoading}
          hideScopeSelector={true}
          scopeLabel={isQrMode ? `QR Code Telemetry (trim.ly/${code})` : `Link Telemetry (trim.ly/${code})`}
        />

        {/* Executive KPI Scorecards */}
        <TopMetricsCards summary={analytics?.summary} isLoading={isAnalyticsLoading} />

        {/* Engagements / Scans Over Time Chart */}
        <ClicksLineChart
          data={analytics?.timeSeries}
          title={isQrMode ? 'Scans over time' : 'Engagements over time'}
          subtitle={
            isQrMode
              ? 'Total QR code scans compared to previous period'
              : 'Total link engagements compared to previous period'
          }
          isLoading={isAnalyticsLoading}
        />

        {/* Row: Traffic Sources & Device Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReferrerBreakdown
            data={analytics?.referrers}
            totalClicks={totalClicks}
            isLoading={isAnalyticsLoading}
          />
          <DeviceBreakdown
            data={analytics?.platforms?.devices}
            totalClicks={totalClicks}
            isLoading={isAnalyticsLoading}
          />
        </div>

        {/* Row: Geographic Intelligence & Platform/OS Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CountryBreakdown
            countries={analytics?.locations?.countries}
            cities={analytics?.locations?.cities}
            totalClicks={totalClicks}
            isLoading={isAnalyticsLoading}
          />
          <OsBreakdown
            osData={analytics?.platforms?.os}
            browserData={analytics?.platforms?.browsers}
            totalClicks={totalClicks}
            isLoading={isAnalyticsLoading}
          />
        </div>

        {/* Row: Inbound UTM Campaign Tracking (Only shown when UTM tags are detected) */}
        {hasUtmData && (
          <UtmBreakdown
            sources={analytics?.utms?.sources}
            mediums={analytics?.utms?.mediums}
            campaigns={analytics?.utms?.campaigns}
            totalClicks={totalClicks}
            isLoading={isAnalyticsLoading}
          />
        )}
      </div>
    </div>
  );
};
