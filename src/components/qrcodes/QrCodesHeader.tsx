'use client';

import React from 'react';
import { SharedPageHeader } from '@/components/shared/SharedPageHeader';

export interface QrCodesHeaderProps {
  onCreateCodeClick?: () => void;
}

export const QrCodesHeader: React.FC<QrCodesHeaderProps> = ({ onCreateCodeClick }) => {
  return (
    <SharedPageHeader
      title="QR Codes"
      createButtonText="Create code"
      createHref="/qrcodes/create"
      onCreateClick={onCreateCodeClick}
    />
  );
};
