import { useQuery } from '@tanstack/react-query';
import { analyticsApi, AnalyticsQueryOptions } from '@/lib/api/analytics.api';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';

export function useAnalytics() {
  const {
    selectedShortCode,
    selectedCampaignId,
    selectedChannel,
    datePreset,
    customFrom,
    customTo,
  } = useAnalyticsStore();

  const queryOptions: AnalyticsQueryOptions = {
    shortCode: selectedShortCode || undefined,
    campaignId: selectedCampaignId || undefined,
    channel: selectedChannel || undefined,
    preset: datePreset !== 'custom' ? datePreset : undefined,
    from: datePreset === 'custom' ? customFrom || undefined : undefined,
    to: datePreset === 'custom' ? customTo || undefined : undefined,
  };

  return useQuery({
    queryKey: [
      'analytics-dashboard',
      selectedShortCode,
      selectedCampaignId,
      selectedChannel,
      datePreset,
      customFrom,
      customTo,
    ],
    queryFn: () => analyticsApi.getDashboardAnalytics(queryOptions),
    staleTime: 1000 * 15, // 15s cache
    refetchInterval: 1000 * 30, // 30s background refresh
    refetchOnWindowFocus: true,
  });
}

export function useLiveClicks() {
  const isLivePolling = useAnalyticsStore((state) => state.isLivePolling);

  return useQuery({
    queryKey: ['live-clicks'],
    queryFn: () => analyticsApi.getRecentActivity(),
    refetchInterval: isLivePolling ? 1000 * 15 : false, // 15s live polling
    staleTime: 1000 * 10,
    refetchOnWindowFocus: true,
  });
}
