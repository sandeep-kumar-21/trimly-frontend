'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createLinkSchema, CreateLinkFormData } from '@/lib/validators/link.schema';
import { useCreateLink } from '@/hooks/useCreateLink';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useUIStore } from '@/store/uiStore';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CreateCampaignModal } from '@/components/campaigns/CreateCampaignModal';
import { Link, Tag, Hash, Plus, FolderGit2, Layers } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const CHANNELS = [
  { value: 'email', label: 'Email' },
  { value: 'social', label: 'Social Media' },
  { value: 'sms', label: 'SMS' },
  { value: 'paid', label: 'Paid / Ads' },
  { value: 'other', label: 'Other' },
];

export const CreateLinkModal: React.FC = () => {
  const { isCreateModalOpen, closeCreateModal, defaultModalUrl } = useUIStore();
  const createLinkMutation = useCreateLink();
  const { campaigns, createCampaign, isCreating: isCreatingCampaign } = useCampaigns();

  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      longUrl: '',
      customAlias: '',
      title: '',
      campaignId: '',
      channel: '',
    },
  });

  const selectedCampaignId = watch('campaignId');

  useEffect(() => {
    if (defaultModalUrl) {
      setValue('longUrl', defaultModalUrl);
    }
  }, [defaultModalUrl, setValue]);

  const handleCampaignSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'CREATE_NEW') {
      setValue('campaignId', '');
      setIsCreateCampaignModalOpen(true);
    } else {
      setValue('campaignId', val);
    }
  };

  const handleClose = () => {
    reset();
    closeCreateModal();
  };

  const onSubmit = async (data: CreateLinkFormData) => {
    let formattedUrl = data.longUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    await createLinkMutation.mutateAsync({
      longUrl: formattedUrl,
      customAlias: data.customAlias?.trim() || undefined,
      title: data.title?.trim() || undefined,
      campaignId: data.campaignId || undefined,
      channel: data.channel || undefined,
    });
    reset();
  };

  return (
    <>
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleClose}
        title="Create a new short link"
        description="Enter destination URL and optional custom back-half, campaign, or marketing channel"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Destination URL *"
            type="text"
            placeholder="https://example.com/my-long-landing-page"
            leftIcon={<Link className="h-4 w-4" />}
            error={errors.longUrl?.message}
            {...register('longUrl')}
          />

          <Input
            label="Custom back-half (optional)"
            type="text"
            placeholder="my-custom-promo"
            leftIcon={<Hash className="h-4 w-4" />}
            helperText="e.g. trimly.link/my-custom-promo"
            error={errors.customAlias?.message}
            {...register('customAlias')}
          />

          <Input
            label="Title / Tag (optional)"
            type="text"
            placeholder="Summer Campaign 2026"
            leftIcon={<Tag className="h-4 w-4" />}
            error={errors.title?.message}
            {...register('title')}
          />

          {/* Campaign Select */}
          <div className="w-full space-y-1.5">
            <label className="block text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Campaign (optional)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
                <FolderGit2 className="h-4 w-4" />
              </div>
              <select
                value={selectedCampaignId || ''}
                onChange={handleCampaignSelectChange}
                className={cn(
                  'w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                )}
              >
                <option value="">No Campaign (None)</option>
                {campaigns.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
                <option value="CREATE_NEW" className="font-bold text-indigo-600">
                  + Create new campaign...
                </option>
              </select>
            </div>
          </div>

          {/* Channel Select */}
          <div className="w-full space-y-1.5">
            <label className="block text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Channel (optional)
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
              <select
                {...register('channel')}
                className={cn(
                  'w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                )}
              >
                <option value="">No Channel (None)</option>
                {CHANNELS.map((ch) => (
                  <option key={ch.value} value={ch.value}>
                    {ch.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleClose}
              disabled={createLinkMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={createLinkMutation.isPending}
              leftIcon={<Plus className="h-4 w-4" />}
              className="font-semibold"
            >
              Create link
            </Button>
          </div>
        </form>
      </Modal>

      {/* Inline Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateCampaignModalOpen}
        onClose={() => setIsCreateCampaignModalOpen(false)}
        onSubmitCampaign={async (data) => {
          const newCamp = await createCampaign(data);
          if (newCamp && newCamp._id) {
            setValue('campaignId', newCamp._id);
          }
        }}
        isLoading={isCreatingCampaign}
      />
    </>
  );
};
