'use client';

import React from 'react';
import { toast } from 'sonner';

export const ProfileSarAndAccountSection: React.FC = () => {
  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your Trimly account? This action cannot be undone.')) {
      toast.error('Account deletion requested.');
    }
  };

  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={handleDeleteAccount}
        className="rounded-md bg-[#dc2626] px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors shadow-2xs cursor-pointer"
      >
        Delete account
      </button>
    </div>
  );
};
