'use client';

import React, { useState, useMemo } from 'react';
import { QrCodesHeader } from './QrCodesHeader';
import { QrCodesSearchBar } from './QrCodesSearchBar';
import { QrCodesSelectionBar } from './QrCodesSelectionBar';
import { QrCodeCard, QrCodeItem } from './QrCodeCard';
import { QrCodesPageFooter } from './QrCodesPageFooter';
import { FilterModal, FilterState } from '@/components/links/FilterModal';
import { DateFilterModal } from '@/components/links/DateFilterModal';
import { TableSkeleton } from '@/components/shared/LoadingSkeleton';
import { useUserQrCodes, useDeleteQrCode } from '@/hooks/useQRCodes';
import { useLinks } from '@/hooks/useLinks';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { toast } from 'sonner';
import { QrCode as QrCodeIcon, Plus } from 'lucide-react';
import Link from 'next/link';

export const QrCodesList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'Active' | 'Hidden' | 'Customized' | 'All'>('Active');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<{
    startDate: Date | null;
    endDate: Date | null;
    label?: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

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
    return count;
  }, [filterState]);

  // Real API data
  const { data: qrCodesRaw = [], isLoading: qrLoading, isError: qrError, refetch: refetchQr } = useUserQrCodes();
  const { links, isLoading: linksLoading } = useLinks();
  const deleteQrCodeMutation = useDeleteQrCode();

  const isLoading = qrLoading && linksLoading;

  // Merge QR codes with their associated link data
  const qrCodes: QrCodeItem[] = useMemo(() => {
    const result: QrCodeItem[] = [];

    if (Array.isArray(qrCodesRaw)) {
      for (const qr of qrCodesRaw) {
        const matchingLink = links.find((l) => l.shortCode === qr.shortCode);
        const hasVisibleLink = qr.visibleAsLink !== undefined ? Boolean(qr.visibleAsLink) : Boolean(matchingLink && matchingLink.visibleAsLink !== false);
        result.push({
          id: qr.id || qr._id || qr.shortCode,
          linkId: matchingLink?._id || qr.id || qr._id || qr.shortCode,
          title: qr.title || matchingLink?.title || `Untitled ${new Date(qr.createdAt || Date.now()).toISOString().slice(0, 10)}`,
          destinationUrl: qr.destinationUrl || qr.longUrl || matchingLink?.longUrl || `https://trim.ly/${qr.shortCode}`,
          shortCode: qr.shortCode,
          createdAt: qr.createdAt || matchingLink?.createdAt || new Date().toISOString(),
          scansCount: matchingLink?.clickCount ?? 0,
          tags: qr.tags && qr.tags.length > 0 ? qr.tags : matchingLink?.tags || [],
          typeBadge: hasVisibleLink ? 'Website' : 'QR Code',
          visibleAsLink: hasVisibleLink,
          isHidden: Boolean(qr.isHidden),
          expiresAt: qr.expiresAt || matchingLink?.expiresAt || null,
          shortUrl: qr.shortUrl || matchingLink?.shortUrl || `http://localhost:4000/${qr.shortCode}`,
          svg: qr.svg || null,
          svgUrl: qr.svgUrl || null,
          qrConfig: qr.qrConfig,
        });
      }
    }

    return result;
  }, [qrCodesRaw, links]);

  const handleDelete = (id: string) => {
    const qr = qrCodes.find((q) => q.id === id);
    if (qr) {
      setDeleteTarget(qr.shortCode);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteQrCodeMutation.mutateAsync(deleteTarget);
      setDeleteTarget(null);
    } catch {
      // Handled in mutation
    }
  };

  const filteredQrCodes = useMemo(() => {
    return qrCodes.filter((item) => {
      // 1. Status filtering (Active / Hidden / Customized / All)
      const normalizedStatus = statusFilter.toLowerCase();
      if (normalizedStatus === 'active' && item.isHidden) return false;
      if (normalizedStatus === 'hidden' && !item.isHidden) return false;
      if (normalizedStatus === 'customized') {
        if (item.isHidden) return false;
        const cfg = item.qrConfig;
        const isCustom = cfg && (
          (cfg.dotsStyle && cfg.dotsStyle !== 'square') ||
          (cfg.cornersStyle && cfg.cornersStyle !== 'square') ||
          (cfg.dotsColor && cfg.dotsColor.toLowerCase() !== '#000000') ||
          (cfg.backgroundColor && cfg.backgroundColor.toLowerCase() !== '#ffffff') ||
          Boolean(cfg.logoUrl)
        );
        if (!isCustom) return false;
      }

      // 2. Active Tags Filter
      const targetTags = filterState.tags.length > 0 ? filterState.tags : activeTags;
      if (targetTags.length > 0) {
        const itemTags = item.tags || [];
        const matchesAllTags = targetTags.every((t) => itemTags.includes(t));
        if (!matchesAllTags) return false;
      }

      // 3. Expiration Filter
      if (filterState.expiration === 'expired' && (!item.expiresAt || new Date(item.expiresAt) > new Date())) return false;
      if (filterState.expiration === 'expiring' && (!item.expiresAt || new Date(item.expiresAt) <= new Date())) return false;
      if (filterState.expiration === 'no_expiration' && item.expiresAt) return false;

      // 4. Search filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title ? item.title.toLowerCase().includes(q) : false;
        const matchesUrl = item.destinationUrl ? item.destinationUrl.toLowerCase().includes(q) : false;
        const matchesCode = item.shortCode ? item.shortCode.toLowerCase().includes(q) : false;
        const matchesTags = (item.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesUrl && !matchesCode && !matchesTags) return false;
      }

      // 5. Date filtering
      if (dateFilter?.startDate && dateFilter?.endDate && item.createdAt) {
        const itemTime = new Date(item.createdAt).getTime();
        const startTime = dateFilter.startDate.getTime();
        const endTime = dateFilter.endDate.getTime();
        if (itemTime < startTime || itemTime > endTime) return false;
      }

      return true;
    });
  }, [qrCodes, searchQuery, statusFilter, activeTags, filterState, dateFilter]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredQrCodes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQrCodes.map((q) => q.id));
    }
  };

  const selectedLinkIds = useMemo(() => {
    return selectedIds
      .map(id => {
        const qr = qrCodes.find(q => q.id === id);
        return qr?.linkId || qr?.id;
      })
      .filter(Boolean) as string[];
  }, [selectedIds, qrCodes]);

  const selectedLinkTags = useMemo(() => {
    return selectedIds.map(id => {
      const qr = qrCodes.find(q => q.id === id);
      return qr?.tags || [];
    });
  }, [selectedIds, qrCodes]);

  const handleExportSelected = () => {
    if (selectedIds.length === 0) return;
    toast.success(`Exporting ${selectedIds.length} QR code${selectedIds.length === 1 ? '' : 's'}...`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header Component */}
      <QrCodesHeader />

      {/* 2. Search & Filter Bar Component */}
      <QrCodesSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenDateModal={() => setIsDateModalOpen(true)}
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        dateFilterLabel={dateFilter?.label}
        appliedFiltersCount={appliedFiltersCount}
        totalResults={filteredQrCodes.length}
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

      {/* 3. Export & Selection Bar Component */}
      <QrCodesSelectionBar
        selectedLinkIds={selectedLinkIds}
        selectedLinkTags={selectedLinkTags}
        selectedCount={selectedIds.length}
        totalCount={filteredQrCodes.length}
        onSelectAll={handleSelectAll}
        onClearSelection={() => setSelectedIds([])}
        statusFilter={statusFilter}
        onStatusFilterChange={(newStatus) => {
          setStatusFilter(newStatus);
          setSelectedIds([]);
        }}
        onExportClick={handleExportSelected}
      />

      {/* 4. QR Code Cards List Container */}
      {isLoading ? (
        <TableSkeleton rows={3} />
      ) : qrError && qrCodes.length === 0 ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          <p className="font-semibold text-sm">Failed to load QR codes</p>
          <button
            type="button"
            onClick={() => refetchQr()}
            className="mt-3 px-4 py-2 rounded-md bg-white border border-red-300 text-sm font-bold shadow-2xs cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : filteredQrCodes.length > 0 ? (
        <div className="space-y-4">
          {filteredQrCodes.map((item) => (
            <QrCodeCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              isSelected={selectedIds.includes(item.id)}
              onToggleSelect={(id) => {
                setSelectedIds(prev =>
                  prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                );
              }}
            />
          ))}
        </div>
      ) : qrCodes.length === 0 && !searchQuery.trim() ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 mb-4">
            <QrCodeIcon className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No QR codes created yet</h3>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
            Create your first QR code to share links visually, track scans, and customize the design to match your brand.
          </p>
          <Link
            href="/qrcodes/create"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-[#2a5bd7] text-white font-bold text-sm hover:bg-[#1a4bb7] transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create your first QR code</span>
          </Link>
        </div>
      ) : (
        <div className="text-center py-16 border border-slate-200 rounded-xl bg-white dark:bg-slate-900 dark:border-slate-800 text-sm text-slate-500">
          {statusFilter === 'Hidden'
            ? 'No hidden QR codes'
            : statusFilter === 'Customized'
            ? 'No customized QR codes found'
            : searchQuery.trim()
            ? `No QR codes found matching "${searchQuery}"`
            : 'No QR codes match the selected filters'}
        </div>
      )}

      {/* 5. Page Footer Component */}
      <QrCodesPageFooter />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete QR Code?"
        description={`Are you sure you want to delete the QR code for /${deleteTarget}? This action cannot be undone.`}
        confirmText="Delete QR Code"
        isLoading={deleteQrCodeMutation.isPending}
      />

      {/* Filter Modals */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={filterState}
        onApply={(filters) => {
          setFilterState(filters);
          if (filters.tags) {
            setActiveTags(filters.tags);
          }
          toast.success('Filters applied successfully!');
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
};
