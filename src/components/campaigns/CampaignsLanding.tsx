'use client';

import React from 'react';
import { SharedEmptyLanding } from '@/components/shared/SharedEmptyLanding';

export interface CampaignsLandingProps {
  onStartCreate: () => void;
}

export const CampaignsLanding: React.FC<CampaignsLandingProps> = ({ onStartCreate }) => {
  return (
    <SharedEmptyLanding
      imageSrc="/Campaigns_image.webp"
      imageAlt="Trimly Campaigns Illustration"
      title="Some links belong together"
      description="Organize your links in Trimly Campaigns and compare performance across channels."
      primaryButtonText="Create campaign"
      onPrimaryClick={onStartCreate}
    />
  );
};
