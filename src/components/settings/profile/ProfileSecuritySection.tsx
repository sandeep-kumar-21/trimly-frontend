'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

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

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Current password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 shadow-2xs dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            New password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 shadow-2xs dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Confirm new password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 shadow-2xs dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={isChangingPassword}
          className="rounded-md bg-[#0c3ebb] px-4 py-2 text-sm font-bold text-white hover:bg-[#092e8c] disabled:opacity-60 transition-colors shadow-2xs cursor-pointer"
        >
          {isChangingPassword ? 'Changing password...' : 'Change password'}
        </button>
      </form>
    </div>
  );
};
