'use client';

import React from 'react';
import { SharedSearchBar } from '@/components/shared/SharedSearchBar';

export interface LinksSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenDateModal: () => void;
  onOpenFilterModal: () => void;
  dateFilterLabel?: string | null;
  appliedFiltersCount?: number;
  totalResults?: number;
  onClearAll?: () => void;
}

export const LinksSearchBar: React.FC<LinksSearchBarProps> = ({
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
      searchPlaceholder="Search links"
      onOpenDateModal={onOpenDateModal}
      onOpenFilterModal={onOpenFilterModal}
      dateFilterLabel={dateFilterLabel}
      appliedFiltersCount={appliedFiltersCount}
      totalResults={totalResults}
      onClearAll={onClearAll}
    />
  );
};
