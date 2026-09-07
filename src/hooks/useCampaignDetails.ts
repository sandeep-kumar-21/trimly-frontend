import { useQuery } from '@tanstack/react-query';
import { campaignsApi } from '@/lib/api/campaigns.api';
import { CampaignDetails } from '@/types/campaign.types';

export function useCampaignDetails(id: string) {
  const { data, isLoading, isError, error, refetch } = useQuery<CampaignDetails>({
    queryKey: ['campaign', id],
    queryFn: () => campaignsApi.getCampaignDetails(id),
    enabled: !!id,
    staleTime: 1000 * 10, // 10s fresh cache
    refetchInterval: 15000, // 15s gentle polling interval to protect database
    refetchOnWindowFocus: true, // Instant update when user switches back to the tab
  });

  return {
    campaignDetails: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
