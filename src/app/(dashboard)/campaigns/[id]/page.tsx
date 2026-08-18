'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useCampaignDetails } from '@/hooks/useCampaignDetails';
import { ChannelBreakdown } from '@/components/campaigns/ChannelBreakdown';
import { TableSkeleton } from '@/components/shared/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, FolderGit2, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatDate';

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const resolvedParams = use(params);
  const campaignId = resolvedParams.id;

  const { campaignDetails, isLoading, isError, refetch } = useCampaignDetails(campaignId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-9 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>
        <TableSkeleton rows={5} />
      </div>
    );
  }

  if (isError || !campaignDetails) {
    return (
      <div className="space-y-6">
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" /> Back to campaigns
        </Link>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
          <p className="font-semibold text-base">Campaign not found</p>
          <p className="text-sm text-rose-600 dark:text-rose-400 mt-1">
            This campaign may have been removed or you do not have permission to view it.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const { campaign, totalClicks, totalLinks, channels } = campaignDetails;

  return (
    <div className="space-y-8">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to campaigns
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shrink-0">
              <FolderGit2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {campaign.name}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created on {formatDate(campaign.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-200/80 dark:border-slate-800" />

      {/* Channel Breakdown Component */}
      <ChannelBreakdown
        channels={channels}
        totalClicks={totalClicks}
        totalLinks={totalLinks}
      />
    </div>
  );
}
