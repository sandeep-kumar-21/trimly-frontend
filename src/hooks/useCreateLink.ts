import { useMutation, useQueryClient } from '@tanstack/react-query';
import { linksApi } from '@/lib/api/links.api';
import { CreateLinkPayload, ShortLink } from '@/types/link.types';
import { toast } from 'sonner';
import { useUIStore } from '@/store/uiStore';

export function useCreateLink() {
  const queryClient = useQueryClient();
  const closeCreateModal = useUIStore((state) => state.closeCreateModal);

  return useMutation({
    mutationFn: (payload: CreateLinkPayload) => linksApi.createLink(payload),
    onSuccess: (newLink: ShortLink) => {
      queryClient.setQueryData<ShortLink[]>(['links'], (old = []) => [newLink, ...old]);
      queryClient.invalidateQueries({ queryKey: ['links'] });
      closeCreateModal();

      const shortUrl = newLink.shortUrl || `/${newLink.shortCode}`;

      toast.success('Short link created!', {
        description: shortUrl,
        action: {
          label: 'Copy URL',
          onClick: () => {
            navigator.clipboard.writeText(shortUrl);
            toast.info('Copied to clipboard!');
          },
        },
      });
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Failed to create short link';
      toast.error('Error Creating Link', { description: message });
    },
  });
}
