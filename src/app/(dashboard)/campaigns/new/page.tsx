'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CampaignsLanding } from '@/components/campaigns/CampaignsLanding';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function NewCampaignsLandingPage() {
  const router = useRouter();
  const { campaigns, isLoading, isFetched } = useCampaigns();

  useEffect(() => {
    if (isFetched && !isLoading && campaigns.length > 0) {
      router.replace('/campaigns');
    }
  }, [isFetched, isLoading, campaigns.length, router]);

  const handleStartCreate = () => {
    router.push('/campaigns/create');
  };

  if (isFetched && !isLoading && campaigns.length > 0) {
    return null;
  }

  return (
    <div className="py-6">
      <CampaignsLanding onStartCreate={handleStartCreate} />
    </div>
  );
}
