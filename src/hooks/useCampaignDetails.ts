import { useQuery } from '@tanstack/react-query';
import { campaignsApi } from '@/lib/api/campaigns.api';
import { CampaignDetails } from '@/types/campaign.types';

export function useCampaignDetails(id: string) {
  const { data, isLoading, isError, error, refetch } = useQuery<CampaignDetails>({
    queryKey: ['campaigns', id],
    queryFn: () => campaignsApi.getCampaignDetails(id),
    enabled: !!id,
    staleTime: 1000 * 30,
  });

  return {
    campaignDetails: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
