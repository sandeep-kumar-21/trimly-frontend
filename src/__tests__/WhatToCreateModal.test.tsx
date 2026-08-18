import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WhatToCreateModal } from '@/components/modals/WhatToCreateModal';

const mockPush = jest.fn();
const mockCloseCreateModal = jest.fn();

const storeState = {
  isCreateModalOpen: true,
  closeCreateModal: mockCloseCreateModal,
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/store/uiStore', () => ({
  useUIStore: (selector?: any) =>
    typeof selector === 'function' ? selector(storeState) : storeState,
}));

describe('WhatToCreateModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "What do you want to create?" title and 2 options when open', () => {
    render(<WhatToCreateModal />);
    expect(screen.getByText(/What do you want to create\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Shorten a link/i)).toBeInTheDocument();
    expect(screen.getByText(/Create a QR Code/i)).toBeInTheDocument();
  });

  it('navigates to /links/create when Shorten a link is clicked', () => {
    render(<WhatToCreateModal />);
    fireEvent.click(screen.getByText(/Shorten a link/i));
    expect(mockCloseCreateModal).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/links/create');
  });

  it('navigates to /qrcodes/create when Create a QR Code is clicked', () => {
    render(<WhatToCreateModal />);
    fireEvent.click(screen.getByText(/Create a QR Code/i));
    expect(mockCloseCreateModal).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/qrcodes/create');
  });
});
