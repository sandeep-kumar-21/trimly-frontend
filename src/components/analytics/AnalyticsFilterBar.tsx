'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAnalyticsStore, DatePreset } from '@/store/useAnalyticsStore';
import { useCampaigns } from '@/hooks/useCampaigns';
import { AnalyticsDashboardResponse } from '@/types/analytics.types';
import { exportAnalyticsToCsv } from '@/lib/utils/analyticsExport';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { LinkIcon } from '@/components/icons/AppIcons';
import {
  Filter,
  Calendar,
  Download,
  FolderKanban,
  RotateCcw,
  Check,
  ChevronDown,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsFilterBarProps {
  analyticsData?: AnalyticsDashboardResponse;
  isLoading?: boolean;
  hideScopeSelector?: boolean;
  scopeLabel?: string;
}

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  analyticsData,
  isLoading,
  hideScopeSelector = false,
  scopeLabel,
}) => {
  const {
    selectedShortCode,
    selectedCampaignId,
    datePreset,
    customFrom,
    customTo,
    compareMode,
    setSelectedShortCode,
    setSelectedCampaignId,
    setDatePreset,
    setCustomDateRange,
    setCompareMode,
    resetFilters,
  } = useAnalyticsStore();

  const { campaigns } = useCampaigns();
  const userUrls = analyticsData?.userUrls || [];

  const [isLinkDropdownOpen, setIsLinkDropdownOpen] = useState(false);
  const [isCampaignDropdownOpen, setIsCampaignDropdownOpen] = useState(false);
  const [linkSearchQuery, setLinkSearchQuery] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [tempFrom, setTempFrom] = useState(customFrom || '');
  const [tempTo, setTempTo] = useState(customTo || '');

  const linkDropdownRef = useRef<HTMLDivElement>(null);
  const campaignDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (linkDropdownRef.current && !linkDropdownRef.current.contains(e.target as Node)) {
        setIsLinkDropdownOpen(false);
      }
      if (campaignDropdownRef.current && !campaignDropdownRef.current.contains(e.target as Node)) {
        setIsCampaignDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUrls = userUrls.filter(
    (u) =>
      u.shortCode.toLowerCase().includes(linkSearchQuery.toLowerCase()) ||
      (u.title && u.title.toLowerCase().includes(linkSearchQuery.toLowerCase())) ||
      u.longUrl.toLowerCase().includes(linkSearchQuery.toLowerCase())
  );

  const selectedLinkObj = userUrls.find((u) => u.shortCode === selectedShortCode);
  const selectedCampaignObj = campaigns.find((c: any) => c._id === selectedCampaignId);

  const handleApplyCustom = () => {
    if (!tempFrom && !tempTo) return;
    setCustomDateRange(tempFrom, tempTo);
    setShowCustomModal(false);
  };

  const handleExport = () => {
    if (!analyticsData) {
      toast.error('No analytics data available to export');
      return;
    }
    const scopeName = selectedLinkObj ? `trim.ly/${selectedLinkObj.shortCode}` : 'All Links';
    const campaignName = selectedCampaignObj ? selectedCampaignObj.name : 'All Campaigns';
    const dateRangeLabel =
      datePreset === 'custom'
        ? `${customFrom || 'Start'} to ${customTo || 'Now'}`
        : datePreset.toUpperCase();

    exportAnalyticsToCsv(analyticsData, {
      scopeName,
      campaignName,
      dateRangeLabel,
    });
    toast.success('Analytics CSV report downloaded successfully');
  };

  const PRESETS: { id: DatePreset; label: string }[] = [
    { id: '24h', label: 'Today (24h)' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: 'all', label: 'All Time' },
  ];

  const hasActiveFilters =
    Boolean(selectedShortCode) ||
    Boolean(selectedCampaignId) ||
    datePreset !== '30d';

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Scope Dropdowns or Scope Label */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!hideScopeSelector ? (
            <>
              {/* Link Selector Dropdown */}
              <div className="relative" ref={linkDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsLinkDropdownOpen(!isLinkDropdownOpen);
                    setIsCampaignDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#273144] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                >
                  <LinkIcon className="h-3.5 w-3.5 text-[#2a5bd7] dark:text-blue-400" />
                  <span className="max-w-[140px] truncate">
                    {selectedLinkObj
                      ? selectedLinkObj.title || `trim.ly/${selectedLinkObj.shortCode}`
                      : 'All Links'}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {isLinkDropdownOpen && (
                  <div className="absolute left-0 z-50 mt-1.5 w-72 rounded-md border border-slate-200/90 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                      <SearchInput
                        size="sm"
                        placeholder="Search short links..."
                        value={linkSearchQuery}
                        onChange={setLinkSearchQuery}
                        autoFocus
                      />
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedShortCode(null);
                          setIsLinkDropdownOpen(false);
                        }}
                        className="flex w-full items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
                      >
                        <span>All Links (Account-Wide)</span>
                        {!selectedShortCode && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                      </button>

                      {filteredUrls.map((u) => (
                        <button
                          key={u.shortCode}
                          type="button"
                          onClick={() => {
                            setSelectedShortCode(u.shortCode);
                            setIsLinkDropdownOpen(false);
                          }}
                          className="flex w-full items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
                        >
                          <div className="flex flex-col text-left truncate mr-2">
                            <span className="font-medium truncate text-[#273144] dark:text-slate-100">
                              {u.title || `trim.ly/${u.shortCode}`}
                            </span>
                            <span className="text-xs text-slate-400 truncate font-normal">
                              trim.ly/{u.shortCode}
                            </span>
                          </div>
                          {selectedShortCode === u.shortCode && <Check className="h-4 w-4 shrink-0 text-[#273144] dark:text-slate-100 stroke-[2]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Campaign Selector Dropdown */}
              <div className="relative" ref={campaignDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCampaignDropdownOpen(!isCampaignDropdownOpen);
                    setIsLinkDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#273144] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
                >
                  <FolderKanban className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="max-w-[130px] truncate">
                    {selectedCampaignObj ? selectedCampaignObj.name : 'All Campaigns'}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {isCampaignDropdownOpen && (
                  <div className="absolute left-0 z-50 mt-1.5 w-60 rounded-md border border-slate-200/90 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCampaignId(null);
                        setIsCampaignDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
                    >
                      <span>All Campaigns</span>
                      {!selectedCampaignId && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                    </button>

                    {campaigns.map((c: any) => (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => {
                          setSelectedCampaignId(c._id);
                          setIsCampaignDropdownOpen(false);
                        }}
                        className="flex w-full items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
                      >
                        <span className="truncate">{c.name}</span>
                        {selectedCampaignId === c._id && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#2a5bd7] dark:bg-blue-900/40 dark:text-blue-400">
                <Filter className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold text-[#273144] dark:text-slate-200">
                {scopeLabel || 'Specific Link Telemetry'}
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Actions (Compare Toggle & Export CSV) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5">
          {/* Comparison Curve Toggle */}
          <button
            type="button"
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors border shadow-2xs cursor-pointer ${
              compareMode
                ? 'bg-blue-50 border-blue-200 text-[#2a5bd7] dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {compareMode ? (
              <ToggleRight className="h-4 w-4 text-[#2a5bd7] dark:text-blue-400" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-slate-400" />
            )}
            <span className="whitespace-nowrap">Compare prior period</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#273144] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              title="Reset all filters to default"
              className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Date Range Preset Pills & Custom Picker */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mr-1 shrink-0">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Timeframe:</span>
          </div>

          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 shrink-0">
            {PRESETS.map((p) => {
              const isActive = datePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDatePreset(p.id)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-all cursor-pointer select-none whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#273144] shadow-2xs dark:bg-slate-900 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Custom Date Button */}
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors shadow-2xs cursor-pointer shrink-0 whitespace-nowrap ${
              datePreset === 'custom'
                ? 'border-[#2a5bd7] bg-blue-50 text-[#2a5bd7] dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {datePreset === 'custom' && customFrom
              ? `${customFrom} to ${customTo || 'Now'}`
              : 'Custom Range'}
          </button>
        </div>

        {/* Active Scope Pill Indicator */}
        <div className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <span>Filtering:</span>
          <span className="font-semibold text-[#273144] dark:text-slate-200">
            {selectedLinkObj
              ? `Link: trim.ly/${selectedLinkObj.shortCode}`
              : selectedCampaignObj
              ? `Campaign: ${selectedCampaignObj.name}`
              : 'All Workspace Links'}
          </span>
        </div>
      </div>

      {/* Custom Date Modal */}
      <Modal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        title="Custom Date Range"
        description="Select specific start and end dates to filter your analytics."
        className="max-w-md"
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                From Date
              </label>
              <input
                type="date"
                value={tempFrom}
                onChange={(e) => setTempFrom(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                To Date
              </label>
              <input
                type="date"
                value={tempTo}
                onChange={(e) => setTempTo(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApplyCustom}>
              Apply Range
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
