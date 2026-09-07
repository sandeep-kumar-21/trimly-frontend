'use client';

import React from 'react';
import { ProfileSettingsTab } from '@/components/settings/ProfileSettingsTab';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <ProfileSettingsTab />
    </div>
  );
}
