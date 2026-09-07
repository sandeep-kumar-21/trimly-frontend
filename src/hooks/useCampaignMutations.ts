import { useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignsApi } from '@/lib/api/campaigns.api';
import {
  CreateCampaignPayload,
  UpdateCampaignPayload,
  AddCampaignLinksPayload,
  AssignExistingLinksPayload,
} from '@/types/campaign.types';
import { toast } from 'sonner';

export function useCampaignMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateCampaignPayload) => campaignsApi.createCampaign(payload),
    onSuccess: (newCamp) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign-channels'] });
      toast.success(`Campaign "${newCamp.name}" created successfully!`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create campaign');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCampaignPayload }) =>
      campaignsApi.updateCampaign(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', updated._id] });
      queryClient.invalidateQueries({ queryKey: ['campaign-channels'] });
      toast.success('Campaign updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update campaign');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => campaignsApi.deleteCampaign(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Campaign deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete campaign');
    },
  });

  const addLinksBatchMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddCampaignLinksPayload }) =>
      campaignsApi.addCampaignLinksBatch(id, payload),
    onSuccess: (links, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['campaign-channels'] });
      toast.success(`Generated ${links.length} channel links for campaign!`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to generate campaign links');
    },
  });

  const assignLinksMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AssignExistingLinksPayload }) =>
      campaignsApi.assignExistingLinks(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Assigned links to campaign successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to assign links to campaign');
    },
  });

  const unlinkLinkMutation = useMutation({
    mutationFn: ({ id, linkId }: { id: string; linkId: string }) =>
      campaignsApi.unlinkCampaignLink(id, linkId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['campaign', id] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Link unlinked from campaign');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to unlink link');
    },
  });

  return {
    createCampaign: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCampaign: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCampaign: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    addLinksBatch: addLinksBatchMutation.mutateAsync,
    isAddingLinks: addLinksBatchMutation.isPending,
    assignLinks: assignLinksMutation.mutateAsync,
    isAssigning: assignLinksMutation.isPending,
    unlinkLink: unlinkLinkMutation.mutateAsync,
    isUnlinking: unlinkLinkMutation.isPending,
  };
}
