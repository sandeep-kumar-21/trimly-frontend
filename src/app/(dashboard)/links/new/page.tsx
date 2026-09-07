'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SharedEmptyLanding } from '@/components/shared/SharedEmptyLanding';
import { useUIStore } from '@/store/uiStore';
import { useLinks } from '@/hooks/useLinks';

export default function NewLinksLandingPage() {
  const router = useRouter();
  const openCreateModal = useUIStore((state) => state.openCreateModal);
  const { links, isLoading, isFetched } = useLinks();

  useEffect(() => {
    if (isFetched && !isLoading && links.length > 0) {
      router.replace('/links');
    }
  }, [isFetched, isLoading, links.length, router]);

  const handleStartCreate = () => {
    openCreateModal();
  };

  if (isFetched && !isLoading && links.length > 0) {
    return null;
  }

  return (
    <div className="py-6">
      <SharedEmptyLanding
        imageSrc="/links_image.jpg"
        imageAlt="Trimly Links Illustration"
        title="Make every connection count"
        description="Create short links, QR Codes, and share them anywhere. Track engagement and click analytics in real time."
        primaryButtonText="Create your first link"
        onPrimaryClick={handleStartCreate}
      />
    </div>
  );
}
