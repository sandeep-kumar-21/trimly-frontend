'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Check, Search } from 'lucide-react';
import { useTags } from '@/hooks/useTags';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-xl font-bold text-[#273144] dark:text-slate-100">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 cursor-pointer"
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
                className="flex min-h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-[#273144] shadow-2xs focus:border-[#2a5bd7] cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
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
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isTagsOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {isTagsOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-full rounded-xl bg-white p-2.5 shadow-xl border border-slate-200 z-40 dark:bg-slate-900 dark:border-slate-800">
                  <div className="relative mb-2">
                    <input
                      type="text"
                      placeholder="Search tags..."
                      value={tagSearchTerm}
                      onChange={(e) => setTagSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md bg-transparent text-[#273144] focus:outline-none focus:border-[#2a5bd7] dark:border-slate-700 dark:text-slate-200"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  </div>
                  
                  <ul className="max-h-48 overflow-y-auto space-y-1 pr-1">
                    {tagsLoading ? (
                      <li className="px-2 py-2 text-sm text-slate-500">Loading tags...</li>
                    ) : filteredTags.length > 0 ? (
                      filteredTags.map((tag) => (
                        <li key={tag}>
                          <label className="flex items-center gap-3 px-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedTags.includes(tag)}
                              onChange={() => toggleTag(tag)}
                              className="h-4 w-4 rounded-sm border-slate-300 text-[#2a5bd7] focus:ring-[#2a5bd7] cursor-pointer"
                            />
                            <span className="text-sm text-[#273144] dark:text-slate-200">{tag}</span>
                          </label>
                        </li>
                      ))
                    ) : (
                      <li className="px-2 py-2 text-sm text-slate-500">No tags found.</li>
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
              className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-medium text-[#273144] shadow-2xs focus:border-[#2a5bd7] cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <span>
                {linkType === 'all'
                  ? 'All links'
                  : linkType === 'custom'
                    ? 'Links with custom back-halves'
                    : 'Links without custom back-halves'}
              </span>
              <div className="flex items-center gap-2 border-l border-slate-200 pl-2.5 dark:border-slate-700">
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </div>
            </button>

            {isLinkTypeOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-full rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 z-30 dark:bg-slate-900 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setLinkType('all');
                    setIsLinkTypeOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[#273144] hover:bg-slate-50 rounded-lg dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span>All links</span>
                  {linkType === 'all' && <Check className="h-4 w-4 text-[#2a5bd7]" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLinkType('custom');
                    setIsLinkTypeOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[#273144] hover:bg-slate-50 rounded-lg dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span>Links with custom back-halves</span>
                  {linkType === 'custom' && <Check className="h-4 w-4 text-[#2a5bd7]" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLinkType('no-custom');
                    setIsLinkTypeOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[#273144] hover:bg-slate-50 rounded-lg dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span>Links without custom back-halves</span>
                  {linkType === 'no-custom' && <Check className="h-4 w-4 text-[#2a5bd7]" />}
                </button>
              </div>
            )}
          </div>

          {/* 3. Link expiration */}
          <div className="space-y-2">
            <span className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Link expiration
            </span>
            <div className="flex items-center gap-6 pt-0.5">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-[#273144] dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="link-expiration"
                  checked={expiration === 'expired'}
                  onChange={() => setExpiration('expired')}
                  className="h-4 w-4 text-[#2a5bd7] focus:ring-[#2a5bd7] cursor-pointer"
                />
                Expired
              </label>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-[#273144] dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="link-expiration"
                  checked={expiration === 'expiring'}
                  onChange={() => setExpiration('expiring')}
                  className="h-4 w-4 text-[#2a5bd7] focus:ring-[#2a5bd7] cursor-pointer"
                />
                Expiring
              </label>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-[#273144] dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="link-expiration"
                  checked={expiration === 'no_expiration'}
                  onChange={() => setExpiration('no_expiration')}
                  className="h-4 w-4 text-[#2a5bd7] focus:ring-[#2a5bd7] cursor-pointer"
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
              className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-medium text-[#273144] shadow-2xs focus:border-[#2a5bd7] cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
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
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </div>
            </button>

            {isQrOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-full rounded-xl bg-white p-1.5 shadow-xl border border-slate-200 z-30 dark:bg-slate-900 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setQrCodeOption('all');
                    setIsQrOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[#273144] hover:bg-slate-50 rounded-lg dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span>
                    Links <strong>with or without</strong> attached QR Codes
                  </span>
                  {qrCodeOption === 'all' && <Check className="h-4 w-4 text-[#2a5bd7]" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQrCodeOption('with_qr');
                    setIsQrOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[#273144] hover:bg-slate-50 rounded-lg dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span>
                    Links <strong>with</strong> attached QR Codes only
                  </span>
                  {qrCodeOption === 'with_qr' && <Check className="h-4 w-4 text-[#2a5bd7]" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQrCodeOption('without_qr');
                    setIsQrOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-[#273144] hover:bg-slate-50 rounded-lg dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span>
                    Links <strong>without</strong> attached QR Codes only
                  </span>
                  {qrCodeOption === 'without_qr' && <Check className="h-4 w-4 text-[#2a5bd7]" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons (Bitly Exact Parity) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#273144] hover:text-[#2a5bd7] cursor-pointer dark:text-slate-300 dark:hover:text-blue-400"
          >
            <X className="h-4 w-4 text-slate-500" />
            Clear all filters
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-[#273144] hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="h-10 px-6 rounded-lg bg-[#2a5bd7] text-white text-sm font-bold hover:bg-[#1a4bb7] transition-colors shadow-2xs cursor-pointer"
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
