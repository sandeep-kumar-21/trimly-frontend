'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
  menuClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className,
  menuClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 w-48 rounded-md bg-white py-1 shadow-lg border border-slate-200/90 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100 overflow-hidden',
            align === 'right' ? 'right-0' : 'left-0',
            menuClassName
          )}
          role="menu"
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  setIsOpen(false);
                }
              }}
              className={cn(
                'flex w-full items-center gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium transition-colors text-left cursor-pointer',
                'hover:bg-[#f4f6f8] dark:hover:bg-slate-800/80',
                item.disabled && 'opacity-50 cursor-not-allowed',
                'text-[#273144] dark:text-slate-100'
              )}
              role="menuitem"
            >
              {item.icon && <span className="h-4 w-4 shrink-0 text-[#273144] dark:text-slate-200">{item.icon}</span>}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
