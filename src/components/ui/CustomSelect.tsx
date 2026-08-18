'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CustomSelectOption {
  value: string;
  label: string;
  badge?: React.ReactNode;
}

export interface CustomSelectProps {
  options: (CustomSelectOption | string)[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  className,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options array into object structure
  const normalizedOptions: CustomSelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full select-none', className)}>
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white pl-3.5 pr-3 text-sm text-[#273144] shadow-2xs transition-colors hover:border-slate-400 focus:border-[#2a5bd7] focus:ring-2 focus:ring-blue-100 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900/50 cursor-pointer',
          isOpen && 'border-[#2a5bd7] ring-2 ring-blue-100 dark:border-blue-500'
        )}
      >
        <span className="truncate font-semibold">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150',
            isOpen && 'rotate-180 text-[#2a5bd7]'
          )}
        />
      </button>

      {/* Floating Dropdown Menu matching Bitly exact design */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-1 shadow-xl animate-in fade-in zoom-in-95 duration-100 dark:border-slate-800 dark:bg-slate-900"
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-[#f0f4fd] text-[#1d4cc9] font-bold dark:bg-blue-950/60 dark:text-blue-300'
                    : 'text-[#273144] hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-slate-800'
                )}
              >
                <span className="truncate">{opt.label}</span>
                {opt.badge && <span>{opt.badge}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
