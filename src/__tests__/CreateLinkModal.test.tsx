import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateLinkModal } from '@/components/links/CreateLinkModal';

const mockMutateAsync = jest.fn();
const mockCloseCreateModal = jest.fn();

const storeState = {
  isCreateModalOpen: true,
  closeCreateModal: mockCloseCreateModal,
  defaultModalUrl: '',
};

jest.mock('@/hooks/useCreateLink', () => ({
  useCreateLink: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

jest.mock('@/hooks/useCampaigns', () => ({
  useCampaigns: () => ({
    campaigns: [],
    isLoading: false,
  }),
}));

jest.mock('@/store/uiStore', () => ({
  useUIStore: (selector?: any) =>
    typeof selector === 'function' ? selector(storeState) : storeState,
}));

describe('CreateLinkModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal title and form inputs when open', () => {
    render(<CreateLinkModal />);
    expect(screen.getByText(/Create a new short link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Destination URL \*/i)).toBeInTheDocument();
  });

  it('validates URL requirement on submit', async () => {
    render(<CreateLinkModal />);
    fireEvent.click(screen.getByRole('button', { name: /Create link/i }));

    await waitFor(() => {
      expect(screen.getByText(/Destination URL is required/i)).toBeInTheDocument();
    });
  });

  it('calls mutateAsync with formatted URL on valid submission', async () => {
    mockMutateAsync.mockResolvedValueOnce({ shortCode: 'custom123' });
    render(<CreateLinkModal />);

    fireEvent.change(screen.getByLabelText(/Destination URL \*/i), {
      target: { value: 'https://example.com/target' },
    });
    fireEvent.change(screen.getByLabelText(/Custom back-half \(optional\)/i), {
      target: { value: 'custom123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Create link/i }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        longUrl: 'https://example.com/target',
        customAlias: 'custom123',
        title: undefined,
      });
    });
  });
});
