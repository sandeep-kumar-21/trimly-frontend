export interface ShortLink {
  _id: string;
  id?: string;
  shortCode: string;
  shortUrl?: string;
  longUrl: string;
  clickCount: number;
  createdAt: string;
  expiresAt?: string | null;
  userId?: string | null;
  title?: string | null;
  tags?: string[];
  passwordProtected?: boolean;
  campaignId?: string | null;
  channel?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  isHidden?: boolean;
  customBackHalf?: boolean;
  visibleAsLink?: boolean;
  hasQR?: boolean;
  qrCodeId?: string;
  isCustomAlias?: boolean;
}

export interface CreateLinkPayload {
  longUrl: string;
  customAlias?: string;
  expiresAt?: string;
  title?: string;
  campaignId?: string;
  channel?: string;
  tags?: string[];
  password?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface UpdateLinkPayload {
  longUrl?: string;
  expiresAt?: string | null;
  title?: string;
  campaignId?: string | null;
  channel?: string | null;
  tags?: string[];
  password?: string | null;
  isHidden?: boolean;
  visibleAsLink?: boolean;
}
