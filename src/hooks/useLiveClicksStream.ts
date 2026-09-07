'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LiveClickEvent } from '@/types/analytics.types';
import { getAuthToken } from '@/lib/api/client';
import { analyticsApi } from '@/lib/api/analytics.api';

const MAX_BUFFER_SIZE = 30; // Sliding window buffer cap (zero memory leak)
const VELOCITY_WINDOW_MS = 60000; // 60-second window for velocity meter (clicks/min)

export interface UseLiveClicksStreamOptions {
  shortCode?: string;
  initialClicks?: LiveClickEvent[];
  enabled?: boolean;
}

export function useLiveClicksStream({
  shortCode,
  initialClicks = [],
  enabled = true,
}: UseLiveClicksStreamOptions = {}) {
  const [clicks, setClicks] = useState<LiveClickEvent[]>(initialClicks);
  const [isLivePolling, setIsLivePolling] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'polling' | 'paused'>('connecting');
  const [velocity, setVelocity] = useState<number>(0); // clicks per minute
  const [unviewedCount, setUnviewedCount] = useState<number>(0);
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'web' | 'qr'>('all');
  const [isBurstMode, setIsBurstMode] = useState<boolean>(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const clickTimestampsRef = useRef<number[]>([]);
  const isLivePollingRef = useRef(isLivePolling);
  isLivePollingRef.current = isLivePolling;

  // Sync initial clicks when provided
  useEffect(() => {
    if (initialClicks && initialClicks.length > 0 && clicks.length === 0) {
      setClicks(initialClicks.slice(0, MAX_BUFFER_SIZE));
    }
  }, [initialClicks, clicks.length]);

  // Recalculate velocity every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const cutoff = now - VELOCITY_WINDOW_MS;
      clickTimestampsRef.current = clickTimestampsRef.current.filter((t) => t > cutoff);
      setVelocity(clickTimestampsRef.current.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle incoming live click event
  const handleIncomingClick = useCallback((newEvent: LiveClickEvent) => {
    // Record timestamp for velocity rate
    const now = Date.now();
    clickTimestampsRef.current.push(now);
    const cutoff = now - VELOCITY_WINDOW_MS;
    clickTimestampsRef.current = clickTimestampsRef.current.filter((t) => t > cutoff);
    setVelocity(clickTimestampsRef.current.length);

    if (!isLivePollingRef.current) {
      setUnviewedCount((prev) => prev + 1);
      return;
    }

    setClicks((prev) => {
      // Avoid duplicate events if received simultaneously
      const exists = prev.some(
        (c) =>
          c.shortCode === newEvent.shortCode &&
          c.timestamp === newEvent.timestamp &&
          c.ipHash === newEvent.ipHash
      );
      if (exists) return prev;

      // Sliding window: prepend and cap at MAX_BUFFER_SIZE
      return [newEvent, ...prev].slice(0, MAX_BUFFER_SIZE);
    });
  }, []);

  // Initial fetch of recent activity
  const fetchRecent = useCallback(async () => {
    try {
      const data = await analyticsApi.getRecentActivity();
      if (Array.isArray(data)) {
        setClicks((prev) => {
          const map = new Map<string, LiveClickEvent>();
          // Combine existing with fresh data, newest first
          [...data, ...prev].forEach((item) => {
            const key = `${item.shortCode}-${item.timestamp}`;
            if (!map.has(key)) map.set(key, item);
          });
          return Array.from(map.values()).slice(0, MAX_BUFFER_SIZE);
        });
      }
    } catch {
      // Ignored for graceful degradation
    }
  }, []);

  // Setup SSE connection with fallback polling
  useEffect(() => {
    if (!enabled) return;

    fetchRecent();

    const token = getAuthToken();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    let sseUrl = `${apiUrl}/analytics/live`;
    const params = new URLSearchParams();
    if (token) params.set('token', token);
    if (shortCode) params.set('shortCode', shortCode);
    if (params.toString()) sseUrl += `?${params.toString()}`;

    let pollFallbackInterval: NodeJS.Timeout | null = null;

    try {
      const es = new EventSource(sseUrl);
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsStreaming(true);
        setConnectionStatus(isLivePollingRef.current ? 'connected' : 'paused');
        if (pollFallbackInterval) {
          clearInterval(pollFallbackInterval);
          pollFallbackInterval = null;
        }
      };

      es.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'click' && parsed.payload) {
            handleIncomingClick(parsed.payload);
          }
        } catch {
          // Heartbeat or parse error
        }
      };

      es.onerror = () => {
        setIsStreaming(false);
        setConnectionStatus(isLivePollingRef.current ? 'polling' : 'paused');
        es.close();

        // Start fallback polling every 15s if SSE is not supported or disconnected
        if (!pollFallbackInterval && isLivePollingRef.current) {
          pollFallbackInterval = setInterval(() => {
            if (isLivePollingRef.current) {
              fetchRecent();
            }
          }, 15000);
        }
      };
    } catch {
      // EventSource not supported: use fallback polling
      setIsStreaming(false);
      setConnectionStatus(isLivePollingRef.current ? 'polling' : 'paused');
      pollFallbackInterval = setInterval(() => {
        if (isLivePollingRef.current) {
          fetchRecent();
        }
      }, 15000);
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (pollFallbackInterval) {
        clearInterval(pollFallbackInterval);
      }
    };
  }, [enabled, shortCode, fetchRecent, handleIncomingClick]);

  // Pause / Resume toggle
  const togglePause = useCallback(() => {
    setIsLivePolling((prev) => {
      const next = !prev;
      setConnectionStatus(next ? (isStreaming ? 'connected' : 'polling') : 'paused');
      if (next) {
        setUnviewedCount(0);
        fetchRecent();
      }
      return next;
    });
  }, [isStreaming, fetchRecent]);

  // Reset unviewed banner and pull latest
  const jumpToLatest = useCallback(() => {
    setUnviewedCount(0);
    if (!isLivePolling) {
      setIsLivePolling(true);
      setConnectionStatus(isStreaming ? 'connected' : 'polling');
    }
    fetchRecent();
  }, [isLivePolling, isStreaming, fetchRecent]);

  // Filter clicks by event type (All, Web Clicks, QR Scans)
  const filteredClicks = clicks.filter((c) => {
    if (eventTypeFilter === 'qr') return Boolean(c.isQrScan);
    if (eventTypeFilter === 'web') return !c.isQrScan;
    return true;
  });

  return {
    clicks: filteredClicks,
    rawClicks: clicks,
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
    refetch: fetchRecent,
  };
}
