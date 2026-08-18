'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCampaignSchema, CreateCampaignFormData } from '@/lib/validators/campaign.schema';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FolderPlus, FolderGit2 } from 'lucide-react';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCampaign: (data: CreateCampaignFormData) => Promise<void>;
  isLoading?: boolean;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onSubmitCampaign,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: CreateCampaignFormData) => {
    await onSubmitCampaign(data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create a new campaign"
      description="Organize your short links into marketing campaigns to track channel performance"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Campaign Name *"
          type="text"
          placeholder="e.g. Summer Sale 2026, Q3 Launch, Black Friday"
          leftIcon={<FolderGit2 className="h-4 w-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
          <Button type="button" variant="outline" size="md" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            leftIcon={<FolderPlus className="h-4 w-4" />}
            className="font-semibold"
          >
            Create campaign
          </Button>
        </div>
      </form>
    </Modal>
  );
};
