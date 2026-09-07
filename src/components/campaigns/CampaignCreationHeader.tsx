'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const CampaignCreationHeader: React.FC = () => {
  return (
    <div className="space-y-1.5">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
        <Link
          href="/campaigns"
          className="hover:text-[#2a5bd7] dark:hover:text-blue-400 transition-colors"
        >
          Campaigns
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-700 dark:text-slate-300 font-bold">Create campaign</span>
      </nav>

      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
          Create a new campaign
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Organize links into multi-channel marketing buckets and track unified click attribution.
        </p>
      </div>
    </div>
  );
};
