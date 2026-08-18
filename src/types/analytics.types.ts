export interface ClickDateMetric {
  date: string;
  count: number;
}

export interface BreakdownMetric {
  name: string;
  count: number;
  percentage?: number;
}

export interface LinkAnalytics {
  shortCode: string;
  totalClicks: number;
  allTimeClicks?: number;
  clicksByDate: ClickDateMetric[];
  byDate?: ClickDateMetric[];
  referrers: BreakdownMetric[];
  byReferrer?: BreakdownMetric[];
  devices: BreakdownMetric[];
  browsers?: BreakdownMetric[];
  countries?: BreakdownMetric[];
  longUrl?: string;
  createdAt?: string;
  topDay?: { date: string; count: number } | null;
  topCountry?: { name: string; count: number } | null;
}
