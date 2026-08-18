'use client';

import React, { useState, useMemo } from 'react';
import { ShortLink } from '@/types/link.types';
import { LinkRow } from './LinkRow';
import { LinkSearchInput } from './LinkSearchInput';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyLinksState } from './EmptyLinksState';

export interface LinkTableProps {
  links: ShortLink[];
  pageSize?: number;
}

export const LinkTable: React.FC<LinkTableProps> = ({ links, pageSize = 8 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return links;
    const q = searchQuery.toLowerCase().trim();
    return links.filter(
      (link) =>
        link.shortCode.toLowerCase().includes(q) ||
        link.longUrl.toLowerCase().includes(q) ||
        (link.title && link.title.toLowerCase().includes(q))
    );
  }, [links, searchQuery]);

  const totalPages = Math.ceil(filteredLinks.length / pageSize) || 1;

  const paginatedLinks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLinks.slice(start, start + pageSize);
  }, [filteredLinks, currentPage, pageSize]);

  if (links.length === 0) {
    return <EmptyLinksState />;
  }

  return (
    <div className="space-y-4">
      {/* Table Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <LinkSearchInput
          value={searchQuery}
          onChange={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
        />
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Total: <span className="font-bold text-slate-800 dark:text-slate-200">{filteredLinks.length}</span> links
        </div>
      </div>

      {/* Links List */}
      {paginatedLinks.length > 0 ? (
        <div className="space-y-3">
          {paginatedLinks.map((link) => (
            <LinkRow key={link._id || link.shortCode} link={link} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-slate-200 rounded-xl bg-white dark:bg-slate-900 dark:border-slate-800 text-sm text-slate-500">
          No links found matching "{searchQuery}"
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
        totalItems={filteredLinks.length}
        pageSize={pageSize}
      />
    </div>
  );
};
