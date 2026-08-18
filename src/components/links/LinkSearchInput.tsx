'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

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
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search className="h-4 w-4" />}
        rightIcon={
          value ? (
            <button
              onClick={() => onChange('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : undefined
        }
        className="h-9 text-sm"
      />
    </div>
  );
};
