import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { linksApi } from '@/lib/api/links.api';
import { ShortLink, UpdateLinkPayload } from '@/types/link.types';
import { toast } from 'sonner';

export interface UseLinksOptions {
  tags?: string[];
  linkType?: 'all' | 'custom' | 'auto';
  qrAttachment?: 'all' | 'with' | 'without';
}

export function useLinks(options?: UseLinksOptions | string[]) {
  const queryClient = useQueryClient();
  const normalizedOptions: UseLinksOptions = Array.isArray(options) ? { tags: options } : options || {};

  const { data: links = [], isLoading, isError, error, refetch } = useQuery<ShortLink[]>({
    queryKey: ['links', normalizedOptions],
    queryFn: () => linksApi.getUserLinks(normalizedOptions),
    staleTime: 1000 * 30, // 30s
  });

  const deleteMutation = useMutation({
    mutationFn: (code: string) => linksApi.deleteLink(code),
    onSuccess: (_, code) => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Link deleted', {
        description: `Short code /${code} has been deleted.`,
      });
    },
    onError: (err: any) => {
      toast.error('Failed to delete link', {
        description: err.response?.data?.message || 'An error occurred.',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ code, payload }: { code: string; payload: UpdateLinkPayload }) =>
      linksApi.updateLink(code, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Link updated successfully!');
    },
    onError: (err: any) => {
      toast.error('Failed to update link', {
        description: err.response?.data?.message || 'An error occurred.',
      });
    },
  });

  return {
    links,
    isLoading,
    isError,
    error,
    refetch,
    deleteLink: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    updateLink: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}
