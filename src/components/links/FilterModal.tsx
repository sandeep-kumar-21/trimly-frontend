'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Check } from 'lucide-react';
import { useTags } from '@/hooks/useTags';
import { SearchInput } from '@/components/ui/SearchInput';
import { Checkbox } from '@/components/ui/Checkbox';
import { cn } from '@/lib/utils/cn';

export interface FilterState {
  tags: string[];
  linkType: 'all' | 'custom' | 'no-custom';
  expiration: 'expired' | 'expiring' | 'no_expiration' | null;
  qrCodeOption: 'all' | 'with_qr' | 'without_qr';
}

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters?: FilterState;
  onApply?: (filters: FilterState) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  initialFilters,
  onApply,
}) => {
  const [mounted, setMounted] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters?.tags || []);
  const [linkType, setLinkType] = useState<'all' | 'custom' | 'no-custom'>(initialFilters?.linkType || 'all');
  const [expiration, setExpiration] = useState<'expired' | 'expiring' | 'no_expiration' | null>(initialFilters?.expiration || null);
  const [qrCodeOption, setQrCodeOption] = useState<'all' | 'with_qr' | 'without_qr'>(initialFilters?.qrCodeOption || 'all');

  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [isLinkTypeOpen, setIsLinkTypeOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [tagSearchTerm, setTagSearchTerm] = useState('');

  const { tags: availableTags, isLoading: tagsLoading } = useTags();

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (initialFilters) {
        setSelectedTags(initialFilters.tags || []);
        setLinkType(initialFilters.linkType || 'all');
        setExpiration(initialFilters.expiration || null);
        setQrCodeOption(initialFilters.qrCodeOption || 'all');
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialFilters]);

  const filteredTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(tagSearchTerm.toLowerCase())
  );

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTags(selectedTags.filter(t => t !== tagToRemove));
  };

  if (!isOpen || !mounted) return null;

  const handleClearAll = () => {
    setSelectedTags([]);
    setLinkType('all');
    setExpiration(null);
    setQrCodeOption('all');
  };

  const handleApply = () => {
    if (onApply) {
      onApply({
        tags: selectedTags,
        linkType,
        expiration,
        qrCodeOption,
      });
    }
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto select-none">
      {/* Backdrop (No blur) */}
      <div
        className="fixed inset-0 bg-slate-900/60 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-4.5 sm:p-6 md:p-7 shadow-2xl border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 space-y-4 sm:space-y-6 animate-in zoom-in-95 duration-200 max-h-[calc(100vh-2rem)] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 dark:border-slate-800 gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#273144] dark:text-slate-100 truncate">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="space-y-5">
          {/* 1. Tags */}
          <div className="space-y-1.5">
            <label htmlFor="tags" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Tags
            </label>
            <div className="relative">
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  setIsTagsOpen(!isTagsOpen);
                  setIsLinkTypeOpen(false);
                  setIsQrOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setIsTagsOpen(!isTagsOpen);
                  }
                }}
                className={cn(
                  'flex min-h-11 w-full items-center justify-between rounded-lg border bg-white px-3 py-1.5 text-sm font-medium text-[#273144] shadow-2xs cursor-pointer transition-colors dark:bg-slate-800 dark:text-slate-100',
                  isTagsOpen
                    ? 'border-slate-400 dark:border-slate-500'
                    : 'border-slate-300 hover:border-slate-400 dark:border-slate-700'
                )}
              >
                <div className="flex flex-wrap items-center gap-1.5 max-w-[85%]">
                  {selectedTags.length > 0 ? (
                    selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded bg-[#f4f6f8] px-2 py-0.5 text-xs font-semibold text-[#273144] border border-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                      >
                        {tag}
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => removeTag(tag, e)}
                          className="hover:text-red-500 cursor-pointer text-slate-400 p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 font-normal">Select tags</span>
                  )}
                </div>
                <div className="flex items-center gap-2 border-l border-slate-200 pl-2 dark:border-slate-700">
                  <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform duration-200', isTagsOpen && 'rotate-180 text-slate-600 dark:text-slate-300')} />
                </div>
              </div>

              {isTagsOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-full rounded-md bg-white p-2 shadow-lg border border-slate-200/90 z-40 dark:bg-slate-900 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                  <div className="mb-2">
                    <SearchInput
                      size="sm"
                      placeholder="Search tags..."
                      value={tagSearchTerm}
                      onChange={setTagSearchTerm}
                      autoFocus
                    />
                  </div>
                  
                  <ul className="max-h-48 overflow-y-auto space-y-0.5 pr-1">
                    {tagsLoading ? (
                      <li className="px-3 py-1.5 text-sm text-slate-500">Loading tags...</li>
                    ) : filteredTags.length > 0 ? (
                      filteredTags.map((tag) => (
                        <li key={tag}>
                          <div
                            onClick={() => toggleTag(tag)}
                            className="flex items-center gap-2.5 px-3 py-1.5 sm:py-2 hover:bg-[#f4f6f8] dark:hover:bg-slate-800/80 rounded-md cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={selectedTags.includes(tag)}
                              readOnly
                              tabIndex={-1}
                            />
                            <span className="text-sm font-medium text-[#273144] dark:text-slate-100">{tag}</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-1.5 text-sm text-slate-500">No tags found.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* 2. Link type */}
          <div className="space-y-1.5 relative">
            <label htmlFor="link-type" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Link type
            </label>
            <button
              type="button"
              onClick={() => {
                setIsLinkTypeOpen(!isLinkTypeOpen);
                setIsTagsOpen(false);
                setIsQrOpen(false);
              }}
              className={cn(
                'flex h-11 w-full items-center justify-between rounded-lg border bg-white px-3.5 text-sm font-medium text-[#273144] shadow-2xs cursor-pointer transition-colors dark:bg-slate-800 dark:text-slate-100',
                isLinkTypeOpen
                  ? 'border-slate-400 dark:border-slate-500'
                  : 'border-slate-300 hover:border-slate-400 dark:border-slate-700'
              )}
            >
              <span>
                {linkType === 'all'
                  ? 'All links'
                  : linkType === 'custom'
                    ? 'Links with custom back-halves'
                    : 'Links without custom back-halves'}
              </span>
              <div className="flex items-center gap-2 border-l border-slate-200 pl-2.5 dark:border-slate-700">
                <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform duration-200', isLinkTypeOpen && 'rotate-180 text-slate-600 dark:text-slate-300')} />
              </div>
            </button>

            {isLinkTypeOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-full rounded-md bg-white py-1 shadow-lg border border-slate-200/90 z-30 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setLinkType('all');
                    setIsLinkTypeOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-left"
                >
                  <span>All links</span>
                  {linkType === 'all' && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLinkType('custom');
                    setIsLinkTypeOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-left"
                >
                  <span>Links with custom back-halves</span>
                  {linkType === 'custom' && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLinkType('no-custom');
                    setIsLinkTypeOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-left"
                >
                  <span>Links without custom back-halves</span>
                  {linkType === 'no-custom' && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                </button>
              </div>
            )}
          </div>

          {/* 3. Link expiration */}
          <div className="space-y-2">
            <span className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Link expiration
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-0.5">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-[#273144] dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="link-expiration"
                  checked={expiration === 'expired'}
                  onChange={() => setExpiration('expired')}
                  className="h-4 w-4 text-[#273144] focus:ring-[#273144] cursor-pointer"
                />
                Expired
              </label>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-[#273144] dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="link-expiration"
                  checked={expiration === 'expiring'}
                  onChange={() => setExpiration('expiring')}
                  className="h-4 w-4 text-[#273144] focus:ring-[#273144] cursor-pointer"
                />
                Expiring
              </label>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-[#273144] dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="link-expiration"
                  checked={expiration === 'no_expiration'}
                  onChange={() => setExpiration('no_expiration')}
                  className="h-4 w-4 text-[#273144] focus:ring-[#273144] cursor-pointer"
                />
                No expiration
              </label>
            </div>
          </div>

          {/* 4. Attached QR Code */}
          <div className="space-y-1.5 relative">
            <label htmlFor="has-qr-codes" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Attached QR Code
            </label>
            <button
              type="button"
              onClick={() => {
                setIsQrOpen(!isQrOpen);
                setIsTagsOpen(false);
                setIsLinkTypeOpen(false);
              }}
              className={cn(
                'flex h-11 w-full items-center justify-between rounded-lg border bg-white px-3.5 text-sm font-medium text-[#273144] shadow-2xs cursor-pointer transition-colors dark:bg-slate-800 dark:text-slate-100',
                isQrOpen
                  ? 'border-slate-400 dark:border-slate-500'
                  : 'border-slate-300 hover:border-slate-400 dark:border-slate-700'
              )}
            >
              <span>
                {qrCodeOption === 'all' ? (
                  <>
                    Links <strong>with or without</strong> attached QR Codes
                  </>
                ) : qrCodeOption === 'with_qr' ? (
                  <>
                    Links <strong>with</strong> attached QR Codes only
                  </>
                ) : (
                  <>
                    Links <strong>without</strong> attached QR Codes only
                  </>
                )}
              </span>
              <div className="flex items-center gap-2 border-l border-slate-200 pl-2.5 dark:border-slate-700">
                <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform duration-200', isQrOpen && 'rotate-180 text-slate-600 dark:text-slate-300')} />
              </div>
            </button>

            {isQrOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-full rounded-md bg-white py-1 shadow-lg border border-slate-200/90 z-30 dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setQrCodeOption('all');
                    setIsQrOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-left"
                >
                  <span>
                    Links <strong>with or without</strong> attached QR Codes
                  </span>
                  {qrCodeOption === 'all' && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQrCodeOption('with_qr');
                    setIsQrOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-left"
                >
                  <span>
                    Links <strong>with</strong> attached QR Codes only
                  </span>
                  {qrCodeOption === 'with_qr' && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQrCodeOption('without_qr');
                    setIsQrOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-2.5 px-3.5 py-1.5 sm:py-2 text-sm font-medium text-[#273144] hover:bg-[#f4f6f8] dark:text-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors text-left"
                >
                  <span>
                    Links <strong>without</strong> attached QR Codes only
                  </span>
                  {qrCodeOption === 'without_qr' && <Check className="h-4 w-4 text-[#273144] dark:text-slate-100 stroke-[2] shrink-0" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons (Bitly Exact Parity) */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center justify-center sm:justify-start gap-1.5 text-sm font-semibold text-[#273144] hover:text-[#2a5bd7] cursor-pointer dark:text-slate-300 dark:hover:text-blue-400 py-1"
          >
            <X className="h-4 w-4 text-slate-500" />
            Clear all filters
          </button>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 flex-1 sm:flex-initial rounded-md border border-slate-200 bg-white text-sm font-semibold text-[#273144] hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="h-10 px-6 flex-1 sm:flex-initial rounded-md bg-[#2a5bd7] text-white text-sm font-bold hover:bg-[#1a4bb7] transition-colors shadow-2xs cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
