'use client';

import React, { useState, useEffect } from 'react';
import { useCampaignMutations } from '@/hooks/useCampaignMutations';
import { useLinks } from '@/hooks/useLinks';
import { useUserChannels } from '@/hooks/useUserChannels';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SearchInput } from '@/components/ui/SearchInput';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Link2,
  Plus,
  Check,
  Globe,
  Layers,
  ChevronDown,
  Search,
  ExternalLink,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

interface AddCampaignLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignName: string;
  configuredChannels?: string[];
  initialSelectedChannel?: string;
}

export const AddCampaignLinksModal: React.FC<AddCampaignLinksModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  campaignName,
  configuredChannels = ['email', 'social', 'sms', 'paid'],
  initialSelectedChannel,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'assign'>('create');

  // Tab 1: Create State
  const [destinationUrl, setDestinationUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    initialSelectedChannel
      ? [initialSelectedChannel.toLowerCase().trim()]
      : configuredChannels.length > 0
        ? configuredChannels
        : ['email', 'social', 'sms'],
  );
  const [autoUtm, setAutoUtm] = useState(true);
  const [customChannelInput, setCustomChannelInput] = useState('');
  const [isAddingCustomChannel, setIsAddingCustomChannel] = useState(false);

  // Tab 2: Assign State
  const [searchExisting, setSearchExisting] = useState('');
  const [selectedLinkIds, setSelectedLinkIds] = useState<string[]>([]);
  const [targetChannel, setTargetChannel] = useState(
    initialSelectedChannel
      ? initialSelectedChannel.toLowerCase().trim()
      : configuredChannels[0] || 'email',
  );
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialSelectedChannel) {
        const ch = initialSelectedChannel.toLowerCase().trim();
        setSelectedChannels([ch]);
        setTargetChannel(ch);
      } else {
        setSelectedChannels(configuredChannels.length > 0 ? configuredChannels : ['email', 'social', 'sms']);
        setTargetChannel(configuredChannels[0] || 'email');
      }
    }
  }, [isOpen, initialSelectedChannel, configuredChannels]);

  const { links: allLinks = [], isLoading: isLoadingLinks } = useLinks();
  const { channels: userChannels = [] } = useUserChannels();
  const { addLinksBatch, isAddingLinks, assignLinks, isAssigning } = useCampaignMutations();

  // Combine channels
  const allAvailableChannels = Array.from(
    new Set([...configuredChannels, ...userChannels, 'email', 'social', 'sms', 'paid', 'linkedin', 'youtube', 'newsletters']),
  );

  const availableLinksToAssign = allLinks.filter(
    (l) => l.campaignId !== campaignId && (searchExisting ? (l.title?.toLowerCase().includes(searchExisting.toLowerCase()) || l.shortCode.toLowerCase().includes(searchExisting.toLowerCase()) || l.longUrl.toLowerCase().includes(searchExisting.toLowerCase())) : true),
  );

  const handleToggleChannel = (channel: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel],
    );
  };

  const handleAddCustomChannel = () => {
    const clean = customChannelInput.trim().toLowerCase();
    if (!clean) return;
    if (!selectedChannels.includes(clean)) {
      setSelectedChannels([...selectedChannels, clean]);
    }
    setCustomChannelInput('');
    setIsAddingCustomChannel(false);
  };

  const handleToggleLinkSelection = (id: string) => {
    setSelectedLinkIds((prev) => {
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

  const handleBatchCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationUrl.trim()) {
      toast.error('Please enter a destination URL');
      return;
    }
    if (selectedChannels.length === 0) {
      toast.error('Please select at least one marketing channel');
      return;
    }

    try {
      await addLinksBatch({
        id: campaignId,
        payload: {
          destinationUrl: destinationUrl.trim(),
          title: title.trim() || undefined,
          channels: selectedChannels,
          autoUtm,
        },
      });
      setDestinationUrl('');
      setTitle('');
      onClose();
    } catch {
      // Handled by hook
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLinkIds.length === 0) {
      toast.error('Please select at least one link to assign');
      return;
    }

    try {
      await assignLinks({
        id: campaignId,
        payload: {
          linkIds: selectedLinkIds,
          channel: targetChannel,
        },
      });
      setSelectedLinkIds([]);
      onClose();
    } catch {
      // Handled by hook
    }
  };

  const campaignSlug = campaignName.toLowerCase().replace(/[^a-z0-9]+/g, '_');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add links to "${campaignName}"`}
      description="Generate multi-channel tracked links with automated UTM tags or assign existing short links."
    >
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 -mx-4.5 sm:-mx-6 px-4.5 sm:px-6 mb-4 sm:mb-6 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`pb-2.5 sm:pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'create'
              ? 'border-[#2a5bd7] text-[#2a5bd7] dark:border-blue-500 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          <span className="flex items-center gap-1.5 sm:gap-2">
            <Layers className="h-4 w-4" />
            <span>Generate multi-channel links</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('assign')}
          className={`pb-2.5 sm:pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'assign'
              ? 'border-[#2a5bd7] text-[#2a5bd7] dark:border-blue-500 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          <span className="flex items-center gap-1.5 sm:gap-2">
            <Link2 className="h-4 w-4" />
            <span>Assign existing links</span>
          </span>
        </button>
      </div>

      {/* TAB 1: BATCH MULTI-CHANNEL GENERATION */}
      {activeTab === 'create' && (
        <form onSubmit={handleBatchCreateSubmit} className="space-y-4 sm:space-y-5">
          {/* Destination URL */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Destination URL *
            </label>
            <input
              type="text"
              required
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://example.com/promo/summer-deal"
              className="w-full h-10 sm:h-11 rounded-md border border-slate-300 bg-white px-3.5 sm:px-4 text-xs sm:text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Base Title */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Base Title <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Promo 2026"
              className="w-full h-10 sm:h-11 rounded-md border border-slate-300 bg-white px-3.5 sm:px-4 text-xs sm:text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Select Channels */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                Select Channels ({selectedChannels.length})
              </label>
              <span className="text-xs text-slate-400">One short link generated per channel</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {allAvailableChannels.map((ch) => {
                const isSelected = selectedChannels.includes(ch);
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => handleToggleChannel(ch)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#2a5bd7] text-white border-[#2a5bd7] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                    <span>{ch.charAt(0).toUpperCase() + ch.slice(1)}</span>
                  </button>
                );
              })}

              {isAddingCustomChannel ? (
                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    value={customChannelInput}
                    onChange={(e) => setCustomChannelInput(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomChannel();
                      } else if (e.key === 'Escape') {
                        setIsAddingCustomChannel(false);
                      }
                    }}
                    placeholder="Channel name"
                    className="h-8 w-28 rounded-md border border-blue-400 bg-white px-2 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomChannel}
                    className="h-8 px-2 rounded-md bg-[#2a5bd7] text-xs font-bold text-white hover:bg-[#1d4cc9] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingCustomChannel(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-dashed border-slate-300 text-[#2a5bd7] hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Custom channel</span>
                </button>
              )}
            </div>
          </div>

          {/* Auto UTM Toggle & Preview */}
          <div className="rounded-xl border border-slate-200/90 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60 space-y-3">
            <Checkbox
              checked={autoUtm}
              onCheckedChange={setAutoUtm}
              label={
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Auto-add UTM tracking parameters (Bitly Standard)
                </span>
              }
            />

            {autoUtm && selectedChannels.length > 0 && (
              <div className="space-y-1.5 pt-1 text-xs">
                <p className="font-semibold text-slate-500 dark:text-slate-400">
                  Each link will be tagged as:
                </p>
                <div className="bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-300 space-y-1 overflow-x-auto">
                  {selectedChannels.slice(0, 3).map((ch) => (
                    <div key={ch} className="truncate">
                      <span className="font-bold text-[#2a5bd7]">{ch}</span>: ?utm_source={ch}&utm_medium=trimly&utm_campaign={campaignSlug}
                    </div>
                  ))}
                  {selectedChannels.length > 3 && (
                    <div className="text-slate-400 italic">
                      + {selectedChannels.length - 3} more channel links...
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAddingLinks || !destinationUrl.trim() || selectedChannels.length === 0}
              className="w-full sm:w-auto font-bold"
            >
              {isAddingLinks ? 'Generating...' : `Create ${selectedChannels.length} Channel Link${selectedChannels.length > 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: ASSIGN EXISTING LINKS */}
      {activeTab === 'assign' && (
        <form onSubmit={handleAssignSubmit} className="space-y-4 sm:space-y-5">
          {/* Target Channel Selector */}
          <div className="space-y-1.5 relative">
            <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Assign to Channel
            </label>
            <button
              type="button"
              onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
              className="flex h-10 sm:h-11 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3.5 text-xs sm:text-sm font-medium text-[#273144] shadow-2xs focus:border-[#2a5bd7] cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <span>
                {targetChannel.charAt(0).toUpperCase() + targetChannel.slice(1)}
              </span>
              <div className="flex items-center gap-2 border-l border-slate-200 pl-2.5 dark:border-slate-700">
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${isChannelDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isChannelDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-full rounded-md bg-white py-1 shadow-lg border border-slate-200/90 z-30 max-h-56 overflow-y-auto dark:bg-slate-900 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                {allAvailableChannels.map((ch) => {
                  const isSelected = targetChannel.toLowerCase() === ch.toLowerCase();
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => {
                        setTargetChannel(ch);
                        setIsChannelDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
                    >
                      <span className="capitalize">{ch}</span>
                      {isSelected && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Existing Links */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                Select Links to Assign ({selectedLinkIds.length} selected)
              </label>
              {selectedLinkIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedLinkIds([])}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  Clear selection
                </button>
              )}
            </div>

            <SearchInput
              value={searchExisting}
              onChange={setSearchExisting}
              placeholder="Filter available links..."
              size="sm"
            />

            {/* Links List Checkboxes */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 max-h-56 overflow-y-auto p-1.5 space-y-1 bg-white dark:bg-slate-900">
              {isLoadingLinks ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading links...</div>
              ) : availableLinksToAssign.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  {searchExisting ? 'No matching links found' : 'No available unassigned links found'}
                </div>
              ) : (
                availableLinksToAssign.map((link) => {
                  const linkId = link._id || link.id || '';
                  const isChecked = selectedLinkIds.includes(linkId);
                  return (
                    <div
                      key={linkId}
                      onClick={() => handleToggleLinkSelection(linkId)}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                        isChecked
                          ? 'border-blue-200 bg-blue-50/60 dark:border-blue-900 dark:bg-blue-950/40'
                          : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        readOnly
                        tabIndex={-1}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {link.title || link.shortCode}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          <span className="font-semibold text-[#2a5bd7] dark:text-blue-400">trim.ly/{link.shortCode}</span> &rarr; {link.longUrl}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                        {link.clickCount || 0} clicks
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAssigning || selectedLinkIds.length === 0}
              className="w-full sm:w-auto font-bold"
            >
              {isAssigning ? 'Assigning...' : `Assign ${selectedLinkIds.length} Link${selectedLinkIds.length > 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
