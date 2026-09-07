'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md';
  id?: string;
  className?: string;
  'aria-label'?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  icon,
  disabled = false,
  size = 'md',
  id,
  className,
  'aria-label': ariaLabel,
}) => {
  const isSm = size === 'sm';

  const switchButton = (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel || label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
        isSm ? 'h-5 w-9' : 'h-6 w-11',
        checked ? 'bg-[#2a5bd7]' : 'bg-slate-200 dark:bg-slate-700',
        disabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
          isSm
            ? cn('h-4 w-4', checked ? 'translate-x-4' : 'translate-x-0')
            : cn('h-5 w-5', checked ? 'translate-x-5' : 'translate-x-0')
        )}
      />
    </button>
  );

  if (!label && !description && !icon) {
    return switchButton;
  }

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-2.5">
        {icon && <span className="shrink-0 text-slate-500">{icon}</span>}
        <div>
          {label && (
            <span className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              {label}
            </span>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      {switchButton}
    </div>
  );
};
