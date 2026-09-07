'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

export interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  collapsed?: boolean;
  responsiveCollapse?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  href,
  label,
  icon,
  badge,
  collapsed = false,
  responsiveCollapse = false,
  className,
  onClick,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/home' && pathname.startsWith(href));

  const isRailMode = collapsed;

  return (
    <Link
      href={href}
      onClick={onClick}
      title={label}
      className={cn(
        'group relative flex items-center transition-all duration-150 shrink-0 select-none',
        isRailMode
          ? 'justify-center h-10 w-10 mx-auto my-0.5 rounded-md'
          : responsiveCollapse
            ? 'justify-center xl:justify-between h-10 xl:h-auto w-10 xl:w-full mx-auto xl:mx-0 px-0 xl:px-3.5 py-0 xl:py-2.5 my-0.5 rounded-md'
            : 'justify-between w-full px-3.5 py-2.5 my-0.5 rounded-md',
        isActive
          ? 'bg-[#edf4ff] text-[#2a5bd7] font-bold dark:bg-blue-950/60 dark:text-blue-400'
          : 'text-[#273144] hover:bg-slate-50 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100',
        className
      )}
    >
      {/* Active left indicator bar */}
      {isActive && (
        <span
          className={cn(
            'absolute w-1 bg-[#2a5bd7] rounded-r-md dark:bg-blue-400',
            isRailMode
              ? '-left-3 top-1 bottom-1'
              : responsiveCollapse
                ? '-left-3 xl:left-0 top-1 bottom-1'
                : 'left-0 top-1 bottom-1'
          )}
        />
      )}

      <div
        className={cn(
          'flex items-center',
          isRailMode
            ? 'justify-center'
            : responsiveCollapse
              ? 'justify-center xl:justify-start gap-3.5'
              : 'gap-3.5'
        )}
      >
        <span
          className={cn(
            'h-5 w-5 shrink-0 transition-colors flex items-center justify-center',
            isActive
              ? 'text-[#2a5bd7] dark:text-blue-400'
              : 'text-[#273144] group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-slate-100'
          )}
        >
          {icon}
        </span>
        {!isRailMode && (
          <span
            className={cn(
              'font-semibold text-sm tracking-tight',
              responsiveCollapse && 'hidden xl:inline-block'
            )}
          >
            {label}
          </span>
        )}
      </div>

      {!isRailMode && badge && (
        <span
          className={cn(
            'rounded-sm bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400',
            responsiveCollapse && 'hidden xl:inline-block'
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};
