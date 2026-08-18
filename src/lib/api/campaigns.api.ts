import { apiClient } from './client';
import { Campaign, CreateCampaignPayload, CampaignDetails } from '@/types/campaign.types';

export interface UpdateCampaignPayload {
  name?: string;
  description?: string;
}

export const campaignsApi = {
  async getUserCampaigns(): Promise<Campaign[]> {
    const res = await apiClient.get<Campaign[]>('/campaigns');
    return res.data;
  },

  async getCampaignDetails(id: string): Promise<CampaignDetails> {
    const res = await apiClient.get<CampaignDetails>(`/campaigns/${id}`);
    return res.data;
  },

  async createCampaign(payload: CreateCampaignPayload): Promise<Campaign> {
    const res = await apiClient.post<Campaign>('/campaigns', payload);
    return res.data;
  },

  async updateCampaign(id: string, payload: UpdateCampaignPayload): Promise<Campaign> {
    const res = await apiClient.patch<Campaign>(`/campaigns/${id}`, payload);
    return res.data;
  },

  async deleteCampaign(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete<{ message: string }>(`/campaigns/${id}`);
    return res.data;
  },
};
