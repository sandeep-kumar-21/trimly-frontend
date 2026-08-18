import { create } from 'zustand';

export interface QrDraftConfig {
  shortCode: string;
  dotsStyle: string;
  cornersStyle: string;
  dotsColor: string;
  backgroundColor: string;
  logoUrl?: string | null;
  centerText?: string | null;
}

interface QrBuilderState {
  step: 1 | 2 | 3;
  draftConfig: QrDraftConfig;
  setStep: (step: 1 | 2 | 3) => void;
  updateDraftConfig: (config: Partial<QrDraftConfig>) => void;
  resetDraftConfig: () => void;
}

const defaultDraftConfig: QrDraftConfig = {
  shortCode: '',
  dotsStyle: 'square',
  cornersStyle: 'square',
  dotsColor: '#000000',
  backgroundColor: '#ffffff',
  logoUrl: null,
  centerText: null,
};

export const useQrBuilderStore = create<QrBuilderState>((set) => ({
  step: 1,
  draftConfig: defaultDraftConfig,

  setStep: (step) => set({ step }),

  updateDraftConfig: (config) =>
    set((state) => ({
      draftConfig: { ...state.draftConfig, ...config },
    })),

  resetDraftConfig: () => set({ step: 1, draftConfig: defaultDraftConfig }),
}));
