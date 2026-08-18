import { useUIStore } from '@/store/uiStore';
import { useFilterStore } from '@/store/filterStore';
import { useQrBuilderStore } from '@/store/qrBuilderStore';

describe('Zustand Client Stores', () => {
  it('uiStore updates activeModal and payload', () => {
    useUIStore.getState().openModal('createLink', { url: 'https://test.com' });
    expect(useUIStore.getState().activeModal).toBe('createLink');
    expect(useUIStore.getState().activeModalPayload).toEqual({ url: 'https://test.com' });

    useUIStore.getState().closeModal();
    expect(useUIStore.getState().activeModal).toBeNull();
  });

  it('filterStore handles search query and selection toggling', () => {
    useFilterStore.getState().setLinksSearchQuery('campaign-1');
    expect(useFilterStore.getState().linksSearchQuery).toBe('campaign-1');

    useFilterStore.getState().toggleLinkSelection('link-100');
    expect(useFilterStore.getState().selectedLinkIds).toContain('link-100');

    useFilterStore.getState().toggleLinkSelection('link-100');
    expect(useFilterStore.getState().selectedLinkIds).not.toContain('link-100');
  });

  it('qrBuilderStore handles step and config updates', () => {
    useQrBuilderStore.getState().setStep(2);
    expect(useQrBuilderStore.getState().step).toBe(2);

    useQrBuilderStore.getState().updateDraftConfig({ dotsColor: '#ff0000' });
    expect(useQrBuilderStore.getState().draftConfig.dotsColor).toBe('#ff0000');
  });
});
