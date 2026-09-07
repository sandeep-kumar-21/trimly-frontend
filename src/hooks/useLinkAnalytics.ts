import { useQuery } from '@tanstack/react-query';
import { analyticsApi, AnalyticsQueryOptions } from '@/lib/api/analytics.api';
import { AnalyticsDashboardResponse } from '@/types/analytics.types';

export function useLinkAnalytics(code: string, options?: Omit<AnalyticsQueryOptions, 'shortCode'>) {
  return useQuery<AnalyticsDashboardResponse>({
    queryKey: ['analytics', code, options?.preset, options?.from, options?.to, options?.interval],
    queryFn: () => analyticsApi.getDashboardAnalytics({ shortCode: code, ...options }),
    enabled: !!code,
    staleTime: 1000 * 15,
  });
}

