'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCampaigns } from '@/hooks/useCampaigns';
import { CampaignsLanding } from '@/components/campaigns/CampaignsLanding';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { AddCampaignLinksModal } from '@/components/campaigns/AddCampaignLinksModal';
import { EditCampaignModal } from '@/components/campaigns/EditCampaignModal';
import { Campaign } from '@/types/campaign.types';

export default function CampaignsPage() {
  const router = useRouter();
  const { campaigns, isLoading: campaignsLoading, isFetched: campaignsFetched, isError, refetch } = useCampaigns();

  const isLoading = campaignsLoading || !campaignsFetched;

  // Modals for List View
  const [modalAddLinksCampaign, setModalAddLinksCampaign] = useState<Campaign | null>(null);
  const [modalEditCampaign, setModalEditCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    if (!isLoading && !isError && campaigns.length === 0) {
      router.replace('/campaigns/new');
    }
  }, [isLoading, isError, campaigns.length, router]);

  const handleNavigateCreate = () => {
    router.push('/campaigns/create');
  };

  if (!isLoading && !isError && campaigns.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* CAMPAIGNS LIST VIEW (Dashboard Cards Grid) */}
      <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
                Campaigns
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Group your short links into marketing campaigns to measure total and channel-level performance.
              </p>
            </div>

            <button
              type="button"
              onClick={handleNavigateCreate}
              className="h-10 px-5 rounded-md bg-[#2a5bd7] hover:bg-[#1a4bb7] text-white font-bold text-sm transition-colors shadow-2xs cursor-pointer flex items-center justify-center shrink-0"
            >
              Create campaign
            </button>
          </div>

          <hr className="border-slate-200/80 dark:border-slate-800" />

          {/* Main Campaign List */}
          <CampaignList
            campaigns={campaigns}
            isLoading={isLoading}
            isError={isError}
            refetch={refetch}
            onOpenCreateModal={handleNavigateCreate}
            onOpenAddLinks={(camp) => setModalAddLinksCampaign(camp)}
            onOpenEdit={(camp) => setModalEditCampaign(camp)}
          />
        </div>

      {/* Add Links Modal */}
      {modalAddLinksCampaign && (
        <AddCampaignLinksModal
          isOpen={Boolean(modalAddLinksCampaign)}
          onClose={() => setModalAddLinksCampaign(null)}
          campaignId={modalAddLinksCampaign._id}
          campaignName={modalAddLinksCampaign.name}
          configuredChannels={modalAddLinksCampaign.channels}
        />
      )}

      {/* Edit Campaign Modal */}
      {modalEditCampaign && (
        <EditCampaignModal
          isOpen={Boolean(modalEditCampaign)}
          onClose={() => setModalEditCampaign(null)}
          campaignId={modalEditCampaign._id}
          initialName={modalEditCampaign.name}
          initialDescription={modalEditCampaign.description}
          initialChannels={modalEditCampaign.channels}
        />
      )}
    </div>
  );
}
