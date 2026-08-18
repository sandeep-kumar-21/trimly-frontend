import { create } from 'zustand';

export interface FilterCriteria {
  dateRange: string;
  channel: string;
  status: string;
  sortBy: string;
}

export interface AnalyticsDateRange {
  preset: string;
  from?: string;
  to?: string;
}

interface FilterState {
  linksSearchQuery: string;
  linksFilterCriteria: FilterCriteria;
  analyticsDateRange: AnalyticsDateRange;
  selectedLinkIds: string[];

  setLinksSearchQuery: (query: string) => void;
  setLinksFilterCriteria: (criteria: Partial<FilterCriteria>) => void;
  resetLinksFilterCriteria: () => void;
  setAnalyticsDateRange: (range: AnalyticsDateRange) => void;
  setSelectedLinkIds: (ids: string[]) => void;
  toggleLinkSelection: (id: string) => void;
  clearSelectedLinkIds: () => void;
}

const defaultFilterCriteria: FilterCriteria = {
  dateRange: 'all',
  channel: 'all',
  status: 'all',
  sortBy: 'createdAt_desc',
};

const defaultAnalyticsDateRange: AnalyticsDateRange = {
  preset: '7d',
};

export const useFilterStore = create<FilterState>((set) => ({
  linksSearchQuery: '',
  linksFilterCriteria: defaultFilterCriteria,
  analyticsDateRange: defaultAnalyticsDateRange,
  selectedLinkIds: [],

  setLinksSearchQuery: (query) => set({ linksSearchQuery: query }),

  setLinksFilterCriteria: (criteria) =>
    set((state) => ({
      linksFilterCriteria: { ...state.linksFilterCriteria, ...criteria },
    })),

  resetLinksFilterCriteria: () => set({ linksFilterCriteria: defaultFilterCriteria }),

  setAnalyticsDateRange: (range) => set({ analyticsDateRange: range }),

  setSelectedLinkIds: (ids) => set({ selectedLinkIds: ids }),

  toggleLinkSelection: (id) =>
    set((state) => {
      const exists = state.selectedLinkIds.includes(id);
      return {
        selectedLinkIds: exists
          ? state.selectedLinkIds.filter((item) => item !== id)
          : [...state.selectedLinkIds, id],
      };
    }),

  clearSelectedLinkIds: () => set({ selectedLinkIds: [] }),
}));
