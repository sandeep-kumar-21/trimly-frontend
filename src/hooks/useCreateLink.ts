import { useMutation, useQueryClient } from '@tanstack/react-query';
import { linksApi } from '@/lib/api/links.api';
import { CreateLinkPayload, ShortLink } from '@/types/link.types';
import { toast } from 'sonner';
import { useUIStore } from '@/store/uiStore';
import { copyToClipboard } from '@/lib/utils/clipboard';

export function useCreateLink() {
  const queryClient = useQueryClient();
  const closeCreateModal = useUIStore((state) => state.closeCreateModal);

  return useMutation({
    mutationFn: (payload: CreateLinkPayload) => linksApi.createLink(payload),
    onSuccess: (newLink: ShortLink) => {
      queryClient.setQueriesData({ queryKey: ['links'] }, (old: any = []) => {
        if (!Array.isArray(old)) return [newLink];
        return [newLink, ...old.filter((l: any) => (l._id || l.shortCode) !== (newLink._id || newLink.shortCode))];
      });
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
      closeCreateModal();

      const shortUrl = newLink.shortUrl || `/${newLink.shortCode}`;

      toast.success('Short link created!', {
        description: shortUrl,
        action: {
          label: 'Copy URL',
          onClick: () => {
            copyToClipboard(shortUrl);
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
