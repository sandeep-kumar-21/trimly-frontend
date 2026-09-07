'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { linksApi } from '@/lib/api/links.api';
import { useQrCodeDetails } from '@/hooks/useQRCodes';
import { SharedEditForm } from '@/components/creation/SharedEditForm';
import { toast } from 'sonner';

export default function QrCodeEditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const code = (params?.code as string) || '';

  const { data: qrDetails, isLoading: isQrLoading } = useQrCodeDetails(code);
  const { data: link, isLoading: isLinkLoading } = useQuery({
    queryKey: ['link', code],
    queryFn: () => linksApi.getLinkByCode(code),
    enabled: !!code,
    staleTime: 1000 * 60,
  });

  const handleSave = async (data: { title: string; tags: string[]; destinationUrl: string }) => {
    await linksApi.updateLink(code, {
      title: data.title,
      tags: data.tags,
      longUrl: data.destinationUrl,
    });
    queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
    queryClient.invalidateQueries({ queryKey: ['links'] });
    queryClient.invalidateQueries({ queryKey: ['qr', code] });
    queryClient.invalidateQueries({ queryKey: ['link', code] });
    toast.success('QR Code updated successfully!');
    return '/qrcodes';
  };

  const initialDestinationUrl = qrDetails?.destinationUrl || qrDetails?.longUrl || link?.longUrl || '';
  const initialTitle = qrDetails?.title || link?.title || '';
  const initialTags = qrDetails?.tags && qrDetails.tags.length > 0 ? qrDetails.tags : link?.tags || [];
  const shortUrl = qrDetails?.shortUrl || link?.shortUrl || `http://localhost:4000/${code}`;

  return (
    <SharedEditForm
      type="qrcode"
      shortCode={code}
      shortUrl={shortUrl}
      initialDestinationUrl={initialDestinationUrl}
      initialTitle={initialTitle}
      initialTags={initialTags}
      qrPreviewSvg={qrDetails?.svg || undefined}
      isLoadingPreview={isQrLoading || isLinkLoading}
      onSave={handleSave}
      onCancel={() => {
        router.push('/qrcodes');
      }}
    />
  );
}
