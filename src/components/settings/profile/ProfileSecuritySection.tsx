'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';

interface ProfileSecuritySectionProps {
  emailAddress: string;
  onLogout?: () => void;
}

export const ProfileSecuritySection: React.FC<ProfileSecuritySectionProps> = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter your current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully. Please log in again.');
    }, 800);
  };

  return (
    <div className="space-y-6 border-b border-slate-200/80 pb-8 dark:border-slate-800">
      <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 dark:text-slate-100 dark:border-slate-800">
        Security & authentication
      </h2>

      {/* Change Password Form */}
      <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Change password
          </h3>
          <p className="text-sm text-slate-500 mt-0.5 dark:text-slate-400">
            You will be required to login after changing your password
          </p>
        </div>

        <Input
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={isChangingPassword}
          className="h-10 px-5 rounded-md bg-[#2a5bd7] text-xs sm:text-sm font-bold text-white hover:bg-[#1a4bb7] disabled:opacity-60 transition-colors shadow-2xs cursor-pointer"
        >
          {isChangingPassword ? 'Changing password...' : 'Change password'}
        </button>
      </form>
    </div>
  );
};
