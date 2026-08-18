import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProtectedLinkPage from '@/app/protected/[code]/page';

const mockMutateAsync = jest.fn();

jest.mock('next/navigation', () => ({
  useParams: () => ({ code: 'secret1' }),
}));

jest.mock('@/hooks/useVerifyLinkAccess', () => ({
  useVerifyLinkAccess: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

describe('ProtectedLinkPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders password protection heading and input field', () => {
    render(<ProtectedLinkPage />);
    expect(screen.getByText(/Protected Link/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter password.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Unlock & Access/i })).toBeInTheDocument();
  });

  it('calls useVerifyLinkAccess on form submission', async () => {
    mockMutateAsync.mockResolvedValueOnce({ success: true, longUrl: 'https://destination.com' });
    render(<ProtectedLinkPage />);

    const input = screen.getByPlaceholderText(/Enter password.../i);
    fireEvent.change(input, { target: { value: 'my-pass-123' } });

    const submitBtn = screen.getByRole('button', { name: /Unlock & Access/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith('my-pass-123');
    });
  });
});
