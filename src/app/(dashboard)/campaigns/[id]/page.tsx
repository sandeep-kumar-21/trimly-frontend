'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCampaignDetails } from '@/hooks/useCampaignDetails';
import { useCampaignMutations } from '@/hooks/useCampaignMutations';
import { ChannelBreakdown } from '@/components/campaigns/ChannelBreakdown';
import { AddCampaignLinksModal } from '@/components/campaigns/AddCampaignLinksModal';
import { EditCampaignModal } from '@/components/campaigns/EditCampaignModal';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { TableSkeleton } from '@/components/shared/LoadingSkeleton';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatDate';

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const resolvedParams = use(params);
  const campaignId = resolvedParams.id;
  const router = useRouter();

  const { campaignDetails, isLoading, isError, refetch } = useCampaignDetails(campaignId);
  const { deleteCampaign, isDeleting } = useCampaignMutations();

  const [isAddLinksOpen, setIsAddLinksOpen] = useState(false);
  const [preselectedChannel, setPreselectedChannel] = useState<string | undefined>(undefined);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteCampaign(campaignId);
      setIsDeleteOpen(false);
      router.push('/campaigns');
    } catch {
      // Handled by hook
    }
  };

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

  const { campaign, totalClicks, totalLinks, topChannel, channels } = campaignDetails;

  return (
    <div className="space-y-8">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#2a5bd7] dark:text-slate-400 dark:hover:text-blue-400 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to campaigns
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
              {campaign.name}
            </h1>
            {campaign.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {campaign.description}
              </p>
            )}
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              <span>Created on {formatDate(campaign.createdAt)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => {
                setPreselectedChannel(undefined);
                setIsAddLinksOpen(true);
              }}
              className="inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-md border border-transparent bg-[#2a5bd7] px-3 sm:px-4 text-xs sm:text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-[#1a4bb7] cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add links</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5 text-slate-500" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="group inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-400" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      <hr className="border-slate-200/80 dark:border-slate-800" />

      {/* Channel Breakdown Component */}
      <ChannelBreakdown
        campaignId={campaignId}
        channels={channels}
        totalClicks={totalClicks}
        totalLinks={totalLinks}
        topChannel={topChannel}
        onOpenAddLinks={() => {
          setPreselectedChannel(undefined);
          setIsAddLinksOpen(true);
        }}
        onOpenAddLinkForChannel={(channel) => {
          setPreselectedChannel(channel);
          setIsAddLinksOpen(true);
        }}
      />

      {/* Add Links Modal */}
      <AddCampaignLinksModal
        isOpen={isAddLinksOpen}
        onClose={() => {
          setIsAddLinksOpen(false);
          setPreselectedChannel(undefined);
        }}
        campaignId={campaignId}
        campaignName={campaign.name}
        configuredChannels={campaign.channels}
        initialSelectedChannel={preselectedChannel}
      />

      {/* Edit Campaign Modal */}
      <EditCampaignModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        campaignId={campaignId}
        initialName={campaign.name}
        initialDescription={campaign.description}
        initialChannels={campaign.channels}
      />

      {/* Delete Campaign Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Campaign?"
        description={`Are you sure you want to delete "${campaign.name}"? All associated links will remain active as standalone short links.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
