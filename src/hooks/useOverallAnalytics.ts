import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/analytics.api';

export function useOverallAnalytics(from?: string, to?: string) {
  return useQuery({
    queryKey: ['overall-analytics', from, to],
    queryFn: () => analyticsApi.getUserOverallAnalytics(from, to),
    staleTime: 1000 * 30, // 30s
  });
}
