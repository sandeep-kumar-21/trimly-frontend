'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  boxClassName?: string;
  readOnly?: boolean;
  tabIndex?: number;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  onCheckedChange,
  label,
  className,
  containerClassName,
  boxClassName,
  readOnly = false,
}) => {
  const isChecked = checked && !indeterminate;

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || readOnly) return;
    onCheckedChange?.(!checked);
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: { checked: !checked, type: 'checkbox' },
        currentTarget: { checked: !checked, type: 'checkbox' },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const box = (
    <div
      className={cn(
        'relative flex items-center justify-center shrink-0 transition-colors select-none pointer-events-none',
        disabled && 'opacity-50'
      )}
    >
      {indeterminate ? (
        <div
          className={cn(
            'flex h-4.5 w-4.5 items-center justify-center rounded-xs bg-[#2a5bd7] text-white shadow-2xs',
            boxClassName || className
          )}
        >
          <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
            <rect width="10" height="2" rx="1" fill="white" />
          </svg>
        </div>
      ) : isChecked ? (
        <div
          className={cn(
            'flex h-4.5 w-4.5 items-center justify-center rounded-xs bg-[#2a5bd7] text-white shadow-2xs',
            boxClassName || className
          )}
        >
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 4L3.5 6.5L9 1" />
          </svg>
        </div>
      ) : (
        <div
          className={cn(
            'h-4.5 w-4.5 rounded-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-[#2a5bd7]',
            boxClassName || className
          )}
        />
      )}
    </div>
  );

  if (!label) {
    return box;
  }

  return (
    <div
      id={id}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2.5 select-none cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        containerClassName
      )}
    >
      {box}
      <span className="text-sm font-medium text-[#273144] dark:text-slate-200">
        {label}
      </span>
    </div>
  );
};
