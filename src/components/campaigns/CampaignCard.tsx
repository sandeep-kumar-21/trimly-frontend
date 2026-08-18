'use client';

import React from 'react';
import Link from 'next/link';
import { FolderGit2, Link2, MousePointerClick, ChevronRight, Calendar } from 'lucide-react';
import { Campaign } from '@/types/campaign.types';
import { formatNumber } from '@/lib/utils/formatNumber';
import { formatDate } from '@/lib/utils/formatDate';

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <Link
      href={`/campaigns/${campaign._id}`}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0c3ebb] transition-colors group-hover:bg-[#0c3ebb] group-hover:text-white dark:bg-blue-950/50 dark:text-blue-400 dark:group-hover:bg-[#0c3ebb] dark:group-hover:text-white">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-[#0c3ebb] dark:text-slate-100 dark:group-hover:text-blue-400">
                {campaign.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created {formatDate(campaign.createdAt)}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#0c3ebb] dark:group-hover:text-blue-400" />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-sm font-semibold">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <Link2 className="h-4 w-4 text-[#2a5bd7]" />
          <span>{formatNumber(campaign.totalLinks || 0)} links</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
          <MousePointerClick className="h-4 w-4 text-emerald-500" />
          <span>{formatNumber(campaign.totalClicks || 0)} clicks</span>
        </div>
      </div>
    </Link>
  );
};
