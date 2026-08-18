import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignsApi, UpdateCampaignPayload } from '@/lib/api/campaigns.api';
import { Campaign, CreateCampaignPayload } from '@/types/campaign.types';
import { toast } from 'sonner';

export function useCampaigns() {
  const queryClient = useQueryClient();

  const {
    data: campaigns = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: () => campaignsApi.getUserCampaigns(),
    staleTime: 1000 * 30,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateCampaignPayload) => campaignsApi.createCampaign(payload),
    onSuccess: (newCampaign) => {
      queryClient.setQueryData<Campaign[]>(['campaigns'], (old = []) => [newCampaign, ...old]);
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign created!', {
        description: `Campaign "${newCampaign.name}" created successfully.`,
      });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Failed to create campaign';
      toast.error('Error Creating Campaign', { description: message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCampaignPayload }) =>
      campaignsApi.updateCampaign(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Campaign updated successfully');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Failed to update campaign';
      toast.error('Error Updating Campaign', { description: message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => campaignsApi.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Campaign deleted successfully');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Failed to delete campaign';
      toast.error('Error Deleting Campaign', { description: message });
    },
  });

  return {
    campaigns,
    isLoading,
    isError,
    error,
    refetch,
    createCampaign: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCampaign: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCampaign: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
