import { ShortLink } from './link.types';

export interface Campaign {
  _id: string;
  id?: string;
  name: string;
  description?: string | null;
  channels?: string[];
  userId: string;
  createdAt: string;
  updatedAt?: string;
  totalLinks?: number;
  totalClicks?: number;
  topChannel?: { channel: string; clicks: number } | null;
}

export interface CreateCampaignPayload {
  name: string;
  description?: string;
  channels?: string[];
}

export interface UpdateCampaignPayload {
  name?: string;
  description?: string;
  channels?: string[];
}

export interface AddCampaignLinksPayload {
  destinationUrl: string;
  title?: string;
  channels: string[];
  autoUtm?: boolean;
  customAliasPrefix?: string;
}

export interface AssignExistingLinksPayload {
  linkIds: string[];
  channel?: string;
}

export interface ChannelGroup {
  channel: string;
  totalClicks: number;
  totalLinks: number;
  percentOfClicks?: number;
  links: ShortLink[];
}

export interface CampaignDetails {
  campaign: Campaign;
  totalClicks: number;
  totalLinks: number;
  topChannel?: { channel: string; clicks: number } | null;
  channels: ChannelGroup[];
}
