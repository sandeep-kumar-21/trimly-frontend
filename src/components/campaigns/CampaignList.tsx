'use client';

import React, { useState, useMemo } from 'react';
import { CampaignCard } from './CampaignCard';
import { Campaign } from '@/types/campaign.types';
import { TableSkeleton } from '@/components/shared/LoadingSkeleton';
import { ArrowUpDown } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Button } from '@/components/ui/Button';

interface CampaignListProps {
  campaigns: Campaign[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  onOpenCreateModal: () => void;
  onOpenAddLinks?: (campaign: Campaign) => void;
  onOpenEdit?: (campaign: Campaign) => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  isLoading,
  isError,
  refetch,
  onOpenCreateModal,
  onOpenAddLinks,
  onOpenEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'clicks' | 'links'>('newest');
  const [channelFilter, setChannelFilter] = useState('all');

  // Extract all distinct channels across all campaigns
  const availableChannels = useMemo(() => {
    const set = new Set<string>();
    campaigns.forEach((c) => {
      (c.channels || []).forEach((ch) => set.add(ch.toLowerCase().trim()));
    });
    return Array.from(set).filter(Boolean).sort();
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    let result = [...campaigns];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)),
      );
    }

    if (channelFilter !== 'all') {
      result = result.filter((c) => (c.channels || []).includes(channelFilter));
    }

    if (sortBy === 'clicks') {
      result.sort((a, b) => (b.totalClicks || 0) - (a.totalClicks || 0));
    } else if (sortBy === 'links') {
      result.sort((a, b) => (b.totalLinks || 0) - (a.totalLinks || 0));
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [campaigns, searchQuery, channelFilter, sortBy]);

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
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Sort Selector */}
          <div className="w-full sm:w-48">
            <CustomSelect<'newest' | 'clicks' | 'links'>
              size="sm"
              triggerIcon={<ArrowUpDown className="h-3.5 w-3.5" />}
              options={[
                { value: 'newest', label: 'Newest first' },
                { value: 'clicks', label: 'Highest clicks' },
                { value: 'links', label: 'Most links' },
              ]}
              value={sortBy}
              onChange={setSortBy}
              align="right"
            />
          </div>
        </div>
      </div>

      {/* Channel Filter Chips */}
      {availableChannels.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setChannelFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 border ${
              channelFilter === 'all'
                ? 'bg-[#2a5bd7] text-white border-[#2a5bd7]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
            }`}
          >
            All Channels
          </button>
          {availableChannels.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setChannelFilter(ch)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 border ${
                channelFilter === ch
                  ? 'bg-[#2a5bd7] text-white border-[#2a5bd7]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
              }`}
            >
              {ch.charAt(0).toUpperCase() + ch.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Campaigns Grid */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onOpenAddLinks={onOpenAddLinks}
              onOpenEdit={onOpenEdit}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {searchQuery || channelFilter !== 'all' ? 'No matching campaigns' : 'No campaigns created yet'}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md">
            {searchQuery || channelFilter !== 'all'
              ? 'No campaigns match your current search and filter criteria.'
              : 'Create campaigns to group your links by marketing channels and track combined performance metrics.'}
          </p>
          {!searchQuery && channelFilter === 'all' && (
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="mt-6 h-10 px-5 rounded-md bg-[#2a5bd7] hover:bg-[#1a4bb7] text-white font-bold text-sm transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
            >
              Create campaign
            </button>
          )}
        </div>
      )}
    </div>
  );
};
