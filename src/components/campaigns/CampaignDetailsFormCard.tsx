'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, Check, Plus, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CampaignDetailsFormCardProps {
  campaignName: string;
  onCampaignNameChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  selectedChannels: string[];
  onToggleChannel: (channel: string) => void;
  onAddCustomChannel: (channel: string) => void;
  onSaveDefaultChannels?: () => void;
  initialLinkUrl: string;
  onInitialLinkUrlChange: (val: string) => void;
  initialLinkChannel: string;
  onInitialLinkChannelChange: (val: string) => void;
  initialLinkTitle: string;
  onInitialLinkTitleChange: (val: string) => void;
  errorName?: string;
}

const PRESET_CHANNELS = [
  { id: 'email', label: 'Email' },
  { id: 'social', label: 'Social Media' },
  { id: 'sms', label: 'SMS' },
  { id: 'paid', label: 'Paid / Ads' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'newsletters', label: 'Newsletters' },
  { id: 'other', label: 'Other' },
];

export const CampaignDetailsFormCard: React.FC<CampaignDetailsFormCardProps> = ({
  campaignName,
  onCampaignNameChange,
  description,
  onDescriptionChange,
  selectedChannels,
  onToggleChannel,
  onAddCustomChannel,
  onSaveDefaultChannels,
  initialLinkUrl,
  onInitialLinkUrlChange,
  initialLinkChannel,
  onInitialLinkChannelChange,
  initialLinkTitle,
  onInitialLinkTitleChange,
  errorName,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [customChannelInput, setCustomChannelInput] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const channelDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (channelDropdownRef.current && !channelDropdownRef.current.contains(e.target as Node)) {
        setIsChannelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddCustom = () => {
    const clean = customChannelInput.trim().toLowerCase();
    if (!clean) return;
    onAddCustomChannel(clean);
    setCustomChannelInput('');
    setIsAddingCustom(false);
  };

  // Combine preset and any user custom channels
  const allChannels = Array.from(
    new Set([...PRESET_CHANNELS.map((p) => p.id), ...selectedChannels]),
  );

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-4.5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Collapsible Card Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left cursor-pointer select-none"
      >
        <h2 className="text-base sm:text-lg font-bold text-[#273144] dark:text-slate-100">
          Campaign details
        </h2>
        <div className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 space-y-6 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Campaign Overview Inputs */}
          <div className="space-y-5">
            <p className="text-xs sm:text-sm text-[#526281] dark:text-slate-400">
              Create a campaign to group your links by marketing channels and track combined performance metrics.
            </p>

            {/* Campaign Name */}
            <div className="space-y-1.5">
              <label htmlFor="campaign-name" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                Campaign Name *
              </label>
              <input
                id="campaign-name"
                type="text"
                required
                maxLength={100}
                value={campaignName}
                onChange={(e) => onCampaignNameChange(e.target.value)}
                placeholder="e.g. Fall Promo 2026, Q3 Product Launch"
                className={cn(
                  'w-full h-11 rounded-lg border bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:ring-2 focus:ring-blue-100 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
                  errorName ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300'
                )}
              />
              {errorName && <p className="text-sm font-medium text-red-600">{errorName}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="campaign-description" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                Description <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                id="campaign-description"
                rows={2}
                maxLength={500}
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="Notes or campaign goals..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:ring-2 focus:ring-blue-100 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 resize-none"
              />
            </div>

            {/* Channel Selection Chips */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                  Marketing Channels <span className="font-normal text-slate-400">(select channels)</span>
                </label>
                {onSaveDefaultChannels && (
                  <button
                    type="button"
                    onClick={onSaveDefaultChannels}
                    title="Save current channel selection as your default for new campaigns"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-[#2a5bd7] hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-blue-400 transition-colors cursor-pointer shadow-2xs group shrink-0"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-amber-500 fill-amber-500/20 group-hover:fill-amber-500 transition-colors" />
                    <span>Set as default</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
              {allChannels.map((chId) => {
                const isSelected = selectedChannels.includes(chId);
                const presetObj = PRESET_CHANNELS.find((p) => p.id === chId);
                const label = presetObj ? presetObj.label : chId.charAt(0).toUpperCase() + chId.slice(1);
                return (
                  <button
                    key={chId}
                    type="button"
                    onClick={() => onToggleChannel(chId)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer select-none',
                      isSelected
                        ? 'bg-[#2a5bd7] border-[#2a5bd7] text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                    <span>{label}</span>
                  </button>
                );
              })}

              {isAddingCustom ? (
                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    value={customChannelInput}
                    onChange={(e) => setCustomChannelInput(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustom();
                      } else if (e.key === 'Escape') {
                        setIsAddingCustom(false);
                      }
                    }}
                    placeholder="Channel name"
                    className="h-8 w-28 rounded-md border border-blue-400 bg-white px-2 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustom}
                    className="h-8 px-2 rounded-md bg-[#2a5bd7] text-xs font-bold text-white hover:bg-[#1d4cc9] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-dashed border-slate-300 text-[#2a5bd7] hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>Custom channel</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Optional First Link Section */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#273144] dark:text-slate-200">
                Add initial link to campaign <span className="font-normal text-slate-400">(optional)</span>
              </h3>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="initial-link-url" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                Destination URL
              </label>
              <input
                id="initial-link-url"
                type="text"
                value={initialLinkUrl}
                onChange={(e) => onInitialLinkUrlChange(e.target.value)}
                placeholder="https://example.com/my-campaign-landing"
                className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 relative" ref={channelDropdownRef}>
                <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                  Channel for this link
                </label>
                <button
                  type="button"
                  onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
                  className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-medium text-[#273144] shadow-2xs focus:border-[#2a5bd7] cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <span>
                    {initialLinkChannel === 'all'
                      ? 'All channels'
                      : initialLinkChannel.charAt(0).toUpperCase() + initialLinkChannel.slice(1)}
                  </span>
                  <div className="flex items-center gap-2 border-l border-slate-200 pl-2.5 dark:border-slate-700">
                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${isChannelDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isChannelDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-1.5 w-full rounded-md bg-white py-1 shadow-lg border border-slate-200/90 z-50 max-h-56 overflow-y-auto dark:bg-slate-900 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        onInitialLinkChannelChange('all');
                        setIsChannelDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-left"
                    >
                      <span className="font-semibold">All channels</span>
                      {initialLinkChannel === 'all' && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                    </button>

                    {allChannels.map((ch) => {
                      const isSelected = initialLinkChannel.toLowerCase() === ch.toLowerCase();
                      const presetObj = PRESET_CHANNELS.find((p) => p.id === ch);
                      const label = presetObj ? presetObj.label : ch.charAt(0).toUpperCase() + ch.slice(1);
                      return (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => {
                            onInitialLinkChannelChange(ch);
                            setIsChannelDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-left"
                        >
                          <span>{label}</span>
                          {isSelected && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="link-title" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                  Link Title <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  id="link-title"
                  type="text"
                  value={initialLinkTitle}
                  onChange={(e) => onInitialLinkTitleChange(e.target.value)}
                  placeholder="e.g. Promo Newsletter Link"
                  className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
