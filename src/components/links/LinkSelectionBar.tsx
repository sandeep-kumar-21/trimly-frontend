'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { useBulkLinks } from '@/hooks/useBulkLinks';
import { TriStateTagPicker } from './TriStateTagPicker';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Checkbox } from '@/components/ui/Checkbox';
import { createPortal } from 'react-dom';

export interface LinkSelectionBarProps {
  selectedLinkIds: string[];
  selectedLinkTags: string[][];
  totalCount: number;
  onSelectAll: () => void;
  viewMode: 'compact' | 'default' | 'grid';
  onViewModeChange: (mode: 'compact' | 'default' | 'grid') => void;
  statusFilter: 'active' | 'hidden' | 'all';
  onStatusFilterChange: (status: 'active' | 'hidden' | 'all') => void;
  onClearSelection: () => void;
}

export const LinkSelectionBar: React.FC<LinkSelectionBarProps> = ({
  selectedLinkIds,
  selectedLinkTags,
  totalCount,
  onSelectAll,
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusFilterChange,
  onClearSelection,
}) => {
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);

  const { bulkUpdateTags, bulkHideLinks, isBulkUpdatingTags, isBulkHiding } = useBulkLinks();
  
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tagRef.current && !tagRef.current.contains(event.target as Node)) {
        setIsTagPopoverOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCount = selectedLinkIds.length;
  const hasSelection = selectedCount > 0;

  const isHiddenSelected = statusFilter === 'hidden';

  const handleBulkToggleHide = async () => {
    await bulkHideLinks({ linkIds: selectedLinkIds, isHidden: !isHiddenSelected });
    setIsHideModalOpen(false);
    onClearSelection();
  };

  const handleAddTag = async (tag: string) => {
    await bulkUpdateTags({ linkIds: selectedLinkIds, addTags: [tag] });
  };

  const handleRemoveTag = async (tag: string) => {
    await bulkUpdateTags({ linkIds: selectedLinkIds, removeTags: [tag] });
  };

  return (
    <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
      {/* Left Selection Tools (Select All, Export, Hide/Unhide, Tag) */}
      <div className="flex items-center gap-2.5 sm:gap-6 text-xs sm:text-sm font-medium pl-0 sm:pl-4 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={hasSelection ? onClearSelection : onSelectAll}
            className="flex items-center justify-center cursor-pointer transition-all select-none"
            title={hasSelection ? 'Deselect all' : 'Select all'}
          >
            {hasSelection && selectedCount < totalCount ? (
              <div className="flex h-4.5 w-4.5 items-center justify-center rounded-xs bg-[#2a5bd7] text-white shadow-2xs">
                <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                  <rect width="10" height="2" rx="1" fill="white" />
                </svg>
              </div>
            ) : hasSelection && selectedCount === totalCount ? (
              <div className="flex h-4.5 w-4.5 items-center justify-center rounded-xs bg-[#2a5bd7] text-white shadow-2xs">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4L3.5 6.5L9 1" />
                </svg>
              </div>
            ) : (
              <div className="h-4.5 w-4.5 rounded-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-[#2a5bd7] transition-colors" />
            )}
          </button>
          <span className="text-xs sm:text-sm font-normal text-[#273144] dark:text-slate-200 whitespace-nowrap">
            {selectedCount} selected
          </span>
        </div>

        {normalizedStatus(statusFilter) !== 'all' && (
          <button
            type="button"
            disabled={!hasSelection}
            onClick={() => setIsHideModalOpen(true)}
            className={`text-xs sm:text-sm font-medium transition-colors shrink-0 ${
              hasSelection ? 'text-[#273144] hover:text-[#2a5bd7] dark:text-slate-200 cursor-pointer' : 'text-[#94a3b8] opacity-80 cursor-not-allowed'
            }`}
          >
            {isHiddenSelected ? 'Unhide' : 'Hide'}
          </button>
        )}

        {!isHiddenSelected && (
          <div className="relative shrink-0" ref={tagRef}>
            <button
              type="button"
              disabled={!hasSelection}
              onClick={() => setIsTagPopoverOpen(!isTagPopoverOpen)}
              className={`text-xs sm:text-sm font-medium transition-colors ${
                hasSelection ? 'text-[#273144] hover:text-[#2a5bd7] dark:text-slate-200 cursor-pointer' : 'text-[#94a3b8] opacity-80 cursor-not-allowed'
              } ${isTagPopoverOpen ? 'text-[#2a5bd7]' : ''}`}
            >
              Tag
            </button>

            {isTagPopoverOpen && hasSelection && (
              <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-2 z-50 max-w-[calc(100vw-2rem)]">
                <TriStateTagPicker
                  selectedLinkTags={selectedLinkTags}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {isHideModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={() => setIsHideModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#273144] dark:text-slate-100">
                {isHiddenSelected ? `Unhide ${selectedCount} links` : `Hide ${selectedCount} links`}
              </h2>
              <button type="button" onClick={() => setIsHideModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {isHiddenSelected
                ? 'Are you sure you want to unhide the selected links? They will be restored to your active links view.'
                : 'Are you sure you want to hide the selected links? This action can be undone any time.'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsHideModalOpen(false)}
                className="px-4 py-2 rounded-md border border-slate-300 bg-white text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkToggleHide}
                disabled={isBulkHiding}
                className="px-4 py-2 rounded-md bg-[#2a5bd7] text-white text-sm font-bold hover:bg-[#1a4bb7] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isHiddenSelected ? 'Unhide links' : 'Hide links'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Right View Mode Controls & Link Status Dropdown */}
      <div className="flex items-center justify-end gap-2 sm:gap-5 shrink-0">
        {/* Exact Bitly Smooth Sliding View Mode Switcher (hidden on mobile) */}
        <div className="hidden sm:inline-flex relative items-center gap-1 p-0.5 select-none">
          {/* Sliding White Capsule Indicator */}
          <div
            className="absolute top-0 bottom-0 w-[42px] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-slate-200/80 transition-transform duration-300 ease-in-out pointer-events-none dark:bg-slate-900 dark:border-slate-800"
            style={{
              transform:
                viewMode === 'compact'
                  ? 'translateX(0px)'
                  : viewMode === 'default'
                  ? 'translateX(46px)'
                  : 'translateX(92px)',
            }}
          />

          {/* 1. Compact View Button */}
          <button
            type="button"
            onClick={() => onViewModeChange('compact')}
            className={`relative z-10 w-[42px] h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-300 ${
              viewMode === 'compact' ? 'text-[#273144] dark:text-white' : 'text-[#7c8ba7] hover:text-[#273144]'
            }`}
            title="Compact view"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="4" cy="5" r="1.5" fill="currentColor" />
              <rect x="8" y="4" width="9" height="2" rx="1" fill="currentColor" />
              <circle cx="4" cy="10" r="1.5" fill="currentColor" />
              <rect x="8" y="9" width="9" height="2" rx="1" fill="currentColor" />
              <circle cx="4" cy="15" r="1.5" fill="currentColor" />
              <rect x="8" y="14" width="9" height="2" rx="1" fill="currentColor" />
            </svg>
          </button>

          {/* 2. Default View Button */}
          <button
            type="button"
            onClick={() => onViewModeChange('default')}
            className={`relative z-10 w-[42px] h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-300 ${
              viewMode === 'default' ? 'text-[#273144] dark:text-white' : 'text-[#7c8ba7] hover:text-[#273144]'
            }`}
            title="Default view"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="14" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="3" y="12" width="14" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>

          {/* 3. Grid View Button */}
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`relative z-10 w-[42px] h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-300 ${
              viewMode === 'grid' ? 'text-[#273144] dark:text-white' : 'text-[#7c8ba7] hover:text-[#273144]'
            }`}
            title="Grid view"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        </div>

        {/* Interactive Status Select Dropdown */}
        <div className="w-auto min-w-[110px] sm:w-40 shrink-0">
          <CustomSelect<'active' | 'hidden' | 'all'>
            size="sm"
            triggerPrefix="Show: "
            triggerClassName="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm font-semibold"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'hidden', label: 'Hidden' },
              { value: 'all', label: 'All' },
            ]}
            value={statusFilter}
            onChange={onStatusFilterChange}
            align="right"
          />
        </div>
      </div>
    </div>
  );
};

function normalizedStatus(status: string): string {
  return (status || '').toLowerCase();
}
