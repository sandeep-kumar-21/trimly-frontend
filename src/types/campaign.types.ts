import { ShortLink } from './link.types';

export interface Campaign {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
  totalLinks?: number;
  totalClicks?: number;
}

export interface CreateCampaignPayload {
  name: string;
}

export interface ChannelGroup {
  channel: string;
  totalClicks: number;
  totalLinks: number;
  links: ShortLink[];
}

export interface CampaignDetails {
  campaign: Campaign;
  totalClicks: number;
  totalLinks: number;
  channels: ChannelGroup[];
}
