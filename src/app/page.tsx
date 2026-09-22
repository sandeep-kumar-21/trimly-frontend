'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/lib/api/client';
import { useAuth } from '@/hooks/useAuth';
import {
  LandingNavbar,
  LandingHero,
  MarketingShowcase,
  PlatformOverview,
  LandingPricing,
  LandingFaq,
  LandingFooter,
  FloatingStartNowPill,
} from '@/components/landing';
import { Spinner } from '@/components/ui/Spinner';

export default function RootPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeHeroTab, setActiveHeroTab] = useState<'link' | 'qr'>('link');
  const hasToken = typeof window !== 'undefined' ? !!getAuthToken() : false;

  useEffect(() => {
    // If auth token exists or user is authenticated, redirect to /home immediately
    if (getAuthToken() || user) {
      router.replace('/home');
    }
  }, [user, router]);

  // While checking auth state or if user/token is present and redirecting
  if ((isLoading && hasToken) || user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#081638] text-white">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm font-semibold text-slate-200">
            Redirecting to Trimly Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081638] text-slate-900 flex flex-col selection:bg-[#0c56ec] selection:text-white">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero activeHeroTab={activeHeroTab} />
        <MarketingShowcase />
        <PlatformOverview />
        <LandingPricing />
        <LandingFaq />
      </main>
      <LandingFooter />

      {/* Floating Action Pill at bottom right (Start now: [link] [qr]) */}
      <FloatingStartNowPill onSelectTab={(tab) => setActiveHeroTab(tab)} />
    </div>
  );
}
