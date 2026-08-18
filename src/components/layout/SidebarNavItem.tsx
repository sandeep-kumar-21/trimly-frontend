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
  onClick?: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  href,
  label,
  icon,
  badge,
  collapsed = false,
  onClick,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/home' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        'group relative flex items-center transition-all duration-150 shrink-0',
        collapsed
          ? 'justify-center h-10 w-10 mx-auto my-1 rounded-lg'
          : 'justify-between px-3.5 py-2.5 my-1 rounded-lg',
        isActive
          ? 'bg-[#e8f0fe] text-[#0c3ebb] font-bold dark:bg-blue-950/60 dark:text-blue-400'
          : 'text-[#273144] hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100'
      )}
    >
      {/* Active left indicator bar */}
      {isActive && (
        <span
          className={cn(
            'absolute w-1 bg-[#0c3ebb] rounded-r-md dark:bg-blue-400',
            collapsed ? '-left-3 top-1 bottom-1' : 'left-0 top-1.5 bottom-1.5'
          )}
        />
      )}

      <div className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-3.5')}>
        <span
          className={cn(
            'h-5 w-5 shrink-0 transition-colors flex items-center justify-center',
            isActive
              ? 'text-[#0c3ebb] dark:text-blue-400'
              : 'text-[#273144] group-hover:text-slate-900 dark:text-slate-200 dark:group-hover:text-slate-100'
          )}
        >
          {icon}
        </span>
        {!collapsed && <span className="font-semibold text-sm tracking-tight">{label}</span>}
      </div>

      {!collapsed && badge && (
        <span className="rounded-sm bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
          {badge}
        </span>
      )}
    </Link>
  );
};
