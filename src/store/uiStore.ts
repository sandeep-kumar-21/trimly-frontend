import { create } from 'zustand';

export type ActiveModalType =
  | 'createWhat'
  | 'createLink'
  | 'shareLink'
  | 'hideLink'
  | 'dateFilter'
  | 'tableFilter'
  | null;

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  isAiAssistOpen: boolean;
  activeModal: ActiveModalType;
  activeModalPayload: any;
  toggleSidebar: () => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleAiAssist: () => void;
  setSidebarOpen: (open: boolean) => void;
  setAiAssistOpen: (open: boolean) => void;

  // Modal controls
  openModal: (modal: ActiveModalType, payload?: any) => void;
  closeModal: () => void;

  // Backwards compatibility for existing components
  isCreateModalOpen: boolean;
  defaultModalUrl?: string;
  openCreateModal: (defaultUrl?: string) => void;
  closeCreateModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  isAiAssistOpen: false,
  activeModal: null,
  activeModalPayload: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleAiAssist: () => set((state) => ({ isAiAssistOpen: !state.isAiAssistOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setAiAssistOpen: (open) => set({ isAiAssistOpen: open }),

  openModal: (modal, payload = null) =>
    set({
      activeModal: modal,
      activeModalPayload: payload,
      isCreateModalOpen: modal === 'createLink',
      defaultModalUrl: modal === 'createLink' ? payload?.url : undefined,
    }),

  closeModal: () =>
    set({
      activeModal: null,
      activeModalPayload: null,
      isCreateModalOpen: false,
      defaultModalUrl: undefined,
    }),

  // Compatibility helpers
  isCreateModalOpen: false,
  defaultModalUrl: undefined,
  openCreateModal: (defaultUrl) =>
    set({
      activeModal: 'createLink',
      activeModalPayload: { url: defaultUrl },
      isCreateModalOpen: true,
      defaultModalUrl: defaultUrl,
    }),
  closeCreateModal: () =>
    set({
      activeModal: null,
      activeModalPayload: null,
      isCreateModalOpen: false,
      defaultModalUrl: undefined,
    }),
}));
