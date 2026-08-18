import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LinkTable } from '@/components/links/LinkTable';
import { ShortLink } from '@/types/link.types';

jest.mock('@/hooks/useLinks', () => ({
  useLinks: () => ({
    deleteLink: jest.fn(),
    isDeleting: false,
    updateLink: jest.fn(),
    isUpdating: false,
  }),
}));

const mockLinks: ShortLink[] = [
  {
    _id: '1',
    shortCode: 'abc1234',
    longUrl: 'https://example.com/first-link',
    clickCount: 42,
    createdAt: '2026-07-29T10:00:00Z',
    title: 'First Campaign',
  },
  {
    _id: '2',
    shortCode: 'xyz5678',
    longUrl: 'https://testsite.org/second-link',
    clickCount: 10,
    createdAt: '2026-07-28T10:00:00Z',
    title: 'Second Promo',
  },
];

describe('LinkTable', () => {
  it('renders list of links', () => {
    render(<LinkTable links={mockLinks} />);
    expect(screen.getByText(/\/abc1234/i)).toBeInTheDocument();
    expect(screen.getByText(/\/xyz5678/i)).toBeInTheDocument();
    expect(screen.getByText(/First Campaign/i)).toBeInTheDocument();
  });

  it('filters links based on search query', () => {
    render(<LinkTable links={mockLinks} />);
    const searchInput = screen.getByPlaceholderText(/Search links by URL or code.../i);

    fireEvent.change(searchInput, { target: { value: 'first-link' } });

    expect(screen.getByText(/\/abc1234/i)).toBeInTheDocument();
    expect(screen.queryByText(/\/xyz5678/i)).not.toBeInTheDocument();
  });

  it('displays empty state when links array is empty', () => {
    render(<LinkTable links={[]} />);
    expect(screen.getByText(/No links created yet/i)).toBeInTheDocument();
  });
});
