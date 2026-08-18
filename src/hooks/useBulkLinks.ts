import { useMutation, useQueryClient } from '@tanstack/react-query';
import { linksApi } from '@/lib/api/links.api';
import { ShortLink } from '@/types/link.types';
import { toast } from 'sonner';

export function useBulkLinks() {
  const queryClient = useQueryClient();

  const bulkTagsMutation = useMutation({
    mutationFn: (payload: { linkIds: string[]; addTags?: string[]; removeTags?: string[] }) =>
      linksApi.bulkUpdateTags(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Tags updated successfully');
    },
    onError: (err: any) => {
      toast.error('Failed to update tags', {
        description: err.response?.data?.message || 'An error occurred.',
      });
    },
  });

  const bulkHideMutation = useMutation({
    mutationFn: (payload: { linkIds: string[]; isHidden: boolean }) =>
      linksApi.bulkHideLinks(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
      toast.success(variables.isHidden ? 'Hidden successfully' : 'Unhidden successfully');
    },
    onError: (err: any) => {
      toast.error('Failed to update visibility', {
        description: err.response?.data?.message || 'An error occurred.',
      });
    },
  });

  return {
    bulkUpdateTags: bulkTagsMutation.mutateAsync,
    isBulkUpdatingTags: bulkTagsMutation.isPending,
    bulkHideLinks: bulkHideMutation.mutateAsync,
    isBulkHiding: bulkHideMutation.isPending,
  };
}
