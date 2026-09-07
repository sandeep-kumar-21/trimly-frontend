'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SegmentedSwitchOption<T = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  title?: string;
}

export interface SegmentedSwitchProps<T = string> {
  options: SegmentedSwitchOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
  buttonClassName?: string;
}

export function SegmentedSwitch<T extends string = string>({
  options,
  value,
  onChange,
  size = 'sm',
  className,
  buttonClassName,
}: SegmentedSwitchProps<T>) {
  const isSm = size === 'sm';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 select-none transition-colors shrink-0',
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            title={option.title || option.label}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-md font-semibold transition-all cursor-pointer select-none whitespace-nowrap shrink-0',
              isSm ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-sm',
              isSelected
                ? 'bg-white text-[#273144] shadow-2xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
              buttonClassName
            )}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            {option.label && <span className="whitespace-nowrap">{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
