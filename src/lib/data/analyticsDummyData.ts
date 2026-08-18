export interface InsightCardData {
  id: string;
  type: 'CHANNEL' | 'LINK' | 'PEAK ENGAGEMENT';
  title: string;
  description: string;
  badgeText: string;
}

export interface ClicksTimePoint {
  date: string;
  current: number;
  previous: number;
}

export interface ReferrerItem {
  name: string;
  count: number;
  prevCount: number;
}

export interface DeviceItem {
  name: string;
  count: number;
  pct: string;
  trend: string;
  color: string;
}

export interface CountryItem {
  name: string;
  flag: string;
  count: number;
  pct: string;
  trend: string;
}

export const analyticsDummyData = {
  dashboardsList: [
    {
      id: 'preview-dashboard',
      title: 'Preview dashboard',
      lastModified: 'Modified on Jan 15, 2025',
    },
  ],

  lastWeeksInsights: [
    {
      id: 'insight-1',
      type: 'CHANNEL' as const,
      title: 'CHANNEL',
      description: 'Traffic from LinkedIn dropped compared to the week before.',
      badgeText: 'LinkedIn traffic report',
    },
    {
      id: 'insight-2',
      type: 'LINK' as const,
      title: 'LINK',
      description: 'trimly.co/summer-sale was up in traffic compared to the week before.',
      badgeText: 'Top performing link',
    },
    {
      id: 'insight-3',
      type: 'PEAK ENGAGEMENT' as const,
      title: 'PEAK ENGAGEMENT',
      description: 'Engagement peaked on July 31 last week, up +21.2%.',
      badgeText: 'July 31 peak data',
    },
  ],

  clicksOverTime: [
    { date: 'Jul 19', current: 12, previous: 10 },
    { date: 'Jul 21', current: 19, previous: 16 },
    { date: 'Jul 23', current: 8, previous: 7 },
    { date: 'Jul 26', current: 31, previous: 25 },
    { date: 'Jul 28', current: 18, previous: 15 },
    { date: 'Jul 31', current: 35, previous: 29 },
    { date: 'Aug 02', current: 14, previous: 11 },
    { date: 'Aug 04', current: 40, previous: 33 },
    { date: 'Aug 06', current: 24, previous: 20 },
  ],

  previewDashboardData: {
    title: 'Preview dashboard',
    subtitle: 'This is a free preview of Trimly Analytics using sample data.',
    topDay: {
      date: 'July 31, 2026',
      count: 40,
      trend: '+21.2% vs 33 prev period',
    },
    topLocation: {
      name: 'United States & United Kingdom',
      flags: ['🇺🇸', '🇬🇧'],
      count: 205,
      trend: '+22% vs 168 prev period',
    },
    totalEngagements: 381,
    referrers: [
      { name: 'LinkedIn', count: 40, prevCount: 33 },
      { name: 'Google', count: 20, prevCount: 16 },
      { name: 'Trimly', count: 15, prevCount: 12 },
      { name: 'Direct', count: 8, prevCount: 7 },
      { name: 'Facebook', count: 5, prevCount: 4 },
      { name: 'Twitter', count: 5, prevCount: 4 },
      { name: 'Other', count: 4, prevCount: 3 },
    ],
    devices: [
      { name: 'Desktop', count: 146, pct: '21.7%', trend: '↑ 21.7%', color: '#0EA5E9' },
      { name: 'E-Reader', count: 101, pct: '21.7%', trend: '↑ 21.7%', color: '#3B82F6' },
      { name: 'Tablet', count: 70, pct: '22.8%', trend: '↑ 22.8%', color: '#F59E0B' },
      { name: 'Mobile', count: 50, pct: '22%', trend: '↑ 22%', color: '#8B5CF6' },
      { name: 'Unknown', count: 14, pct: '27.3%', trend: '↑ 27.3%', color: '#EC4899' },
    ],
    countries: [
      { name: 'United Kingdom', flag: '🇬🇧', count: 205, pct: '41.7%', trend: '↑ 22%' },
      { name: 'United States', flag: '🇺🇸', count: 205, pct: '41.7%', trend: '↑ 22%' },
      { name: 'Australia', flag: '🇦🇺', count: 120, pct: '24.4%', trend: '↑ 22.4%' },
      { name: 'Canada', flag: '🇨🇦', count: 80, pct: '16.3%', trend: '↑ 21.2%' },
      { name: 'France', flag: '🇫🇷', count: 80, pct: '16.3%', trend: '↑ 21.2%' },
      { name: 'Germany', flag: '🇩🇪', count: 80, pct: '16.3%', trend: '↑ 21.2%' },
      { name: 'Spain', flag: '🇪🇸', count: 80, pct: '16.3%', trend: '↑ 21.2%' },
      { name: 'India', flag: '🇮🇳', count: 27, pct: '5.5%', trend: '↑ 22.7%' },
      { name: 'Mexico', flag: '🇲🇽', count: 19, pct: '3.9%', trend: '↑ 18.8%' },
      { name: 'Japan', flag: '🇯🇵', count: 6, pct: '1.2%', trend: '↑ 20%' },
    ],
  },
};
