import { apiClient } from './client';
import {
  Campaign,
  CreateCampaignPayload,
  UpdateCampaignPayload,
  CampaignDetails,
  AddCampaignLinksPayload,
  AssignExistingLinksPayload,
} from '@/types/campaign.types';
import { ShortLink } from '@/types/link.types';

export const campaignsApi = {
  async getUserCampaigns(): Promise<Campaign[]> {
    const res = await apiClient.get<Campaign[]>('/campaigns');
    return res.data;
  },

  async getUserChannels(): Promise<string[]> {
    const res = await apiClient.get<string[]>('/campaigns/channels/all');
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

  async addCampaignLinksBatch(id: string, payload: AddCampaignLinksPayload): Promise<ShortLink[]> {
    const res = await apiClient.post<ShortLink[]>(`/campaigns/${id}/links`, payload);
    return res.data;
  },

  async assignExistingLinks(id: string, payload: AssignExistingLinksPayload): Promise<{ message: string }> {
    const res = await apiClient.post<{ message: string }>(`/campaigns/${id}/assign-links`, payload);
    return res.data;
  },

  async unlinkCampaignLink(id: string, linkId: string): Promise<{ message: string }> {
    const res = await apiClient.delete<{ message: string }>(`/campaigns/${id}/links/${linkId}`);
    return res.data;
  },
};
