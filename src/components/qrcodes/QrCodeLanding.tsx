'use client';

import React from 'react';
import { SharedEmptyLanding } from '@/components/shared/SharedEmptyLanding';

export interface QrCodeLandingProps {
  onStartCreate: () => void;
}

export const QrCodeLanding: React.FC<QrCodeLandingProps> = ({ onStartCreate }) => {
  return (
    <SharedEmptyLanding
      imageSrc="/qrcode_image.webp"
      imageAlt="QR Code Hero Illustration"
      title="Connect your audience with a simple scan"
      description="Create a QR Code from any short link. Then edit, customize, and track your QR Codes here."
      primaryButtonText="Create a Trimly Code"
      onPrimaryClick={onStartCreate}
    />
  );
};
