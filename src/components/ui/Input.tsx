import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  sizeVariant?: 'sm' | 'md' | 'lg';
  roundedVariant?: 'md' | 'lg' | 'xl';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      leftIcon,
      rightIcon,
      helperText,
      sizeVariant = 'md',
      roundedVariant = 'md',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const sizeClasses = {
      sm: 'h-9 px-3 text-xs',
      md: 'h-10 px-3.5 text-sm',
      lg: 'h-11 px-4 text-sm',
    }[sizeVariant];

    const roundedClasses = {
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
    }[roundedVariant];

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center shrink-0">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full border border-slate-300 bg-white font-normal text-[#273144] placeholder:text-slate-400 placeholder:font-normal shadow-2xs transition-colors',
              'focus:border-[#2a5bd7] focus:outline-hidden',
              'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60',
              'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
              sizeClasses,
              roundedClasses,
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-950',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-slate-400 flex items-center justify-center shrink-0">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
