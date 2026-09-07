'use client';

import React, { useState, useMemo } from 'react';
import { useLiveClicksStream } from '@/hooks/useLiveClicksStream';
import { LiveClickEvent } from '@/types/analytics.types';
import { QrCodeIcon, LinkIcon } from '@/components/icons/AppIcons';
import { DetailedClickLogModal } from './DetailedClickLogModal';
import {
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Play,
  Pause,
  Zap,
  Layers,
  ArrowUp,
  FileText,
  Clock,
} from 'lucide-react';

interface LiveActivityFeedProps {
  initialClicks?: LiveClickEvent[];
  shortCode?: string;
}

interface BurstGroup {
  shortCode: string;
  count: number;
  latestTimestamp: string;
  countries: string[];
  devices: { mobile: number; desktop: number; tablet: number };
  qrCount: number;
  webCount: number;
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
  initialClicks = [],
  shortCode,
}) => {
  const {
    clicks,
    rawClicks,
    isLivePolling,
    isStreaming,
    connectionStatus,
    velocity,
    unviewedCount,
    eventTypeFilter,
    setEventTypeFilter,
    isBurstMode,
    setIsBurstMode,
    togglePause,
    jumpToLatest,
  } = useLiveClicksStream({
    shortCode,
    initialClicks,
  });

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const getRelativeTime = (timestamp: string) => {
    const now = new Date().getTime();
    const past = new Date(timestamp).getTime();
    const diffSec = Math.max(Math.floor((now - past) / 1000), 0);

    if (diffSec < 10) return 'just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getDeviceIcon = (deviceType: string | null) => {
    const lower = (deviceType || '').toLowerCase();
    if (lower.includes('mobile') || lower.includes('phone'))
      return <Smartphone className="h-3 w-3 text-slate-500" />;
    if (lower.includes('tablet'))
      return <Tablet className="h-3 w-3 text-slate-500" />;
    return <Monitor className="h-3 w-3 text-slate-500" />;
  };

  // Group rapid clicks for Burst Mode
  const burstGroups = useMemo(() => {
    if (!isBurstMode) return [];

    const map = new Map<string, BurstGroup>();

    clicks.forEach((c) => {
      const key = c.shortCode;
      const existing = map.get(key);
      const isMobile = (c.deviceType || '').toLowerCase().includes('mobile');
      const isTablet = (c.deviceType || '').toLowerCase().includes('tablet');
      const isDesktop = !isMobile && !isTablet;

      if (!existing) {
        map.set(key, {
          shortCode: c.shortCode,
          count: 1,
          latestTimestamp: c.timestamp,
          countries: c.country && c.country !== 'Unknown' ? [c.country] : [],
          devices: {
            mobile: isMobile ? 1 : 0,
            tablet: isTablet ? 1 : 0,
            desktop: isDesktop ? 1 : 0,
          },
          qrCount: c.isQrScan ? 1 : 0,
          webCount: c.isQrScan ? 0 : 1,
        });
      } else {
        existing.count += 1;
        if (c.country && c.country !== 'Unknown' && !existing.countries.includes(c.country)) {
          existing.countries.push(c.country);
        }
        if (isMobile) existing.devices.mobile += 1;
        else if (isTablet) existing.devices.tablet += 1;
        else existing.devices.desktop += 1;

        if (c.isQrScan) existing.qrCount += 1;
        else existing.webCount += 1;
      }
    });

    return Array.from(map.values());
  }, [clicks, isBurstMode]);

  return (
    <>
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        {/* Top Header with Live Indicator & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-[#273144] dark:text-slate-100">
                  Live Activity Stream
                </h3>
                {/* Dark green pulsing dot + gray status */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {isLivePolling ? (
                    <>
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-60 dark:bg-emerald-500" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-700 dark:bg-emerald-600" />
                      </span>
                      <span>{isStreaming ? 'Streaming (SSE)' : 'Active (15s)'}</span>
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600" />
                      <span>Paused</span>
                    </>
                  )}
                </div>

                {/* Velocity Meter Badge */}
                {velocity > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                    <Zap className="h-3 w-3 text-slate-500" />
                    <span>{velocity} clicks/min</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time telemetry buffer capped to latest 30 interactions
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Burst Aggregation Toggle */}
            <button
              type="button"
              onClick={() => setIsBurstMode(!isBurstMode)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors shadow-2xs cursor-pointer ${
                isBurstMode
                  ? 'border-[#2a5bd7] bg-blue-50 text-[#2a5bd7] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
              title="Group rapid consecutive clicks on the same link"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Burst Mode</span>
            </button>

            {/* Detailed Click Log Modal Button */}
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span>Full Log</span>
            </button>

            {/* Pause / Resume Feed Button */}
            <button
              type="button"
              onClick={togglePause}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              {isLivePolling ? (
                <>
                  <Pause className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Resume</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Chips Toolbar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setEventTypeFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer border whitespace-nowrap ${
                eventTypeFilter === 'all'
                  ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              }`}
            >
              All Events ({rawClicks.length})
            </button>
            <button
              type="button"
              onClick={() => setEventTypeFilter('web')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer border whitespace-nowrap ${
                eventTypeFilter === 'web'
                  ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              }`}
            >
              Web Clicks ({rawClicks.filter((c) => !c.isQrScan).length})
            </button>
            <button
              type="button"
              onClick={() => setEventTypeFilter('qr')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer border whitespace-nowrap ${
                eventTypeFilter === 'qr'
                  ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              }`}
            >
              QR Scans ({rawClicks.filter((c) => c.isQrScan).length})
            </button>
          </div>

          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
            Sliding window (30 max)
          </span>
        </div>

        {/* Floating "New Events" Banner */}
        {unviewedCount > 0 && (
          <button
            type="button"
            onClick={jumpToLatest}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-blue-50 border border-blue-200 text-[#2a5bd7] hover:bg-blue-100 text-xs font-bold transition-all shadow-xs cursor-pointer animate-in fade-in slide-in-from-top-1 dark:bg-blue-950/60 dark:border-blue-900 dark:text-blue-300"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>↑ {unviewedCount} new click{unviewedCount > 1 ? 's' : ''} received · Click to jump to latest</span>
          </button>
        )}

        {/* Feed List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {isBurstMode ? (
            /* Burst Mode View */
            burstGroups.length > 0 ? (
              burstGroups.map((group) => (
                <div
                  key={group.shortCode}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-xs transition-colors hover:bg-slate-100/70 dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#2a5bd7] dark:text-blue-400">
                      trim.ly/{group.shortCode}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-[#2a5bd7] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      <Zap className="h-3 w-3" />
                      {group.count} clicks in burst
                    </span>
                    {group.countries.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                        <Globe className="h-3 w-3 text-slate-400" />
                        <span>{group.countries.slice(0, 3).join(', ')}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 shrink-0">
                    <div className="flex items-center gap-2 rounded-md bg-white px-2.5 py-1 text-[11px] font-medium shadow-2xs dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Smartphone className="h-3 w-3 text-slate-400" />
                        <span>{group.devices.mobile}</span>
                      </div>
                      <span className="text-slate-200 dark:text-slate-700">•</span>
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Monitor className="h-3 w-3 text-slate-400" />
                        <span>{group.devices.desktop}</span>
                      </div>
                      {group.devices.tablet > 0 && (
                        <>
                          <span className="text-slate-200 dark:text-slate-700">•</span>
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                            <Tablet className="h-3 w-3 text-slate-400" />
                            <span>{group.devices.tablet}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <span className="font-semibold text-slate-400 text-[11px]">
                      {getRelativeTime(group.latestTimestamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-xs text-slate-400">
                No active traffic bursts recorded.
              </div>
            )
          ) : (
            /* Discrete Events View */
            clicks.length > 0 ? (
              clicks.map((click, idx) => (
                <div
                  key={`${click.shortCode}-${click.timestamp}-${idx}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-xs transition-colors hover:bg-slate-100/70 dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                >
                  {/* Left Info: Link & Geo */}
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#2a5bd7] dark:text-blue-400">
                      trim.ly/{click.shortCode}
                    </span>

                    {click.isQrScan ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <QrCodeIcon className="h-3 w-3" />
                        QR Scan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <LinkIcon className="h-3 w-3" />
                        Web Click
                      </span>
                    )}

                    <span className="text-slate-300 dark:text-slate-700">•</span>

                    {/* Location Badge */}
                    <div className="flex items-center gap-1 font-semibold text-[#273144] dark:text-slate-200">
                      <Globe className="h-3 w-3 text-slate-400" />
                      <span>
                        {click.city ? `${click.city}, ` : ''}
                        {click.country || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  {/* Right Info: Hardware, Referrer & Relative Time */}
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 shrink-0">
                    <div className="flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[11px] font-medium shadow-2xs dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                      {getDeviceIcon(click.deviceType)}
                      <span>{click.deviceType || 'Desktop'}</span>
                      {click.os && <span className="text-slate-400">({click.os})</span>}
                    </div>

                    {click.referrer && click.referrer !== 'Direct / None' && (
                      <span className="max-w-[120px] truncate text-[11px] font-medium text-slate-500">
                        via {click.referrer.replace(/^https?:\/\//, '')}
                      </span>
                    )}

                    <span className="font-semibold text-slate-400 shrink-0 text-[11px]">
                      {getRelativeTime(click.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-xs text-slate-400">
                No live interactions recorded yet. As users click or scan links, events will appear here in real time.
              </div>
            )
          )}
        </div>
      </div>

      {/* Detailed Click Audit Modal */}
      <DetailedClickLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        initialShortCode={shortCode}
      />
    </>
  );
};
