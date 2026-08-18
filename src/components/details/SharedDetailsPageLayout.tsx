'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { linksApi } from '@/lib/api/links.api';
import { formatDate } from '@/lib/utils/formatDate';
import { SharedDetailsTitleBar } from '@/components/details/SharedDetailsTitleBar';
import { SharedDetailsInfoCard } from '@/components/details/SharedDetailsInfoCard';
import { SharedDetailsSharingCard } from '@/components/details/SharedDetailsSharingCard';
import { SharedDynamicRoutingCard } from '@/components/details/SharedDynamicRoutingCard';
import { useLinkAnalytics } from '@/hooks/useLinkAnalytics';

// Dynamically import heavy analytics components to prevent blocking route transition
const ClicksLineChart = dynamic(
  () => import('@/components/analytics/ClicksLineChart').then((m) => m.ClicksLineChart),
  { ssr: false, loading: () => <div className="h-64 rounded-xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 animate-pulse" /> }
);

const ReferrerBreakdown = dynamic(
  () => import('@/components/analytics/ReferrerBreakdown').then((m) => m.ReferrerBreakdown),
  { ssr: false, loading: () => <div className="h-48 rounded-xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 animate-pulse" /> }
);

const DeviceBreakdown = dynamic(
  () => import('@/components/analytics/DeviceBreakdown').then((m) => m.DeviceBreakdown),
  { ssr: false, loading: () => <div className="h-48 rounded-xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 animate-pulse" /> }
);

const CountryBreakdown = dynamic(
  () => import('@/components/analytics/CountryBreakdown').then((m) => m.CountryBreakdown),
  { ssr: false, loading: () => <div className="h-48 rounded-xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 animate-pulse" /> }
);

export interface SharedDetailsPageLayoutProps {
  type: 'link' | 'qrcode';
}

export const SharedDetailsPageLayout: React.FC<SharedDetailsPageLayoutProps> = ({ type }) => {
  const params = useParams();
  const code = (params?.code as string) || '45MM1F1';
  const isQrMode = type === 'qrcode';

  const { data: analytics } = useLinkAnalytics(code);
  const { data: link } = useQuery({
    queryKey: ['link', code],
    queryFn: () => linksApi.getLinkByCode(code),
    enabled: !!code,
  });

  const destinationUrl = link?.longUrl || analytics?.longUrl || '';
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

  return (
    <div className="w-full space-y-6 pb-16">
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
          />
        </div>
      </div>

      {/* 3. Dynamic Routing Banner */}
      <SharedDynamicRoutingCard />

      {/* 4. Analytics Section - Dynamically loaded for instant navigation */}
      <div className="space-y-6">
        <ClicksLineChart
          data={analytics?.clicksByDate || analytics?.byDate}
          title={isQrMode ? 'Scans over time' : 'Engagements over time'}
          subtitle={isQrMode ? 'Total QR code scans compared to previous period' : 'Total link engagements compared to previous period'}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReferrerBreakdown
            data={analytics?.referrers || analytics?.byReferrer || []}
            totalClicks={analytics?.totalClicks}
          />
          <DeviceBreakdown
            data={analytics?.devices || []}
            totalClicks={analytics?.totalClicks || 0}
          />
        </div>

        <div>
          <CountryBreakdown
            data={analytics?.countries || []}
            totalClicks={analytics?.totalClicks || 0}
          />
        </div>
      </div>
    </div>
  );
};
