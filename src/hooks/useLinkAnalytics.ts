import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/analytics.api';
import { LinkAnalytics } from '@/types/analytics.types';

export function useLinkAnalytics(code: string, from?: string, to?: string) {
  return useQuery<LinkAnalytics>({
    queryKey: ['analytics', code, from, to],
    queryFn: () => analyticsApi.getLinkAnalytics(code, from, to),
    enabled: !!code,
    staleTime: 1000 * 30, // 30s
  });
}
