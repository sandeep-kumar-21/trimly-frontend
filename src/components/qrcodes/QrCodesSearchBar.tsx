'use client';

import React from 'react';
import { SharedSearchBar } from '@/components/shared/SharedSearchBar';

export interface QrCodesSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenDateModal?: () => void;
  onOpenFilterModal?: () => void;
  dateFilterLabel?: string | null;
  appliedFiltersCount?: number;
  totalResults?: number;
  onClearAll?: () => void;
}

export const QrCodesSearchBar: React.FC<QrCodesSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenDateModal,
  onOpenFilterModal,
  dateFilterLabel,
  appliedFiltersCount,
  totalResults,
  onClearAll,
}) => {
  return (
    <SharedSearchBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search codes"
      onOpenDateModal={onOpenDateModal}
      onOpenFilterModal={onOpenFilterModal}
      dateFilterLabel={dateFilterLabel}
      appliedFiltersCount={appliedFiltersCount}
      totalResults={totalResults}
      onClearAll={onClearAll}
    />
  );
};
