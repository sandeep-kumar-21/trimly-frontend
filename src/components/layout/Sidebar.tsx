'use client';

import React from 'react';
import {
  Home,
  FileText,
  BarChart2,
  FolderGit2,
  Globe,
  LayoutGrid,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from 'lucide-react';
import { LinkIcon, QrCodeIcon } from '@/components/icons/AppIcons';
import { SidebarNavItem } from './SidebarNavItem';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils/cn';
import Image from 'next/image';
import Link from 'next/link';

export const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebarCollapsed, openCreateModal } =
    useUIStore();

  const primaryNavItems = [
    { href: '/home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { href: '/links', label: 'Links', icon: <LinkIcon className="h-5 w-5" /> },
    { href: '/qrcodes', label: 'QR Codes', icon: <QrCodeIcon className="h-5 w-5" /> },
    { href: '/analytics', label: 'Analytics', icon: <BarChart2 className="h-5 w-5" /> },
    { href: '/campaigns', label: 'Campaigns', icon: <FolderGit2 className="h-5 w-5" /> },
  ];

  const secondaryNavItems = [
    { href: '/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 relative overflow-visible select-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'w-16' : 'w-56'
        )}
      >
        {/* Toggle Expand/Collapse Button on Border */}
        <button
          onClick={toggleSidebarCollapsed}
          className="absolute -right-3.5 top-14 -translate-y-1/2 z-50 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 lg:flex"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Top Header: Logo Branding */}
        <div
          className={cn(
            'flex h-14 items-center py-2 shrink-0',
            sidebarCollapsed ? 'justify-center w-full px-0' : 'justify-between px-5'
          )}
        >
          <Link href="/home" className="flex items-center justify-center">
            {sidebarCollapsed ? (
              <Image
                src="/trimly-logo-only.svg"
                alt="Trimly Logo"
                width={34}
                height={34}
                priority
                className="h-8 w-8"
              />
            ) : (
              <Image
                src="/trimly-logo.svg"
                alt="Trimly Logo"
                width={135}
                height={36}
                priority
                className="h-9 w-auto"
                style={{ height: 'auto', width: 'auto' }}
              />
            )}
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Create New Button */}
        <div className={cn('py-4 shrink-0', sidebarCollapsed ? 'w-full flex justify-center px-0' : 'px-3.5')}>
          {sidebarCollapsed ? (
            <button
              onClick={() => openCreateModal()}
              title="Create new"
              className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0c3ebb] text-white shadow-2xs hover:bg-[#092e8c] transition-colors"
            >
              <Plus className="h-6 w-6" />
            </button>
          ) : (
            <button
              onClick={() => openCreateModal()}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#0c3ebb] text-sm font-bold text-white shadow-2xs hover:bg-[#092e8c] transition-colors"
            >
              Create new
            </button>
          )}
        </div>

        {/* Divider Under Create New */}
        <div className="px-3.5 shrink-0">
          <hr className="border-slate-200/80 dark:border-slate-800" />
        </div>

        {/* Navigation Items */}
        <nav
          className={cn(
            'flex-1 flex flex-col justify-between overflow-y-auto overflow-x-hidden p-2.5',
            sidebarCollapsed ? 'px-0 py-2.5 w-full flex flex-col items-center' : 'p-2.5'
          )}
        >
          {/* Top Primary Navigation Items */}
          <div className="space-y-1 w-full">
            {primaryNavItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                collapsed={sidebarCollapsed}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
              />
            ))}
          </div>

          {/* Bottom Settings Navigation Item */}
          <div className="w-full mt-auto pt-2">
            <div className={cn('w-full', sidebarCollapsed ? 'px-2' : 'px-1')}>
              <hr className="border-slate-200/80 dark:border-slate-800 mb-2" />
            </div>
            {secondaryNavItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                collapsed={sidebarCollapsed}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
              />
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};
