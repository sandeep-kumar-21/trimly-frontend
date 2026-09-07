'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChannelGroup } from '@/types/campaign.types';
import { StatCard } from '@/components/analytics/StatCard';
import { formatNumber } from '@/lib/utils/formatNumber';
import { formatDate } from '@/lib/utils/formatDate';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useCampaignMutations } from '@/hooks/useCampaignMutations';
import { useLinks } from '@/hooks/useLinks';
import { SegmentedSwitch } from '@/components/ui/SegmentedSwitch';
import { SearchInput } from '@/components/ui/SearchInput';
import { Checkbox } from '@/components/ui/Checkbox';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/utils/clipboard';
import {
  Mail,
  Share2,
  MessageSquare,
  DollarSign,
  Globe,
  ExternalLink,
  Copy,
  Link2,
  MousePointerClick,
  Layers,
  Trophy,
  Search,
  PlusCircle,
  Plus,
  Unlink,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Loader2,
  Play,
  Newspaper,
} from 'lucide-react';

interface ChannelBreakdownProps {
  campaignId: string;
  channels: ChannelGroup[];
  totalClicks: number;
  totalLinks: number;
  topChannel?: { channel: string; clicks: number } | null;
  onOpenAddLinks?: () => void;
  onOpenAddLinkForChannel?: (channel: string) => void;
}

const channelIcons: Record<string, React.ReactNode> = {
  email: <Mail className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
  social: <Share2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
  sms: <MessageSquare className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
  paid: <DollarSign className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
  linkedin: <Share2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
  youtube: <Play className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
  newsletters: <Newspaper className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
  other: <Globe className="h-5 w-5 text-slate-500 dark:text-slate-400" />,
};

const channelBadgeStyles: Record<string, string> = {
  email: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800',
  social: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
  sms: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  paid: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  linkedin: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
  youtube: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
  newsletters: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
  other: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

const channelProgressColors: Record<string, string> = {
  email: 'bg-sky-500',
  social: 'bg-indigo-500',
  sms: 'bg-emerald-500',
  paid: 'bg-amber-500',
  linkedin: 'bg-blue-600',
  youtube: 'bg-red-500',
  newsletters: 'bg-purple-500',
  other: 'bg-slate-500',
};

const channelTextColors: Record<string, string> = {
  email: 'text-sky-600 dark:text-sky-400',
  social: 'text-indigo-600 dark:text-indigo-400',
  sms: 'text-emerald-600 dark:text-emerald-400',
  paid: 'text-amber-600 dark:text-amber-400',
  linkedin: 'text-blue-600 dark:text-blue-400',
  youtube: 'text-red-600 dark:text-red-400',
  newsletters: 'text-purple-600 dark:text-purple-400',
  other: 'text-slate-600 dark:text-slate-400',
};

export const ChannelBreakdown: React.FC<ChannelBreakdownProps> = ({
  campaignId,
  channels,
  totalClicks,
  totalLinks,
  topChannel,
  onOpenAddLinks,
  onOpenAddLinkForChannel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannelTab, setSelectedChannelTab] = useState('all');
  const [unlinkingLinkId, setUnlinkingLinkId] = useState<string | null>(null);

  // Inline Card Addition State
  const [activeInlineChannel, setActiveInlineChannel] = useState<string | null>(null);
  const [inlineMode, setInlineMode] = useState<'create' | 'assign'>('create');
  const [inlineUrl, setInlineUrl] = useState('');
  const [inlineTitle, setInlineTitle] = useState('');
  const [inlineAutoUtm, setInlineAutoUtm] = useState(true);
  const [inlineSelectedLinkIds, setInlineSelectedLinkIds] = useState<string[]>([]);
  const [inlineSearchExisting, setInlineSearchExisting] = useState('');

  const { links: allLinks = [], isLoading: isLoadingLinks } = useLinks();
  const {
    unlinkLink,
    isUnlinking,
    addLinksBatch,
    isAddingLinks,
    assignLinks,
    isAssigning,
  } = useCampaignMutations();

  const availableUnassignedLinks = useMemo(() => {
    return (allLinks as any[]).filter((l: any) => {
      const isNotInThisCampaign = l.campaignId !== campaignId;
      if (!isNotInThisCampaign) return false;
      if (!inlineSearchExisting.trim()) return true;
      const q = inlineSearchExisting.toLowerCase().trim();
      return (
        l.shortCode.toLowerCase().includes(q) ||
        l.longUrl.toLowerCase().includes(q) ||
        (l.title && l.title.toLowerCase().includes(q))
      );
    });
  }, [allLinks, campaignId, inlineSearchExisting]);

  const handleToggleInlineLinkSelection = (id: string) => {
    setInlineSelectedLinkIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 25) {
        toast.warning('Maximum 25 links can be assigned in a single batch');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleInlineCreateSubmit = async (channel: string) => {
    if (!inlineUrl.trim()) {
      toast.error('Please enter a destination URL');
      return;
    }
    try {
      await addLinksBatch({
        id: campaignId,
        payload: {
          destinationUrl: inlineUrl.trim(),
          title: inlineTitle.trim() || undefined,
          channels: [channel],
          autoUtm: inlineAutoUtm,
        },
      });
      setInlineUrl('');
      setInlineTitle('');
      setActiveInlineChannel(null);
    } catch {
      // Handled by hook
    }
  };

  const handleInlineAssignSubmit = async (channel: string) => {
    if (inlineSelectedLinkIds.length === 0) {
      toast.error('Please select at least one link to assign');
      return;
    }
    try {
      await assignLinks({
        id: campaignId,
        payload: {
          linkIds: inlineSelectedLinkIds,
          channel: channel,
        },
      });
      setInlineSelectedLinkIds([]);
      setActiveInlineChannel(null);
    } catch {
      // Handled by hook
    }
  };

  const handleCopyLink = async (shortUrl: string) => {
    const success = await copyToClipboard(shortUrl);
    if (success) {
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handleConfirmUnlink = async () => {
    if (!unlinkingLinkId) return;
    try {
      await unlinkLink({ id: campaignId, linkId: unlinkingLinkId });
      setUnlinkingLinkId(null);
    } catch {
      // Handled by hook
    }
  };

  // Filter channels based on search and selected tab
  const filteredChannelGroups = useMemo(() => {
    let result = channels;
    if (selectedChannelTab !== 'all') {
      result = result.filter(
        (g) => g.channel.toLowerCase() === selectedChannelTab.toLowerCase(),
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result
        .map((g) => ({
          ...g,
          links: g.links.filter(
            (l) =>
              l.shortCode.toLowerCase().includes(q) ||
              l.longUrl.toLowerCase().includes(q) ||
              (l.title && l.title.toLowerCase().includes(q)),
          ),
        }))
        .filter((g) => g.links.length > 0);
    }
    return result;
  }, [channels, selectedChannelTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 4 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Campaign Links"
          value={formatNumber(totalLinks)}
          description="Distributed across all channels"
          icon={
            <Link2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          }
        />
        <StatCard
          title="Total Campaign Clicks"
          value={formatNumber(totalClicks)}
          description="Aggregated across all channels"
          icon={
            <MousePointerClick className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          }
        />
        <StatCard
          title="Active Channels"
          value={channels.length}
          description="Configured marketing touchpoints"
          icon={
            <Layers className="h-5 w-5 text-slate-500 dark:text-slate-400" />
          }
        />
        <StatCard
          title="Top Performing Channel"
          value={topChannel && topChannel.clicks > 0 ? topChannel.channel : 'None yet'}
          description={
            topChannel && topChannel.clicks > 0
              ? `${formatNumber(topChannel.clicks)} clicks`
              : 'Add links to start tracking'
          }
          icon={
            <Trophy
              className={`h-5 w-5 ${
                topChannel && topChannel.clicks > 0
                  ? 'text-slate-500 dark:text-slate-400'
                  : 'text-slate-400'
              }`}
            />
          }
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search links in this campaign..."
          />
        </div>

        {/* Channel Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedChannelTab('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 border ${
              selectedChannelTab === 'all'
                ? 'bg-[#2a5bd7] text-white border-[#2a5bd7]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
            }`}
          >
            All Channels ({channels.length})
          </button>
          {channels.map((g) => (
            <button
              key={g.channel}
              type="button"
              onClick={() => setSelectedChannelTab(g.channel)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 border ${
                selectedChannelTab === g.channel
                  ? 'bg-[#2a5bd7] text-white border-[#2a5bd7]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800'
              }`}
            >
              {g.channel.charAt(0).toUpperCase() + g.channel.slice(1)} ({g.links.length})
            </button>
          ))}
        </div>
      </div>

      {/* Channel Groups Section */}
      <div className="space-y-6">
        {filteredChannelGroups.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <Layers className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
              No matching channels or links
            </p>
            {onOpenAddLinks && (
              <button
                type="button"
                onClick={onOpenAddLinks}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#2a5bd7] text-xs font-bold text-white hover:bg-[#1d4cc9] cursor-pointer shadow-2xs"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add links to campaign</span>
              </button>
            )}
          </div>
        ) : (
          filteredChannelGroups.map((group) => {
            const channelKey = group.channel ? group.channel.toLowerCase() : 'other';
            const icon = channelIcons[channelKey] || channelIcons.other;
            const progressColor = channelProgressColors[channelKey] || channelProgressColors.other;
            const pct = group.percentOfClicks ?? (totalClicks > 0 ? Math.round((group.totalClicks / totalClicks) * 100) : 0);

            return (
              <div
                key={group.channel}
                className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                {/* Channel Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold capitalize text-slate-900 dark:text-slate-100 truncate">
                          {group.channel || 'Other'}
                        </h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 shrink-0">
                          {group.links.length} {group.links.length === 1 ? 'link' : 'links'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {formatNumber(group.totalClicks)} clicks ({pct}% of campaign total)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="w-36 sm:w-48 space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400">
                        <span>Click Share</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (activeInlineChannel === group.channel) {
                          setActiveInlineChannel(null);
                        } else {
                          setActiveInlineChannel(group.channel);
                          setInlineMode('create');
                          setInlineUrl('');
                          setInlineTitle('');
                          setInlineSelectedLinkIds([]);
                          setInlineSearchExisting('');
                        }
                      }}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer shrink-0 shadow-2xs ${
                        activeInlineChannel === group.channel
                          ? 'border-[#2a5bd7] bg-blue-50 text-[#2a5bd7] dark:bg-blue-950/50 dark:text-blue-400'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#2a5bd7] hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-slate-750'
                      }`}
                      title={activeInlineChannel === group.channel ? 'Close drawer' : `Add link to ${group.channel}`}
                      aria-label={activeInlineChannel === group.channel ? 'Close drawer' : `Add link to ${group.channel}`}
                    >
                      <Plus className={`h-4 w-4 transition-transform duration-200 ${activeInlineChannel === group.channel ? 'rotate-45 text-slate-500 hover:text-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Inline Add Link Drawer */}
                {activeInlineChannel === group.channel && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-3.5 sm:p-4 dark:border-blue-900/60 dark:bg-blue-950/20 space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header: Mode Switcher & Close */}
                    <div className="flex items-center justify-between gap-2">
                      <SegmentedSwitch<'create' | 'assign'>
                        size="sm"
                        options={[
                          { value: 'create', label: 'Create New Link' },
                          { value: 'assign', label: 'Assign Existing Link' },
                        ]}
                        value={inlineMode}
                        onChange={setInlineMode}
                      />

                      <button
                        type="button"
                        onClick={() => setActiveInlineChannel(null)}
                        className="p-1 rounded-md text-slate-400 hover:bg-slate-200/50 hover:text-slate-700 dark:hover:bg-slate-800 cursor-pointer shrink-0"
                        title="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Mode 1: Create New Link */}
                    {inlineMode === 'create' ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="url"
                              placeholder="https://example.com/my-page *"
                              value={inlineUrl}
                              onChange={(e) => setInlineUrl(e.target.value)}
                              className="w-full h-8 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                              autoFocus
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Base Title (optional)"
                              value={inlineTitle}
                              onChange={(e) => setInlineTitle(e.target.value)}
                              className="w-full h-8 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                          <Checkbox
                            checked={inlineAutoUtm}
                            onCheckedChange={setInlineAutoUtm}
                            label={<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Auto-tag with campaign UTM parameters</span>}
                          />

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveInlineChannel(null)}
                              className="h-8 px-3 rounded-md border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInlineCreateSubmit(group.channel)}
                              disabled={isAddingLinks || !inlineUrl.trim()}
                              className="h-8 px-3 rounded-md bg-[#2a5bd7] hover:bg-[#1a4bb7] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isAddingLinks ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  <span>Creating...</span>
                                </>
                              ) : (
                                <span>Create & Attach Link</span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Mode 2: Assign Existing Link */
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                Select Links to Assign to {group.channel}
                              </span>
                              {inlineSelectedLinkIds.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#2a5bd7] dark:bg-blue-900 dark:text-blue-300">
                                  {inlineSelectedLinkIds.length} / 25 selected
                                </span>
                              )}
                            </div>
                            {inlineSelectedLinkIds.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setInlineSelectedLinkIds([])}
                                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                              >
                                Clear selection
                              </button>
                            )}
                          </div>

                          <input
                            type="text"
                            placeholder="Search existing links by title, code or URL..."
                            value={inlineSearchExisting}
                            onChange={(e) => setInlineSearchExisting(e.target.value)}
                            className="w-full h-8 px-3 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            autoFocus
                          />

                          <div className="max-h-44 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg p-1 bg-white dark:bg-slate-800 space-y-1">
                            {isLoadingLinks ? (
                              <div className="p-3 text-center text-xs text-slate-400">Loading links...</div>
                            ) : availableUnassignedLinks.length === 0 ? (
                              <div className="p-3 text-center text-xs text-slate-400">
                                {inlineSearchExisting ? 'No matching links found' : 'No available unassigned links to assign'}
                              </div>
                            ) : (
                              availableUnassignedLinks.map((l: any) => {
                                const id = l._id || l.id || '';
                                const isSelected = inlineSelectedLinkIds.includes(id);
                                return (
                                  <div
                                    key={id}
                                    onClick={() => handleToggleInlineLinkSelection(id)}
                                    className={`w-full px-2.5 py-2 rounded-lg flex items-center justify-between gap-2.5 text-xs transition-colors cursor-pointer border ${
                                      isSelected
                                        ? 'border-blue-200 bg-blue-50/70 text-[#2a5bd7] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400 font-bold'
                                        : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                      <Checkbox
                                        checked={isSelected}
                                        readOnly
                                        tabIndex={-1}
                                      />
                                      <div className="min-w-0 flex-1 flex items-center gap-1.5 overflow-hidden">
                                        <span className="font-bold text-[#2a5bd7] dark:text-blue-400 shrink-0 whitespace-nowrap">trim.ly/{l.shortCode}</span>
                                        {l.title && <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">• {l.title}</span>}
                                        <span className="text-[11px] text-slate-400 ml-1 truncate shrink-0">({l.longUrl.slice(0, 35)}...)</span>
                                      </div>
                                    </div>
                                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[#2a5bd7]" />}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveInlineChannel(null)}
                            className="h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInlineAssignSubmit(group.channel)}
                            disabled={isAssigning || inlineSelectedLinkIds.length === 0}
                            className="h-8 px-3 rounded-lg bg-[#2a5bd7] hover:bg-[#1a4bb7] text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isAssigning ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Assigning...</span>
                              </>
                            ) : (
                              <span>
                                {inlineSelectedLinkIds.length > 1
                                  ? `Assign ${inlineSelectedLinkIds.length} links to ${group.channel}`
                                  : inlineSelectedLinkIds.length === 1
                                    ? `Assign 1 link to ${group.channel}`
                                    : `Assign to ${group.channel}`}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Grouped Links List */}
                {group.links.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50/50 rounded-xl dark:bg-slate-800/30">
                    No links assigned to {group.channel} channel yet.
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-1">
                    {group.links.map((link) => {
                      const linkId = link._id || link.id || '';
                      const shortUrl = link.shortUrl || `http://localhost:4000/${link.shortCode}`;
                      return (
                        <div
                          key={linkId}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-800/30 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <Link
                                href={`/links/${link.shortCode}/details`}
                                className="font-bold text-xs text-[#2a5bd7] hover:underline dark:text-blue-400 shrink-0 whitespace-nowrap"
                              >
                                trim.ly/{link.shortCode}
                              </Link>
                              {link.title && (
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate min-w-0">
                                  • {link.title}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-xl">
                              {link.longUrl}
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                              <MousePointerClick className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                              <span>{link.clickCount === 1 ? '1 click' : `${formatNumber(link.clickCount || 0)} clicks`}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCopyLink(shortUrl)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                title="Copy short link"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                              <a
                                href={shortUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                                title="Open destination URL"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                              <button
                                type="button"
                                onClick={() => setUnlinkingLinkId(linkId)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:border-rose-800/80 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                title="Unlink from campaign"
                              >
                                <Unlink className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(unlinkingLinkId)}
        onClose={() => setUnlinkingLinkId(null)}
        onConfirm={handleConfirmUnlink}
        title="Unlink Short Link?"
        description="This will remove the link from this campaign. The link will remain active as a standalone short link."
        confirmText="Unlink"
        variant="danger"
        isLoading={isUnlinking}
      />
    </div>
  );
};
