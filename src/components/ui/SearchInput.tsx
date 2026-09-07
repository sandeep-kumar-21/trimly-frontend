'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'minimal';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showClearButton?: boolean;
  onClear?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  className?: string;
  inputClassName?: string;
  id?: string;
  ariaLabel?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  size = 'md',
  variant = 'default',
  icon,
  iconPosition = 'left',
  showClearButton,
  onClear,
  onKeyDown,
  disabled = false,
  autoFocus = false,
  maxLength,
  className,
  inputClassName,
  id,
  ariaLabel,
}) => {
  const isRightIcon = iconPosition === 'right';
  const displayClear = showClearButton !== undefined ? showClearButton : Boolean(value && onClear);

  // Height and Padding styles based on size variant
  const sizeClasses = {
    sm: 'h-9 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-11 text-sm',
  }[size];

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-4.5 w-4.5',
    lg: 'h-5 w-5',
  }[size];

  // Visual container and input styles based on variant
  let containerVariantClasses = '';
  let inputVariantClasses = '';

  if (variant === 'filled') {
    containerVariantClasses =
      'rounded-md border border-slate-300 dark:border-slate-700 bg-[#f4f7fa] dark:bg-slate-800/80 px-3 focus-within:border-[#2a5bd7] transition-colors';
    inputVariantClasses =
      'bg-transparent text-[#273144] dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal font-normal focus:outline-hidden';
  } else if (variant === 'minimal') {
    containerVariantClasses =
      'border-b border-slate-300 dark:border-slate-700 bg-transparent focus-within:border-[#2a5bd7] transition-colors';
    inputVariantClasses =
      'bg-transparent text-[#273144] dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal font-normal focus:outline-hidden';
  } else {
    // default
    containerVariantClasses =
      'rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 focus-within:border-[#2a5bd7] shadow-2xs transition-colors';
    inputVariantClasses =
      'bg-transparent text-[#273144] placeholder:text-slate-400 placeholder:font-normal font-normal dark:text-slate-100 focus:outline-hidden';
  }

  return (
    <div
      className={cn(
        'relative flex items-center w-full transition-all',
        containerVariantClasses,
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {/* Icon (Left) */}
      {!isRightIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-500 dark:text-slate-400 pointer-events-none shrink-0">
          {icon || <Search className={iconSizes} />}
        </div>
      )}

      {/* Input */}
      <input
        id={id}
        type="text"
        autoFocus={autoFocus}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        aria-label={ariaLabel || placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className={cn(
          'w-full',
          sizeClasses,
          !isRightIcon && (variant === 'minimal' ? 'pl-2' : 'pl-7'),
          (isRightIcon || displayClear) ? 'pr-7' : (variant === 'minimal' ? 'pr-2' : 'pr-3'),
          inputVariantClasses,
          inputClassName
        )}
      />

      {/* Icon (Right) */}
      {isRightIcon && !displayClear && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-500 dark:text-slate-400 pointer-events-none shrink-0">
          {icon || <Search className={iconSizes} />}
        </div>
      )}

      {/* Clear Button */}
      {displayClear && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClear) onClear();
            else onChange('');
          }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer p-0.5"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
