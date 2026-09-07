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
} from 'lucide-react';
import { LinkIcon, QrCodeIcon } from '@/components/icons/AppIcons';
import { SidebarNavItem } from './SidebarNavItem';
import { useUIStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils/cn';
import Image from 'next/image';
import Link from 'next/link';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    openCreateModal,
  } = useUIStore();

  const userName = user?.name || user?.email?.split('@')[0] || 'skumar';
  const userInitial = userName.charAt(0).toUpperCase();

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
      {/* ---------------------------------------------------- */}
      {/* MOBILE TOP-DOWN MENU (Clean, No Layout Shift, No Blur) */}
      {/* ---------------------------------------------------- */}
      {sidebarOpen && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-40 md:hidden">
          {/* Backdrop (Dark overlay with NO blur) */}
          <div
            className="fixed inset-x-0 top-14 bottom-0 bg-slate-900/40 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Top-Down Menu Container */}
          <div className="relative z-40 w-full bg-white dark:bg-slate-900 shadow-2xl border-b border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            {/* Menu Body */}
            <div className="p-4 space-y-3">
              {/* Full-width "Create new" button */}
              <button
                type="button"
                onClick={() => {
                  openCreateModal();
                  setSidebarOpen(false);
                }}
                className="w-full h-11 rounded-md bg-[#0c389f] hover:bg-[#1a4bb7] text-white font-bold text-sm shadow-2xs transition-colors flex items-center justify-center cursor-pointer"
              >
                Create new
              </button>

              {/* Navigation links */}
              <nav className="space-y-1 pt-1">
                {primaryNavItems.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    collapsed={false}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}

                <div className="py-2">
                  <hr className="border-slate-200/80 dark:border-slate-800" />
                </div>

                {secondaryNavItems.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    collapsed={false}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TABLET (Icon Rail) & DESKTOP SIDEBAR (md:flex) */}
      {/* ---------------------------------------------------- */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 select-none relative overflow-visible shrink-0 z-30',
          sidebarCollapsed ? 'w-16' : 'w-16 xl:w-56'
        )}
      >
        {/* Toggle Expand/Collapse Button on Border (Desktop only) */}
        <button
          onClick={toggleSidebarCollapsed}
          className="absolute -right-3.5 top-14 -translate-y-1/2 z-50 hidden xl:flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
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
            sidebarCollapsed ? 'justify-center w-full px-0' : 'justify-center xl:justify-between w-full px-0 xl:px-5'
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
              <>
                {/* On Tablet: Show icon only */}
                <Image
                  src="/trimly-logo-only.svg"
                  alt="Trimly Logo"
                  width={34}
                  height={34}
                  priority
                  className="h-8 w-8 xl:hidden"
                />
                {/* On Desktop: Show full logo */}
                <Image
                  src="/trimly-logo.svg"
                  alt="Trimly Logo"
                  width={135}
                  height={36}
                  priority
                  className="hidden xl:block h-9 w-auto"
                  style={{ height: 'auto', width: 'auto' }}
                />
              </>
            )}
          </Link>
        </div>

        {/* Create New Button */}
        <div
          className={cn(
            'py-4 shrink-0',
            sidebarCollapsed ? 'w-full flex justify-center px-0' : 'w-full flex justify-center px-0 xl:px-3.5'
          )}
        >
          {sidebarCollapsed ? (
            <button
              onClick={() => openCreateModal()}
              title="Create new"
              className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0c389f] text-white shadow-2xs hover:bg-[#1a4bb7] transition-colors cursor-pointer"
            >
              <Plus className="h-6 w-6" />
            </button>
          ) : (
            <>
              {/* Tablet: Icon only */}
              <button
                onClick={() => openCreateModal()}
                title="Create new"
                className="flex xl:hidden h-10 w-10 items-center justify-center rounded-md bg-[#0c389f] text-white shadow-2xs hover:bg-[#1a4bb7] transition-colors cursor-pointer"
              >
                <Plus className="h-6 w-6" />
              </button>
              {/* Desktop: Full button */}
              <button
                onClick={() => openCreateModal()}
                className="hidden xl:flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#0c389f] text-sm font-bold text-white shadow-2xs hover:bg-[#1a4bb7] transition-colors cursor-pointer"
              >
                Create new
              </button>
            </>
          )}
        </div>

        {/* Divider Under Create New */}
        <div className={cn('px-3.5 shrink-0', sidebarCollapsed ? 'hidden' : 'hidden xl:block')}>
          <hr className="border-slate-200/80 dark:border-slate-800" />
        </div>

        {/* Navigation Items */}
        <nav
          className={cn(
            'flex-1 flex flex-col justify-between overflow-y-auto overflow-x-hidden p-2.5',
            sidebarCollapsed ? 'px-0 py-2.5 w-full flex flex-col items-center' : 'px-0 xl:px-2.5 py-2.5 w-full flex flex-col items-center xl:items-stretch'
          )}
        >
          {/* Top Primary Navigation Items */}
          <div className="space-y-1 w-full flex flex-col items-center xl:items-stretch">
            {primaryNavItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                collapsed={sidebarCollapsed}
                responsiveCollapse={!sidebarCollapsed}
              />
            ))}
          </div>

          {/* Bottom Settings Navigation Item */}
          <div className="w-full mt-auto pt-2 flex flex-col items-center xl:items-stretch">
            <div className={cn('w-full', sidebarCollapsed ? 'px-2' : 'px-2 xl:px-1')}>
              <hr className="border-slate-200/80 dark:border-slate-800 mb-2" />
            </div>
            {secondaryNavItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                collapsed={sidebarCollapsed}
                responsiveCollapse={!sidebarCollapsed}
              />
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};
