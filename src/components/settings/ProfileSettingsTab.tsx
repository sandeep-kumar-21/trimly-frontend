'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProfilePreferencesSection } from './profile/ProfilePreferencesSection';
import { ProfileSecuritySection } from './profile/ProfileSecuritySection';
import { ProfileSarAndAccountSection } from './profile/ProfileSarAndAccountSection';

export const ProfileSettingsTab: React.FC = () => {
  const { user, logout } = useAuth();

  const initialDisplayName = user?.name || 'skumar';
  const emailAddress = user?.email || 'skumarxz21@gmail.com';
  const createdAt = user?.createdAt || '2026-07-14T10:00:00.000Z';
  const isVerified = user?.isVerified ?? true;

  return (
    <div className="space-y-8 animate-fadeIn max-w-3xl">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-white">
          Settings
        </h1>
      </div>

      {/* 1. Preferences Section */}
      <ProfilePreferencesSection
        initialDisplayName={initialDisplayName}
        emailAddress={emailAddress}
        createdAt={createdAt}
        isVerified={isVerified}
      />

      {/* 2. Security & Authentication Section */}
      <ProfileSecuritySection
        emailAddress={emailAddress}
        onLogout={logout}
      />

      {/* 3. SAR Report & Account Deletion Section */}
      <ProfileSarAndAccountSection />
    </div>
  );
};
