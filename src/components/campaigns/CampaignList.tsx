'use client';

import React, { useState, useMemo } from 'react';
import { CampaignCard } from './CampaignCard';
import { Campaign } from '@/types/campaign.types';
import { TableSkeleton } from '@/components/shared/LoadingSkeleton';
import { Search, FolderPlus, FolderGit2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CampaignListProps {
  campaigns: Campaign[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  onOpenCreateModal: () => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  isLoading,
  isError,
  refetch,
  onOpenCreateModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery.trim()) return campaigns;
    const q = searchQuery.toLowerCase().trim();
    return campaigns.filter((c) => c.name.toLowerCase().includes(q));
  }, [campaigns, searchQuery]);

  if (isLoading) {
    return <TableSkeleton rows={4} />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
        <p className="font-semibold text-base">Failed to load campaigns</p>
        <p className="text-sm text-rose-600 dark:text-rose-400 mt-1">
          An error occurred while fetching your campaign list.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4">
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-md">
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 self-end sm:self-center">
          Showing {filteredCampaigns.length} of {campaigns.length} campaigns
        </div>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 mb-4">
            <FolderGit2 className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {searchQuery ? 'No campaigns found' : 'No campaigns created yet'}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md">
            {searchQuery
              ? `No campaigns match "${searchQuery}". Try a different search term.`
              : 'Create campaigns to group your links by marketing channels and track combined performance metrics.'}
          </p>
          {!searchQuery && (
            <Button
              variant="primary"
              size="md"
              leftIcon={<FolderPlus className="h-4 w-4" />}
              onClick={onOpenCreateModal}
              className="mt-6 font-semibold"
            >
              Create campaign
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
