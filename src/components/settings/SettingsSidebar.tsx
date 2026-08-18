'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export type SettingsTabId = 'profile' | 'account-details' | 'users';

export interface SettingsSidebarProps {
  activeTab: SettingsTabId;
  onSelectTab: (tabId: SettingsTabId) => void;
  orgId?: string;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <aside className="w-56 shrink-0 border-r border-slate-200/90 dark:border-slate-800 h-full overflow-y-auto bg-white dark:bg-slate-900 py-6 px-3 space-y-6 select-none">
      {/* Group 1: Personal Settings */}
      <div className="space-y-2">
        <h3 className="px-3 text-sm font-semibold text-slate-900 dark:text-white">
          Personal settings
        </h3>
        <div className="space-y-0.5">
          <button
            onClick={() => onSelectTab('profile')}
            className={cn(
              'flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm font-medium transition-colors text-left bg-transparent',
              activeTab === 'profile'
                ? 'bg-blue-50 text-[#0c3ebb] dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            )}
          >
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Group 2: Account Settings */}
      <div className="space-y-2">
        <h3 className="px-3 text-sm font-semibold text-slate-900 dark:text-white">
          Account settings
        </h3>

        <div className="space-y-0.5 pt-0.5">
          <button
            onClick={() => onSelectTab('account-details')}
            className={cn(
              'flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm font-medium transition-colors text-left bg-transparent',
              activeTab === 'account-details'
                ? 'bg-blue-50 text-[#0c3ebb] dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            )}
          >
            <span>Account details</span>
          </button>

          <button
            onClick={() => onSelectTab('users')}
            className={cn(
              'flex w-full items-center justify-between rounded-md px-3 py-1.5 text-sm font-medium transition-colors text-left bg-transparent',
              activeTab === 'users'
                ? 'bg-blue-50 text-[#0c3ebb] dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            )}
          >
            <span>Users</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
