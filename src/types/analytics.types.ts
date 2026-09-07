export interface TimeSeriesPoint {
  date: string;
  current: number;
  previous: number;
  currentUniques?: number;
}

export interface BreakdownMetric {
  name: string;
  count: number;
  percentage?: number;
  category?: string;
}

export interface LocationCountryMetric {
  name: string;
  count: number;
  percentage: number;
}

export interface LocationCityMetric {
  city: string;
  country: string;
  count: number;
  percentage: number;
}

export interface UtmMetric {
  name: string;
  count: number;
}

export interface TopLinkMetric {
  shortCode: string;
  title: string;
  longUrl: string;
  count: number;
  percentage: number;
}

export interface LiveClickEvent {
  shortCode: string;
  timestamp: string;
  country: string | null;
  city: string | null;
  region: string | null;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
  isQrScan: boolean;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  ipHash?: string;
}

export interface AnalyticsSummary {
  totalClicks: number;
  prevTotalClicks: number;
  clicksGrowth: number;
  uniqueVisitors: number;
  prevUniqueVisitors: number;
  uniqueGrowth: number;
  qrScans: number;
  prevQrScans: number;
  qrGrowth: number;
  webClicks: number;
  qrPercentage: number;
  topCountry: string;
  topReferrer: string;
  topLink: TopLinkMetric | null;
  smartSummary: string;
}

export interface AnalyticsDashboardResponse {
  summary: AnalyticsSummary;
  timeSeries: TimeSeriesPoint[];
  locations: {
    countries: LocationCountryMetric[];
    cities: LocationCityMetric[];
  };
  referrers: BreakdownMetric[];
  platforms: {
    devices: BreakdownMetric[];
    os: BreakdownMetric[];
    browsers: BreakdownMetric[];
  };
  utms: {
    sources: UtmMetric[];
    mediums: UtmMetric[];
    campaigns: UtmMetric[];
  };
  topLinks: TopLinkMetric[];
  recentActivity: LiveClickEvent[];
  userUrls: Array<{
    _id?: string;
    shortCode: string;
    longUrl: string;
    clickCount: number;
    title?: string | null;
    channel?: string | null;
    campaignId?: string | null;
    tags?: string[];
  }>;
  allTimeClicks: number;
}

// Backward compatibility interface
export interface LinkAnalytics {
  shortCode?: string;
  longUrl?: string;
  totalClicks?: number;
  allTimeClicks?: number;
  clicksByDate?: Array<{ date: string; count?: number; current?: number; previous?: number }>;
  byDate?: Array<{ date: string; count?: number; current?: number; previous?: number }>;
  referrers?: BreakdownMetric[];
  byReferrer?: BreakdownMetric[];
  devices?: BreakdownMetric[];
  browsers?: BreakdownMetric[];
  countries?: BreakdownMetric[];
  createdAt?: string;
  topDay?: { date: string; count: number } | null;
  topCountry?: { name: string; count: number } | null;
  summary?: AnalyticsSummary;
  timeSeries?: TimeSeriesPoint[];
  locations?: {
    countries: LocationCountryMetric[];
    cities: LocationCityMetric[];
  };
  platforms?: {
    devices: BreakdownMetric[];
    os: BreakdownMetric[];
    browsers: BreakdownMetric[];
  };
  utms?: {
    sources: UtmMetric[];
    mediums: UtmMetric[];
    campaigns: UtmMetric[];
  };
  topLinks?: TopLinkMetric[];
  recentActivity?: LiveClickEvent[];
  userUrls?: Array<{
    _id?: string;
    shortCode: string;
    longUrl: string;
    clickCount: number;
    title?: string | null;
    channel?: string | null;
    campaignId?: string | null;
    tags?: string[];
  }>;
}


