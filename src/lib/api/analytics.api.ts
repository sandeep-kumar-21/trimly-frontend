import { apiClient } from './client';
import { LinkAnalytics } from '@/types/analytics.types';

export const analyticsApi = {
  async getLinkAnalytics(code: string, from?: string, to?: string): Promise<LinkAnalytics> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await apiClient.get<LinkAnalytics>(`/analytics/${code}`, { params });
    return res.data;
  },

  async getUserOverallAnalytics(from?: string, to?: string): Promise<LinkAnalytics & { totalLinks?: number; userUrls?: any[] }> {
    const params: Record<string, string> = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await apiClient.get('/analytics', { params });
    return res.data;
  },
};
