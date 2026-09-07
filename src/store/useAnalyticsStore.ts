import { create } from 'zustand';

export type DatePreset = '24h' | '7d' | '30d' | '90d' | 'all' | 'custom';
export type ChartMetric = 'clicks' | 'uniques';
export type GeoTab = 'countries' | 'cities';
export type UtmTab = 'sources' | 'mediums' | 'campaigns';

interface AnalyticsState {
  selectedShortCode: string | null;
  selectedCampaignId: string | null;
  selectedChannel: string | null;
  datePreset: DatePreset;
  customFrom: string;
  customTo: string;
  compareMode: boolean;
  chartMetric: ChartMetric;
  activeGeoTab: GeoTab;
  activeUtmTab: UtmTab;
  isLivePolling: boolean;

  // Actions
  setSelectedShortCode: (code: string | null) => void;
  setSelectedCampaignId: (id: string | null) => void;
  setSelectedChannel: (channel: string | null) => void;
  setDatePreset: (preset: DatePreset) => void;
  setCustomDateRange: (from: string, to: string) => void;
  setCompareMode: (enabled: boolean) => void;
  setChartMetric: (metric: ChartMetric) => void;
  setActiveGeoTab: (tab: GeoTab) => void;
  setActiveUtmTab: (tab: UtmTab) => void;
  setIsLivePolling: (enabled: boolean) => void;
  resetFilters: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  selectedShortCode: null,
  selectedCampaignId: null,
  selectedChannel: null,
  datePreset: '30d',
  customFrom: '',
  customTo: '',
  compareMode: true,
  chartMetric: 'clicks',
  activeGeoTab: 'countries',
  activeUtmTab: 'sources',
  isLivePolling: true,

  setSelectedShortCode: (code) => set({ selectedShortCode: code }),
  setSelectedCampaignId: (id) => set({ selectedCampaignId: id }),
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
  setDatePreset: (preset) => set({ datePreset: preset, customFrom: '', customTo: '' }),
  setCustomDateRange: (from, to) => set({ datePreset: 'custom', customFrom: from, customTo: to }),
  setCompareMode: (enabled) => set({ compareMode: enabled }),
  setChartMetric: (metric) => set({ chartMetric: metric }),
  setActiveGeoTab: (tab) => set({ activeGeoTab: tab }),
  setActiveUtmTab: (tab) => set({ activeUtmTab: tab }),
  setIsLivePolling: (enabled) => set({ isLivePolling: enabled }),
  resetFilters: () =>
    set({
      selectedShortCode: null,
      selectedCampaignId: null,
      selectedChannel: null,
      datePreset: '30d',
      customFrom: '',
      customTo: '',
      compareMode: true,
      chartMetric: 'clicks',
    }),
}));
