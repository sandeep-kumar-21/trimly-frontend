'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatDate';
import { Input } from '@/components/ui/Input';
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
      <form onSubmit={handleUpdateDisplayName} className="space-y-3 pt-2 max-w-xl">
        <Input
          label="Display name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button
          type="submit"
          disabled={isUpdatingName || !displayName.trim()}
          className="h-10 px-4 rounded-md bg-[#e2e8f0] text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-300 disabled:opacity-60 transition-colors dark:bg-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs"
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
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 max-w-xl shadow-2xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-3.5 sm:px-4 py-3 font-bold">Email address</th>
                <th className="px-3.5 sm:px-4 py-3 font-bold text-right sm:text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="px-3.5 sm:px-4 py-3 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px] sm:max-w-none">
                  {emailAddress}
                </td>
                <td className="px-3.5 sm:px-4 py-3 text-right sm:text-left">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <div className="flex items-center justify-end sm:justify-start gap-2.5">
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-4 w-4" />
                        <span>Not verified</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleVerifyEmail}
                        disabled={isSendingVerification}
                        className="rounded-md bg-[#2a5bd7] px-2.5 py-1 text-xs font-bold text-white hover:bg-[#1d4cc9] disabled:opacity-60 transition-colors shadow-2xs cursor-pointer shrink-0"
                      >
                        {isSendingVerification ? 'Sending...' : 'Verify'}
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
