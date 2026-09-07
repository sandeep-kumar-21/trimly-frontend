'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { useBulkLinks } from '@/hooks/useBulkLinks';
import { TriStateTagPicker } from '../links/TriStateTagPicker';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Checkbox } from '@/components/ui/Checkbox';
import { createPortal } from 'react-dom';

export interface QrCodesSelectionBarProps {
  selectedLinkIds?: string[];
  selectedLinkTags?: string[][];
  selectedCount?: number;
  totalCount?: number;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  statusFilter?: 'Active' | 'Hidden' | 'Customized' | 'All' | 'active' | 'hidden' | 'customized' | 'all';
  onStatusFilterChange?: (status: 'Active' | 'Hidden' | 'Customized' | 'All') => void;
  onExportClick?: () => void;
}

export const QrCodesSelectionBar: React.FC<QrCodesSelectionBarProps> = ({
  selectedLinkIds = [],
  selectedLinkTags = [],
  selectedCount = 0,
  totalCount = 0,
  onSelectAll = () => {},
  onClearSelection = () => {},
  statusFilter = 'Active',
  onStatusFilterChange = () => {},
  onExportClick,
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

  const hasSelection = selectedCount > 0;
  const validSelectedLinkIds = selectedLinkIds.filter(Boolean);

  const normalizedStatus = statusFilter.toLowerCase();
  const isHiddenSelected = normalizedStatus === 'hidden';

  const handleBulkToggleHide = async () => {
    if (validSelectedLinkIds.length > 0) {
      await bulkHideLinks({ linkIds: validSelectedLinkIds, isHidden: !isHiddenSelected });
    }
    setIsHideModalOpen(false);
    onClearSelection();
  };

  const handleAddTag = async (tag: string) => {
    if (validSelectedLinkIds.length > 0) {
      await bulkUpdateTags({ linkIds: validSelectedLinkIds, addTags: [tag] });
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (validSelectedLinkIds.length > 0) {
      await bulkUpdateTags({ linkIds: validSelectedLinkIds, removeTags: [tag] });
    }
  };

  const displayStatus: 'Active' | 'Hidden' | 'Customized' | 'All' =
    normalizedStatus === 'active'
      ? 'Active'
      : normalizedStatus === 'hidden'
      ? 'Hidden'
      : normalizedStatus === 'customized'
      ? 'Customized'
      : 'All';

  return (
    <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
      {/* Left Selection Tools (Select All, Export, Hide/Unhide, Tag) */}
      <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium pl-0 sm:pl-4 min-w-0">
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

        <button
          type="button"
          onClick={onExportClick}
          disabled={!hasSelection}
          className={`text-xs sm:text-sm font-medium transition-colors shrink-0 ${
            hasSelection ? 'text-[#273144] hover:text-[#2a5bd7] dark:text-slate-200 cursor-pointer' : 'text-[#94a3b8] opacity-80 cursor-not-allowed'
          }`}
        >
          Export
        </button>

        {normalizedStatus !== 'all' && (
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
                {isHiddenSelected ? `Unhide ${selectedCount} QR code${selectedCount === 1 ? '' : 's'}` : `Hide ${selectedCount} QR code${selectedCount === 1 ? '' : 's'}`}
              </h2>
              <button type="button" onClick={() => setIsHideModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {isHiddenSelected
                ? 'Are you sure you want to unhide the selected QR codes? They will be restored to your active QR codes view.'
                : 'Are you sure you want to hide the selected QR codes? This action can be undone any time.'}
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
                {isHiddenSelected ? `Unhide QR code${selectedCount === 1 ? '' : 's'}` : `Hide QR code${selectedCount === 1 ? '' : 's'}`}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Right Status Dropdown ONLY */}
      <div className="flex items-center justify-end gap-2 sm:gap-5 shrink-0">
        <div className="w-auto min-w-[110px] sm:w-44 shrink-0">
          <CustomSelect<'Active' | 'Hidden' | 'Customized' | 'All'>
            size="sm"
            triggerPrefix="Show: "
            triggerClassName="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm font-semibold"
            options={['Active', 'Hidden', 'Customized', 'All']}
            value={displayStatus}
            onChange={(val) => onStatusFilterChange(val)}
            align="right"
          />
        </div>
      </div>
    </div>
  );
};
