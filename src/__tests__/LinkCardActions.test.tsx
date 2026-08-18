import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LinkCardActions } from '@/components/links/LinkCardActions';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/hooks/useLinks', () => ({
  useLinks: () => ({
    deleteLink: jest.fn(),
    isDeleting: false,
  }),
}));

describe('LinkCardActions', () => {
  const mockLink = {
    _id: 'link1',
    shortCode: 'abc12',
    longUrl: 'https://example.com',
    clickCount: 10,
    createdAt: '2026-08-01T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders share and options buttons', () => {
    render(<LinkCardActions link={mockLink} />);
    expect(screen.getByTitle(/Share link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Link actions menu/i)).toBeInTheDocument();
  });

  it('opens dropdown menu on click', () => {
    render(<LinkCardActions link={mockLink} />);
    const menuBtn = screen.getByLabelText(/Link actions menu/i);
    fireEvent.click(menuBtn);

    expect(screen.getByText(/View link details/i)).toBeInTheDocument();
    expect(screen.getByText(/Customize QR Code/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete/i)).toBeInTheDocument();
  });
});
