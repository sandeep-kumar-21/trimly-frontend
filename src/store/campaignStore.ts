import { create } from 'zustand';

export interface CampaignState {
  // Filter & Search State
  searchQuery: string;
  selectedChannelFilter: string;
  sortBy: 'clicks' | 'date' | 'name';

  // Modal State
  isAddLinksModalOpen: boolean;
  isEditCampaignModalOpen: boolean;
  isDeleteModalOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedChannelFilter: (channel: string) => void;
  setSortBy: (sort: 'clicks' | 'date' | 'name') => void;
  openAddLinksModal: () => void;
  closeAddLinksModal: () => void;
  openEditCampaignModal: () => void;
  closeEditCampaignModal: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  resetFilters: () => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
  searchQuery: '',
  selectedChannelFilter: 'all',
  sortBy: 'clicks',

  isAddLinksModalOpen: false,
  isEditCampaignModalOpen: false,
  isDeleteModalOpen: false,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedChannelFilter: (channel) => set({ selectedChannelFilter: channel }),
  setSortBy: (sort) => set({ sortBy: sort }),

  openAddLinksModal: () => set({ isAddLinksModalOpen: true }),
  closeAddLinksModal: () => set({ isAddLinksModalOpen: false }),

  openEditCampaignModal: () => set({ isEditCampaignModalOpen: true }),
  closeEditCampaignModal: () => set({ isEditCampaignModalOpen: false }),

  openDeleteModal: () => set({ isDeleteModalOpen: true }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false }),

  resetFilters: () => set({ searchQuery: '', selectedChannelFilter: 'all', sortBy: 'clicks' }),
}));
