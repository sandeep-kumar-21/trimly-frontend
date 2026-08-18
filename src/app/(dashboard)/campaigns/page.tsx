'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useCreateLink } from '@/hooks/useCreateLink';
import { CampaignsLanding } from '@/components/campaigns/CampaignsLanding';
import { CampaignCreationHeader } from '@/components/campaigns/CampaignCreationHeader';
import { CampaignDetailsFormCard } from '@/components/campaigns/CampaignDetailsFormCard';
import { CampaignPreviewCard } from '@/components/campaigns/CampaignPreviewCard';
import { CampaignActionBar } from '@/components/campaigns/CampaignActionBar';
import { CampaignList } from '@/components/campaigns/CampaignList';
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal';
import { Button } from '@/components/ui/Button';
import { FolderPlus, FolderGit2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CampaignsPage() {
  const router = useRouter();
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed);
  const { campaigns, isLoading, isError, refetch, createCampaign, isCreating } = useCampaigns();
  const createLinkMutation = useCreateLink();

  // View state: 'landing' (Bitly Hero UI), 'list' (Campaign Cards Grid), 'create' (App 2-Column Form UI)
  const [viewState, setViewState] = useState<'landing' | 'list' | 'create'>('landing');

  // Form State for 2-column Creation UI
  const [campaignName, setCampaignName] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['email', 'social', 'sms']);
  const [initialLinkUrl, setInitialLinkUrl] = useState('');
  const [initialLinkChannel, setInitialLinkChannel] = useState('email');
  const [initialLinkTitle, setInitialLinkTitle] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback modal state (for quick create if needed from list view)
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && campaigns.length > 0 && viewState !== 'create') {
      setViewState('list');
    }
  }, [isLoading, campaigns.length, viewState]);

  const handleStartCreate = () => {
    setSidebarCollapsed(true);
    setViewState('create');
  };

  const handleCancelCreate = () => {
    setSidebarCollapsed(false);
    setCampaignName('');
    setNameError('');
    setInitialLinkUrl('');
    setViewState(campaigns.length > 0 ? 'list' : 'landing');
  };

  const handleToggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const handleSubmitCreation = async () => {
    const trimmedName = campaignName.trim();
    if (!trimmedName) {
      setNameError('Campaign Name is required');
      return;
    }
    setNameError('');
    setIsSubmitting(true);

    try {
      // 1. Create Campaign
      const newCamp = await createCampaign({ name: trimmedName });

      // 2. If initial link URL provided, create link assigned to this campaign
      if (initialLinkUrl.trim() && newCamp && newCamp._id) {
        let formattedUrl = initialLinkUrl.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
          formattedUrl = `https://${formattedUrl}`;
        }
        await createLinkMutation.mutateAsync({
          longUrl: formattedUrl,
          title: initialLinkTitle.trim() || undefined,
          campaignId: newCamp._id,
          channel: initialLinkChannel,
        });
      }

      setSidebarCollapsed(false);
      // Navigate to detail page of created campaign
      if (newCamp && newCamp._id) {
        router.push(`/campaigns/${newCamp._id}`);
      } else {
        setViewState('list');
      }
    } catch (err: any) {
      toast.error('Failed to create campaign', {
        description: err.response?.data?.message || 'An error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* --------------------------------------------------------- */}
      {/* STATE 1: LANDING VIEW (Bitly Exact Match Hero UI)         */}
      {/* --------------------------------------------------------- */}
      {viewState === 'landing' && (
        <CampaignsLanding onStartCreate={handleStartCreate} />
      )}

      {/* --------------------------------------------------------- */}
      {/* STATE 2: CAMPAIGN CREATION VIEW (App 2-Column Card UI)    */}
      {/* --------------------------------------------------------- */}
      {viewState === 'create' && (
        <div className="space-y-6">
          {/* Stepper Header */}
          <CampaignCreationHeader />

          {/* Main 2-Column Creation Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
            {/* Left Column: Form Cards (~7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Campaign Details Card */}
              <CampaignDetailsFormCard
                campaignName={campaignName}
                onCampaignNameChange={(val) => {
                  setCampaignName(val);
                  if (val.trim()) setNameError('');
                }}
                selectedChannels={selectedChannels}
                onToggleChannel={handleToggleChannel}
                initialLinkUrl={initialLinkUrl}
                onInitialLinkUrlChange={setInitialLinkUrl}
                initialLinkChannel={initialLinkChannel}
                onInitialLinkChannelChange={setInitialLinkChannel}
                initialLinkTitle={initialLinkTitle}
                onInitialLinkTitleChange={setInitialLinkTitle}
                errorName={nameError}
              />

              {/* Action Bar */}
              <CampaignActionBar
                onCancel={handleCancelCreate}
                onSubmit={handleSubmitCreation}
                isLoading={isSubmitting || isCreating}
              />
            </div>

            {/* Right Column: Live Campaign Preview Card (~5 Cols) */}
            <div className="lg:col-span-5">
              <CampaignPreviewCard
                campaignName={campaignName}
                selectedChannels={selectedChannels}
                initialLinkUrl={initialLinkUrl}
              />
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- */}
      {/* STATE 3: CAMPAIGNS LIST VIEW (Dashboard Cards Grid)       */}
      {/* --------------------------------------------------------- */}
      {viewState === 'list' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-7 w-7 text-[#0c3ebb] dark:text-blue-400" />
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Campaigns
                </h1>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Group your short links into marketing campaigns to measure total and channel-level performance.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<FolderPlus className="h-4 w-4" />}
              onClick={handleStartCreate}
              className="shrink-0 font-semibold"
            >
              Create campaign
            </Button>
          </div>

          <hr className="border-slate-200/80 dark:border-slate-800" />

          {/* Main Campaign List */}
          <CampaignList
            campaigns={campaigns}
            isLoading={isLoading}
            isError={isError}
            refetch={refetch}
            onOpenCreateModal={handleStartCreate}
          />
        </div>
      )}

      {/* Quick Modal fallback */}
      <CreateCampaignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitCampaign={async (data) => {
          await createCampaign(data);
        }}
        isLoading={isCreating}
      />
    </div>
  );
}
