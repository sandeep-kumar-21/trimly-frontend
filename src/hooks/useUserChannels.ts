import { useQuery } from '@tanstack/react-query';
import { campaignsApi } from '@/lib/api/campaigns.api';

export function useUserChannels() {
  const { data: channels = [], isLoading, isError, refetch } = useQuery<string[]>({
    queryKey: ['campaign-channels'],
    queryFn: () => campaignsApi.getUserChannels(),
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    channels,
    isLoading,
    isError,
    refetch,
  };
}
