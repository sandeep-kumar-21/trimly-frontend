'use client';

import React from 'react';
import { QuickCreateBar } from '@/components/links/QuickCreateBar';
import { StatCard } from '@/components/analytics/StatCard';
import { DoMoreChecklist } from '@/components/home/DoMoreChecklist';
import { useLinks } from '@/hooks/useLinks';
import { Link2, MousePointerClick, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumber';

export default function HomePage() {
  const { links } = useLinks();

  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + (link.clickCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Quick Create & AI Module Bar */}
      <QuickCreateBar />

      {/* Main Bottom Grid: Stat Cards (~7 cols) & DoMoreChecklist (~5 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Section: Stat Cards (~7 cols) */}
        <div className="xl:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Links Created"
              value={formatNumber(totalLinks)}
              description="Active shortened URLs in your account"
              icon={<Link2 className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
            />
            <StatCard
              title="Total Clicks"
              value={formatNumber(totalClicks)}
              description="All-time engagement across all links"
              icon={<MousePointerClick className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
            />
            <StatCard
              title="Avg Clicks / Link"
              value={totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : '0'}
              description="Average performance per link"
              icon={<TrendingUp className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
            />
          </div>
        </div>

        {/* Right Section: Do More with Trimly Stepper (~5 cols) */}
        <div className="xl:col-span-5 flex flex-col">
          <DoMoreChecklist />
        </div>
      </div>
    </div>
  );
}
