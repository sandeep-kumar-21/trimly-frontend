'use client';

import React from 'react';
import { SettingsTabId } from './SettingsSidebar';
import { ProfileSettingsTab } from './ProfileSettingsTab';
import { AccountDetailsTab } from './AccountDetailsTab';
import { UsersTab } from './UsersTab';

export interface SettingsContentPanelProps {
  activeTab: SettingsTabId;
}

export const SettingsContentPanel: React.FC<SettingsContentPanelProps> = ({ activeTab }) => {
  return (
    <div className="flex-1 min-w-0 h-full overflow-y-auto px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10 pb-24 bg-white dark:bg-slate-900">
      {activeTab === 'profile' && <ProfileSettingsTab />}
      {activeTab === 'account-details' && <AccountDetailsTab />}
      {activeTab === 'users' && <UsersTab />}
    </div>
  );
};
