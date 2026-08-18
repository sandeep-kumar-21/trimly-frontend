'use client';

import React from 'react';
import { ProfileSettingsTab } from '@/components/settings/ProfileSettingsTab';

export default function SettingsPage() {
  return (
    <div className="-mx-6 -my-6 sm:-mx-12 sm:-my-8 lg:-mx-16 lg:-my-10 p-6 sm:p-12 lg:p-16 min-h-[calc(100vh-3.5rem)] bg-white dark:bg-slate-900">
      <ProfileSettingsTab />
    </div>
  );
}
