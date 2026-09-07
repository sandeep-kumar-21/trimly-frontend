'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { analyticsApi } from '@/lib/api/analytics.api';
import { LiveClickEvent } from '@/types/analytics.types';
import { formatNumber } from '@/lib/utils/formatNumber';
import { formatDate } from '@/lib/utils/formatDate';
import { QrCodeIcon, LinkIcon } from '@/components/icons/AppIcons';
import {
  Search,
  Download,
  Filter,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface DetailedClickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialShortCode?: string;
}

export const DetailedClickLogModal: React.FC<DetailedClickLogModalProps> = ({
  isOpen,
  onClose,
  initialShortCode,
}) => {
  const [logs, setLogs] = useState<LiveClickEvent[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(initialShortCode || '');
  const [deviceFilter, setDeviceFilter] = useState<string>('');
  const [qrFilter, setQrFilter] = useState<string>('');

  const fetchLogs = useCallback(
    async (targetPage: number = 1) => {
      if (!isOpen) return;
      setIsLoading(true);
      try {
        const res = await analyticsApi.getClickLogs({
          page: targetPage,
          limit: 15,
          search: search.trim() || undefined,
          deviceType: deviceFilter || undefined,
          isQrScan: qrFilter !== '' ? qrFilter : undefined,
        });
        setLogs(res.data || []);
        setTotal(res.total || 0);
        setPage(res.page || 1);
        setTotalPages(res.totalPages || 1);
      } catch {
        toast.error('Failed to load click logs');
      } finally {
        setIsLoading(false);
      }
    },
    [isOpen, search, deviceFilter, qrFilter]
  );

  useEffect(() => {
    if (isOpen) {
      fetchLogs(1);
    }
  }, [isOpen, fetchLogs]);

  const handleExportCsv = () => {
    if (logs.length === 0) {
      toast.warning('No click logs to export');
      return;
    }

    const headers = [
      'Timestamp',
      'Short Code',
      'Type',
      'Country',
      'City',
      'Device',
      'OS',
      'Browser',
      'Referrer',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
    ];

    const csvRows = [headers.join(',')];

    logs.forEach((log) => {
      const row = [
        `"${new Date(log.timestamp).toISOString()}"`,
        `"${log.shortCode || ''}"`,
        `"${log.isQrScan ? 'QR Scan' : 'Web Click'}"`,
        `"${log.country || 'Unknown'}"`,
        `"${log.city || ''}"`,
        `"${log.deviceType || 'Desktop'}"`,
        `"${log.os || ''}"`,
        `"${log.browser || ''}"`,
        `"${(log.referrer || '').replace(/"/g, '""')}"`,
        `"${log.utmSource || ''}"`,
        `"${log.utmMedium || ''}"`,
        `"${log.utmCampaign || ''}"`,
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trimly_click_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Click audit log exported to CSV');
  };

  const getDeviceIcon = (deviceType: string | null) => {
    const lower = (deviceType || '').toLowerCase();
    if (lower.includes('mobile') || lower.includes('phone'))
      return <Smartphone className="h-3.5 w-3.5 text-slate-500" />;
    if (lower.includes('tablet'))
      return <Tablet className="h-3.5 w-3.5 text-slate-500" />;
    return <Monitor className="h-3.5 w-3.5 text-slate-500" />;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detailed Click Audit Log"
      description="Inspect high-volume telemetry events, filter by channel & geography, and export raw logs to CSV."
      className="max-w-5xl"
    >
      <div className="space-y-4">
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 w-full sm:max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchLogs(1);
                  }
                }}
                placeholder="Search code, country, referrer, OS..."
                className="w-full h-9 pl-8 pr-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            </div>
            <Button size="sm" variant="secondary" onClick={() => fetchLogs(1)} className="shrink-0">
              Search
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
            {/* Filter: QR vs Web */}
            <select
              value={qrFilter}
              onChange={(e) => {
                setQrFilter(e.target.value);
              }}
              className="h-9 px-2.5 rounded-md border border-slate-300 bg-white text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden cursor-pointer"
            >
              <option value="">All Click Types</option>
              <option value="false">Web Clicks Only</option>
              <option value="true">QR Scans Only</option>
            </select>

            {/* Filter: Device */}
            <select
              value={deviceFilter}
              onChange={(e) => {
                setDeviceFilter(e.target.value);
              }}
              className="h-9 px-2.5 rounded-md border border-slate-300 bg-white text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden cursor-pointer"
            >
              <option value="">All Devices</option>
              <option value="Desktop">Desktop</option>
              <option value="Mobile">Mobile</option>
              <option value="Tablet">Tablet</option>
            </select>

            {/* Export Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCsv}
              leftIcon={<Download className="h-3.5 w-3.5 text-slate-500" />}
              className="shrink-0"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 max-h-96">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center gap-2 text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-[#2a5bd7]" />
              <span>Loading telemetry logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-1.5 p-6 text-center text-xs text-slate-400">
              <Globe className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-1" />
              <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">
                No matching click events found
              </span>
              <span>Try adjusting your search terms or filter criteria.</span>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
              <thead className="sticky top-0 bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Link</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Device & OS</th>
                  <th className="px-4 py-3">Referrer / UTM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                {logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-2.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-2.5 font-bold text-[#2a5bd7] dark:text-blue-400 whitespace-nowrap">
                      trim.ly/{log.shortCode}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {log.isQrScan ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <QrCodeIcon className="h-3 w-3" />
                          <span>QR Scan</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          <LinkIcon className="h-3 w-3" />
                          <span>Web Click</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3 w-3 text-slate-400" />
                        <span>
                          {log.country && log.country !== 'Unknown' ? log.country : 'Unknown'}
                          {log.city ? ` (${log.city})` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {getDeviceIcon(log.deviceType)}
                        <span>
                          {log.deviceType || 'Desktop'}
                          {log.os ? ` • ${log.os}` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 truncate max-w-xs text-slate-500 text-[11px]">
                      {log.utmSource ? (
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          utm: {log.utmSource}
                        </span>
                      ) : log.referrer && log.referrer !== 'Direct / None' ? (
                        <span className="truncate">{log.referrer.replace(/^https?:\/\//, '')}</span>
                      ) : (
                        <span className="text-slate-400">Direct / None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer with Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing {logs.length} of {formatNumber(total)} total click events recorded
          </span>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || isLoading}
              onClick={() => fetchLogs(page - 1)}
              leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
            >
              Previous
            </Button>
            <span className="text-xs font-semibold px-2 text-slate-700 dark:text-slate-200">
              Page {page} of {Math.max(totalPages, 1)}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages || isLoading}
              onClick={() => fetchLogs(page + 1)}
              rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
