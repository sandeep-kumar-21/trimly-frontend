'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CustomSelectOption<T = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  description?: string;
}

export interface CustomSelectProps<T = string> {
  options: (CustomSelectOption<T> | T)[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  triggerPrefix?: string;
  triggerIcon?: React.ReactNode;
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  disabled?: boolean;
  align?: 'left' | 'right';
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  id?: string;
}

export function CustomSelect<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  size = 'md',
  triggerPrefix,
  triggerIcon,
  icon,
  label,
  error,
  disabled = false,
  align = 'left',
  className,
  triggerClassName,
  menuClassName,
  id,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options array into object structure
  const normalizedOptions: CustomSelectOption<T>[] = options.map((opt) =>
    typeof opt === 'object' && opt !== null && 'value' in opt
      ? (opt as CustomSelectOption<T>)
      : { value: opt as T, label: String(opt) }
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

  const handleSelect = (val: T) => {
    onChange(val);
    setIsOpen(false);
  };

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-3.5 text-sm',
    lg: 'h-11 px-4 text-base',
  }[size];

  const leadingIcon = triggerIcon || icon || selectedOption?.icon;

  return (
    <div ref={containerRef} className={cn('relative w-full select-none', className)}>
      {label && (
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'flex w-full items-center justify-between rounded-md border border-slate-300 bg-white font-medium text-[#273144] shadow-2xs transition-colors',
          'hover:border-slate-400 focus:border-slate-400 focus:outline-hidden',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60',
          'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 cursor-pointer',
          sizeClasses,
          isOpen && 'border-slate-400 dark:border-slate-500',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
          triggerClassName
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {leadingIcon && (
            <span className="shrink-0 text-slate-500 dark:text-slate-400">{leadingIcon}</span>
          )}
          <span className="truncate font-medium">
            {triggerPrefix && <span className="font-normal text-slate-500 dark:text-slate-400">{triggerPrefix}</span>}
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-slate-500 transition-transform duration-150 ml-2',
            isOpen && 'rotate-180 text-slate-600 dark:text-slate-300'
          )}
        />
      </button>

      {error && <p className="mt-1 text-sm font-medium text-red-600">{error}</p>}

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={cn(
            'absolute z-50 mt-1.5 w-full min-w-[140px] max-h-60 overflow-y-auto rounded-md border border-slate-200/90 bg-white py-1 shadow-lg animate-in fade-in zoom-in-95 duration-100 dark:border-slate-800 dark:bg-slate-900 overflow-hidden',
            align === 'right' ? 'right-0' : 'left-0',
            menuClassName
          )}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={String(opt.value)}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  'flex w-full items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium transition-colors cursor-pointer text-left',
                  'text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80',
                  isSelected && 'bg-transparent'
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && <span className="shrink-0 text-slate-500 dark:text-slate-400">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {opt.badge && <span>{opt.badge}</span>}
                  {isSelected && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
