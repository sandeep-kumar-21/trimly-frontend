'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { NotificationCenterDropdown } from './NotificationCenterDropdown';

export const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isAiAssistOpen, toggleAiAssist } = useUIStore();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const userName = user?.name || user?.email?.split('@')[0] || 'skumar';
  const userEmail = user?.email || 'skumarxz21@gmail.com';
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-end gap-3 sm:gap-4 border-b border-slate-200 bg-white px-4 lg:px-6 dark:border-slate-800 dark:bg-slate-900">
      {/* Bitly Global Search Input Pill */}
      <div className="flex items-center w-64 sm:w-72 md:w-80 lg:w-96 mr-auto sm:mr-2">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex h-10 w-full items-center gap-2.5 rounded-lg bg-[#f0f3f6] px-3.5 dark:bg-slate-800 focus-within:ring-2 focus-within:ring-slate-300 transition-all"
        >
          <Search className="h-5 w-5 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 focus:outline-hidden dark:text-slate-100 placeholder:text-slate-500 font-normal"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue('')}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {/* Right side items (AI Assist, Notifications, Profile) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* AI Assist icon button */}
        <button
          type="button"
          onClick={toggleAiAssist}
          className={`p-2 cursor-pointer rounded-full text-[#273144] dark:text-slate-200 transition-colors ${
            isAiAssistOpen
              ? 'bg-[#e2e8f0] dark:bg-slate-800'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          aria-label="Open Bitly Assist Chat"
          title="Trimly Assist"
        >
          <Sparkles className="h-6 w-6 text-[#273144] dark:text-slate-200" />
        </button>

        {/* Notifications Bell Button & Dropdown Overlay */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className={`p-2 cursor-pointer rounded-full text-[#273144] dark:text-slate-200 transition-colors relative ${
              isNotificationOpen
                ? 'bg-[#e2e8f0] dark:bg-slate-800'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label="Open notifications"
            title="Notifications"
          >
            <Bell className="h-6 w-6 text-[#273144] dark:text-slate-200" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          <NotificationCenterDropdown
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        {/* User Profile Menu Button & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex items-center cursor-pointer gap-2 p-1.5 rounded-lg transition-colors ${
              isUserMenuOpen
                ? 'bg-[#e2e8f0] dark:bg-slate-800'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#273144] text-white font-bold text-sm uppercase shadow-2xs">
              {userInitial}
            </div>
            <span className="text-sm font-bold text-[#273144] dark:text-slate-200 hidden md:inline-block">
              {userName}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-600" />
          </button>

          {/* Exact Bitly User Card Overlay */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-1 w-72 rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 overflow-hidden text-[#273144] dark:text-slate-100 animate-in fade-in zoom-in-95 duration-100">
              {/* Top User Info Section */}
              <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#273144] text-white font-bold text-lg uppercase shadow-2xs">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-[#273144] dark:text-slate-100 truncate">
                    {userName}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {userEmail}
                  </div>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    router.push('/settings');
                  }}
                  className="flex w-full items-center cursor-pointer gap-3 px-4 py-3 text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                  Settings
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center cursor-pointer gap-3 px-4 py-3 text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4 text-slate-500" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
