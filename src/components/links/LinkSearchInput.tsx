'use client';

import React from 'react';
import { SearchInput } from '@/components/ui/SearchInput';

export interface LinkSearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const LinkSearchInput: React.FC<LinkSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search links by URL or code...',
}) => {
  return (
    <div className="relative w-full max-w-sm">
      <SearchInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        size="sm"
        showClearButton={Boolean(value)}
        onClear={() => onChange('')}
      />
    </div>
  );
};
