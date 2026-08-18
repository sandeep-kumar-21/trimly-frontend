'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const AccountDetailsTab: React.FC = () => {
  const { user } = useAuth();

  const notificationEmail = user?.email || 'skumarxz21@gmail.com';

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl pb-24">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Account details
        </h1>
      </div>

      {/* Contact details Section matching Bitly Screenshot 2 */}
      <div className="space-y-3 pt-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Contact details
        </h2>

        {/* Notification Email Card */}
        <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-[#f8fafc] px-5 py-3 dark:border-slate-800 dark:bg-slate-800/60">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Notification email
            </span>
            <button
              onClick={() => toast.info('To change primary notification email, visit Profile settings.')}
              className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Change email
            </button>
          </div>

          {/* Card Body */}
          <div className="p-5 space-y-3">
            <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-400 max-w-2xl">
              Select which verified email address you would like to use to receive notifications for your accounts. To add another email, go to your Profile settings.
            </p>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {notificationEmail}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
