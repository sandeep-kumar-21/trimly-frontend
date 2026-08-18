'use client';

import React, { useState, useMemo } from 'react';
import { useLinks } from '@/hooks/useLinks';
import { TableSkeleton } from '@/components/shared/LoadingSkeleton';
import { useUIStore } from '@/store/uiStore';
import { LinkCard } from '@/components/links/LinkCard';
import { FilterModal, FilterState } from '@/components/links/FilterModal';
import { DateFilterModal } from '@/components/links/DateFilterModal';
import { LinksHeader } from '@/components/links/LinksHeader';
import { LinksSearchBar } from '@/components/links/LinksSearchBar';
import { LinkSelectionBar } from '@/components/links/LinkSelectionBar';
import { LinksPagePromoBanner } from '@/components/links/LinksPagePromoBanner';
import { LinksPageFooter } from '@/components/links/LinksPageFooter';
import { EmptyLinksState } from '@/components/links/EmptyLinksState';

export default function LinksPage() {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const { links, isLoading, isError, refetch } = useLinks(activeTags);
  const openCreateModal = useUIStore((state) => state.openCreateModal);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'compact' | 'default' | 'grid'>('default');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'active' | 'hidden' | 'all'>('active');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<{
    startDate: Date | null;
    endDate: Date | null;
    label?: string;
  } | null>(null);

  const [filterState, setFilterState] = useState<FilterState>({
    tags: [],
    linkType: 'all',
    expiration: null,
    qrCodeOption: 'all',
  });

  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    if (filterState.tags.length > 0) count += filterState.tags.length;
    if (filterState.linkType !== 'all') count += 1;
    if (filterState.expiration !== null) count += 1;
    if (filterState.qrCodeOption !== 'all') count += 1;
    return count;
  }, [filterState]);

  const removeTag = (tagToRemove: string) => {
    const updated = activeTags.filter(tag => tag !== tagToRemove);
    setActiveTags(updated);
    setFilterState(prev => ({ ...prev, tags: updated }));
  };

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      // 1. Status Filter (Active / Hidden / All)
      if (statusFilter === 'active' && link.isHidden) return false;
      if (statusFilter === 'hidden' && !link.isHidden) return false;

      // 2. Active Tags Filter
      const targetTags = filterState.tags.length > 0 ? filterState.tags : activeTags;
      if (targetTags.length > 0) {
        const linkTags = link.tags || [];
        const matchesAllTags = targetTags.every((t) => linkTags.includes(t));
        if (!matchesAllTags) return false;
      }

      // 3. Link Type Filter
      if (filterState.linkType === 'custom' && !link.customBackHalf) return false;
      if (filterState.linkType === 'no-custom' && link.customBackHalf) return false;

      // 4. Expiration Filter
      if (filterState.expiration === 'expired' && (!link.expiresAt || new Date(link.expiresAt) > new Date())) return false;
      if (filterState.expiration === 'expiring' && (!link.expiresAt || new Date(link.expiresAt) <= new Date())) return false;
      if (filterState.expiration === 'no_expiration' && link.expiresAt) return false;

      // 5. Attached QR Code Filter
      if (filterState.qrCodeOption === 'with_qr' && !link.qrCodeId) return false;
      if (filterState.qrCodeOption === 'without_qr' && link.qrCodeId) return false;

      // 6. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesCode = link.shortCode.toLowerCase().includes(q);
        const matchesUrl = link.longUrl.toLowerCase().includes(q);
        const matchesTitle = link.title ? link.title.toLowerCase().includes(q) : false;
        const matchesTags = (link.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchesCode && !matchesUrl && !matchesTitle && !matchesTags) return false;
      }

      // 7. Date Range Filter
      if (dateFilter?.startDate && dateFilter?.endDate && link.createdAt) {
        const linkTime = new Date(link.createdAt).getTime();
        const startTime = dateFilter.startDate.getTime();
        const endTime = dateFilter.endDate.getTime();
        if (linkTime < startTime || linkTime > endTime) return false;
      }

      return true;
    });
  }, [links, searchQuery, statusFilter, activeTags, dateFilter, filterState]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredLinks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLinks.map((l) => l._id || l.shortCode));
    }
  };

  const selectedLinkTags = useMemo(() => {
    return selectedIds.map(id => {
      const link = links.find(l => l._id === id || l.shortCode === id);
      return link?.tags || [];
    });
  }, [selectedIds, links]);

  return (
    <div className="space-y-6">
      {/* 1. Header Component */}
      <LinksHeader />

      {/* 2. Search & Filter Bar Component */}
      <LinksSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenDateModal={() => setIsDateModalOpen(true)}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        dateFilterLabel={dateFilter?.label}
        appliedFiltersCount={appliedFiltersCount}
        totalResults={filteredLinks.length}
        onClearAll={() => {
          setDateFilter(null);
          setActiveTags([]);
          setFilterState({
            tags: [],
            linkType: 'all',
            expiration: null,
            qrCodeOption: 'all',
          });
        }}
      />

      {/* Divider */}
      <hr className="border-slate-200/80 dark:border-slate-800" />

      {/* 3. Selection Actions Bar */}
      <LinkSelectionBar
        selectedLinkIds={selectedIds}
        selectedLinkTags={selectedLinkTags}
        totalCount={filteredLinks.length}
        onSelectAll={handleSelectAll}
        onClearSelection={() => setSelectedIds([])}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statusFilter={statusFilter}
        onStatusFilterChange={(newStatus) => {
          setStatusFilter(newStatus);
          setSelectedIds([]);
        }}
      />

      {/* 4. Main Link List or Skeletons or Empty States */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
          <p className="font-semibold">Failed to load links.</p>
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredLinks.length === 0 ? (
        <EmptyLinksState />
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
          {filteredLinks.map((link) => (
            <LinkCard
              key={link._id || link.shortCode}
              link={link}
              isSelected={selectedIds.includes(link._id || link.shortCode)}
              onToggleSelect={() => handleToggleSelect(link._id || link.shortCode)}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Promo Banner & Footer */}
      <LinksPagePromoBanner />
      <LinksPageFooter />

      {/* Modals */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={filterState}
        onApply={(filters) => {
          setFilterState(filters);
          if (filters.tags) {
            setActiveTags(filters.tags);
          }
        }}
      />
      <DateFilterModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        initialStartDate={dateFilter?.startDate}
        initialEndDate={dateFilter?.endDate}
        onApply={(startDate, endDate, label) => {
          if (startDate && endDate) {
            setDateFilter({ startDate, endDate, label });
          } else {
            setDateFilter(null);
          }
        }}
      />
    </div>
  );
}
