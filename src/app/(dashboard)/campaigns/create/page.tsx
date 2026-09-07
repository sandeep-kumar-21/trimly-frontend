'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { useCampaignMutations } from '@/hooks/useCampaignMutations';
import { useCreateLink } from '@/hooks/useCreateLink';
import { CampaignCreationHeader } from '@/components/campaigns/CampaignCreationHeader';
import { CampaignDetailsFormCard } from '@/components/campaigns/CampaignDetailsFormCard';
import { CampaignPreviewCard } from '@/components/campaigns/CampaignPreviewCard';
import { CampaignActionBar } from '@/components/campaigns/CampaignActionBar';
import { toast } from 'sonner';

export default function CreateCampaignPage() {
  const router = useRouter();
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed);
  const { createCampaign, isCreating, addLinksBatch } = useCampaignMutations();

  // Collapse sidebar on mount for spacious layout
  useEffect(() => {
    setSidebarCollapsed(true);
    try {
      const saved = localStorage.getItem('trimly_default_campaign_channels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSelectedChannels(parsed);
        }
      }
    } catch {
      // Fallback to default
    }
    return () => setSidebarCollapsed(false);
  }, [setSidebarCollapsed]);

  // Form State
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'email',
    'social',
    'sms',
    'paid',
  ]);
  const [initialLinkUrl, setInitialLinkUrl] = useState('');
  const [initialLinkChannel, setInitialLinkChannel] = useState('all');
  const [initialLinkTitle, setInitialLinkTitle] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    router.push('/campaigns');
  };

  const handleToggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel],
    );
  };

  const handleAddCustomChannel = (channel: string) => {
    if (!selectedChannels.includes(channel)) {
      setSelectedChannels([...selectedChannels, channel]);
    }
  };

  const handleSaveDefaultChannels = () => {
    if (selectedChannels.length === 0) {
      toast.warning('Select at least one channel to set as default.');
      return;
    }
    try {
      localStorage.setItem('trimly_default_campaign_channels', JSON.stringify(selectedChannels));
      toast.success('Default channels saved for future campaigns!');
    } catch {
      toast.error('Failed to save default channels.');
    }
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
      const newCamp = await createCampaign({
        name: trimmedName,
        description: description.trim() || undefined,
        channels: selectedChannels,
      });

      // 2. If initial link URL provided, create links across all or selected channel
      if (initialLinkUrl.trim() && newCamp && newCamp._id) {
        let formattedUrl = initialLinkUrl.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
          formattedUrl = `https://${formattedUrl}`;
        }
        const channelsToGenerate =
          initialLinkChannel === 'all'
            ? selectedChannels.length > 0
              ? selectedChannels
              : ['email', 'social', 'sms', 'paid']
            : [initialLinkChannel];

        await addLinksBatch({
          id: newCamp._id,
          payload: {
            destinationUrl: formattedUrl,
            title: initialLinkTitle.trim() || undefined,
            channels: channelsToGenerate,
            autoUtm: true,
          },
        });
      }

      toast.success('Campaign created successfully!');
      if (newCamp && newCamp._id) {
        router.push(`/campaigns/${newCamp._id}`);
      } else {
        router.push('/campaigns');
      }
    } catch {
      // Handled by hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            description={description}
            onDescriptionChange={setDescription}
            selectedChannels={selectedChannels}
            onToggleChannel={handleToggleChannel}
            onAddCustomChannel={handleAddCustomChannel}
            onSaveDefaultChannels={handleSaveDefaultChannels}
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
            onCancel={handleCancel}
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
  );
}
