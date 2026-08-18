'use client';

import React from 'react';
import { SharedPageHeader } from '@/components/shared/SharedPageHeader';

export interface LinksHeaderProps {
  onCreateLinkClick?: () => void;
}

export const LinksHeader: React.FC<LinksHeaderProps> = ({ onCreateLinkClick }) => {
  return (
    <SharedPageHeader
      title="Trimly Links"
      createButtonText="Create link"
      createHref="/links/create"
      onCreateClick={onCreateLinkClick}
    />
  );
};
