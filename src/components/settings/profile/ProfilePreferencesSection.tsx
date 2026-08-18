'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatDate';
import { toast } from 'sonner';

interface ProfilePreferencesSectionProps {
  initialDisplayName: string;
  emailAddress: string;
  createdAt?: string;
  isVerified?: boolean;
}

export const ProfilePreferencesSection: React.FC<ProfilePreferencesSectionProps> = ({
  initialDisplayName,
  emailAddress,
  createdAt,
  isVerified = true,
}) => {
  const [displayName, setDisplayName] = useState<string>(initialDisplayName);
  const [isUpdatingName, setIsUpdatingName] = useState<boolean>(false);
  const [isSendingVerification, setIsSendingVerification] = useState<boolean>(false);

  const formattedCreatedDate = formatDate(createdAt || '2026-07-14T10:00:00.000Z');

  const handleUpdateDisplayName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setIsUpdatingName(true);
    setTimeout(() => {
      setIsUpdatingName(false);
      toast.success('Display name updated successfully');
    }, 600);
  };

  const handleVerifyEmail = () => {
    setIsSendingVerification(true);
    setTimeout(() => {
      setIsSendingVerification(false);
      toast.success(`Verification link sent to ${emailAddress}`);
    }, 800);
  };

  return (
    <div className="space-y-6 border-b border-slate-200/80 pb-8 dark:border-slate-800">
      <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 dark:text-slate-100 dark:border-slate-800">
        Preferences
      </h2>

      {/* Account Created Date Section */}
      <div className="space-y-1">
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Account created
        </label>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Member since {formattedCreatedDate}
        </p>
      </div>

      {/* Display Name Form */}
      <form onSubmit={handleUpdateDisplayName} className="space-y-3 pt-2">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Display name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full max-w-xl rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 shadow-2xs dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          type="submit"
          disabled={isUpdatingName || !displayName.trim()}
          className="rounded-md bg-[#e2e8f0] px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-300 disabled:opacity-60 transition-colors dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
        >
          {isUpdatingName ? 'Updating...' : 'Update display name'}
        </button>
      </form>

      {/* Email Addresses Subsection */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Email addresses
        </h3>

        {/* Email Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 max-w-4xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-sm font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Email address</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                  {emailAddress}
                </td>
                <td className="px-4 py-3">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified
                    </span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-4 w-4" />
                        Not verified
                      </span>
                      <button
                        type="button"
                        onClick={handleVerifyEmail}
                        disabled={isSendingVerification}
                        className="rounded-md bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-2xs cursor-pointer"
                      >
                        {isSendingVerification ? 'Sending...' : 'Verify email'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
