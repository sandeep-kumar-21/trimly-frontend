import { apiClient } from './client';
import { AnalyticsDashboardResponse, LiveClickEvent, LinkAnalytics } from '@/types/analytics.types';

export interface AnalyticsQueryOptions {
  shortCode?: string;
  campaignId?: string;
  channel?: string;
  from?: string;
  to?: string;
  preset?: string;
  interval?: string;
}

export const analyticsApi = {
  async getDashboardAnalytics(options: AnalyticsQueryOptions = {}): Promise<AnalyticsDashboardResponse> {
    const params: Record<string, string> = {};
    if (options.shortCode) params.shortCode = options.shortCode;
    if (options.campaignId) params.campaignId = options.campaignId;
    if (options.channel) params.channel = options.channel;
    if (options.from) params.from = options.from;
    if (options.to) params.to = options.to;
    if (options.preset) params.preset = options.preset;
    if (options.interval) params.interval = options.interval;

    const res = await apiClient.get<AnalyticsDashboardResponse>('/analytics', { params });
    return res.data;
  },

  async getRecentActivity(): Promise<LiveClickEvent[]> {
    const res = await apiClient.get<LiveClickEvent[]>('/analytics/recent');
    return res.data;
  },

  async getLinkAnalytics(code: string, from?: string, to?: string): Promise<LinkAnalytics> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await apiClient.get<LinkAnalytics>(`/analytics/${code}`, { params });
    return res.data;
  },

  async getClickLogs(options: {
    page?: number;
    limit?: number;
    search?: string;
    shortCode?: string;
    country?: string;
    deviceType?: string;
    isQrScan?: boolean | string;
    from?: string;
    to?: string;
  } = {}): Promise<{
    data: LiveClickEvent[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const res = await apiClient.get('/analytics/logs', { params: options });
    return res.data;
  },

  async getUserOverallAnalytics(from?: string, to?: string): Promise<AnalyticsDashboardResponse> {
    return this.getDashboardAnalytics({ from, to });
  },
};

