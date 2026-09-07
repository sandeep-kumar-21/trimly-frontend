'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { linksApi } from '@/lib/api/links.api';
import { useLinks } from '@/hooks/useLinks';
import { SharedEditForm } from '@/components/creation/SharedEditForm';
import { TableSkeleton } from '@/components/shared/LoadingSkeleton';
import { toast } from 'sonner';

export default function LinkEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const code = (params?.code as string) || '';
  const { updateLink } = useLinks();

  // Fetch real link data by shortCode
  const { data: link, isLoading, isError } = useQuery({
    queryKey: ['link', code],
    queryFn: () => linksApi.getLinkByCode(code),
    enabled: !!code,
    staleTime: 1000 * 60,
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="lg:max-w-3xl space-y-6">
          <TableSkeleton rows={4} />
        </div>
      </div>
    );
  }

  if (isError || !link) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
        <p className="font-semibold text-sm">Failed to load link data</p>
        <button
          type="button"
          onClick={() => router.push('/links')}
          className="mt-3 px-4 py-2 rounded-md bg-white border border-red-300 text-sm font-bold shadow-2xs cursor-pointer"
        >
          Back to links
        </button>
      </div>
    );
  }

  return (
    <SharedEditForm
      type="link"
      shortCode={link.shortCode}
      shortUrl={link.shortUrl}
      initialDestinationUrl={link.longUrl}
      initialTitle={link.title || ''}
      initialTags={link.tags || []}
      onSave={async (data) => {
        if (data.customBackHalf && data.customBackHalf !== link.shortCode) {
          // Dedicated server-side back-half duplication carrying over all copyable fields (campaignId, channel, expiresAt, UTMs, password)
          const newLink = await linksApi.editBackHalf(link.shortCode, {
            customAlias: data.customBackHalf,
            longUrl: data.destinationUrl,
            title: data.title || undefined,
            tags: data.tags,
          });
          queryClient.invalidateQueries({ queryKey: ['links'] });
          queryClient.invalidateQueries({ queryKey: ['tags'] });
          queryClient.invalidateQueries({ queryKey: ['link', newLink.shortCode] });
          toast.success('New short link created with custom back-half!');
          return `/links/${newLink.shortCode}/details`;
        } else {
          await updateLink({
            code: link.shortCode,
            payload: {
              longUrl: data.destinationUrl,
              title: data.title || undefined,
              tags: data.tags,
            },
          });
          queryClient.invalidateQueries({ queryKey: ['links'] });
          queryClient.invalidateQueries({ queryKey: ['link', code] });
          queryClient.invalidateQueries({ queryKey: ['tags'] });
          queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
          toast.success('Link updated successfully!');
          return '/links';
        }
      }}
      onCancel={() => {
        router.push('/links');
      }}
    />
  );
}
