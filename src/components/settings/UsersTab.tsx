'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Search, Lock, Download } from 'lucide-react';
import { toast } from 'sonner';

export const UsersTab: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const userEmail = user?.email || 'skumarxz21@gmail.com';
  const userName = user?.name || 'skumar';

  return (
    <div className="space-y-4 animate-fadeIn max-w-5xl pb-24">
      {/* Top Header Row with Active/Pending Pill Switcher */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Users
        </h1>

        {/* Pill Tab Switcher matching Bitly Screenshot 3 */}
        <div className="flex items-center rounded-full bg-slate-100/90 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab('active')}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition-all ${activeTab === 'active'
                ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
          >
            <span>Pending</span>
            <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Seat usage subtitle */}
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        Using 1 of 1 user seats
      </p>

      {/* Main Table Card matching Bitly Screenshot 3 */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by display name, username and email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 shadow-2xs dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 ml-auto">
            <span title="Single Sign-On Enforced">
              <Lock className="h-4 w-4 text-slate-600 dark:text-slate-400 cursor-pointer" />
            </span>

            <button
              disabled
              className="rounded-md bg-[#e2e8f0] px-3.5 py-1.5 text-sm font-semibold text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
            >
              Add new user
            </button>

            <button
              onClick={() => toast.success('Exporting users list CSV...')}
              className="rounded-md border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              Export
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 pb-3 text-sm font-bold text-slate-900 dark:border-slate-800 dark:text-white">
              <tr>
                <th className="pb-3 font-bold">User</th>
                <th className="pb-3 font-bold">Email</th>
                <th className="pb-3 font-bold">2FA</th>
                <th className="pb-3 font-bold">SSO</th>
                <th className="pb-3 font-bold">Created</th>
                <th className="pb-3 font-bold">Permissions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {activeTab === 'active' ? (
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white">
                    {userName}
                  </td>
                  <td className="py-4 font-semibold text-blue-600 hover:underline dark:text-blue-400">
                    {userEmail}
                  </td>
                  <td className="py-4 text-slate-400">
                    —
                  </td>
                  <td className="py-4 text-slate-400">
                    —
                  </td>
                  <td className="py-4 text-slate-700 dark:text-slate-300">
                    Jul 14, 2026
                  </td>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white">
                    Account admin
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                    No pending invitations
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
