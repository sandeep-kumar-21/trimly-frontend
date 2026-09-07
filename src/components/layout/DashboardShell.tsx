'use client';

import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { WhatToCreateModal } from '@/components/modals/WhatToCreateModal';
import { AiAssistSidePanel } from '@/components/home/AiAssistSidePanel';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/store/uiStore';
import { useRouter, usePathname } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';

export interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { isAiAssistOpen, setAiAssistOpen, setSidebarOpen } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();
  const isWhiteBackgroundPage = pathname?.startsWith('/settings') || pathname?.includes('/edit');

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading Trimly...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !user) {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <div className="flex flex-1 overflow-hidden relative">
          <main
            className={`flex-1 overflow-y-auto px-3 pt-4 pb-8 sm:px-6 sm:py-6 md:px-8 lg:px-14 xl:px-18 lg:py-8 transition-all duration-300 ${
              isWhiteBackgroundPage
                ? 'bg-white dark:bg-slate-900'
                : 'bg-[#f4f6f8] dark:bg-slate-950'
            }`}
          >
            <div className="mx-auto max-w-[1440px] space-y-6">{children}</div>
          </main>

          {/* In-flow Side Panel (shifts main content to the left when open) */}
          <AiAssistSidePanel isOpen={isAiAssistOpen} onClose={() => setAiAssistOpen(false)} />
        </div>
      </div>

      {/* Global Quick Create Modal ("What do you want to create?") */}
      <WhatToCreateModal />
    </div>
  );
};
