import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QrCodeCard } from '@/components/qrcodes/QrCodeCard';
import { SharedDetailsSharingCard } from '@/components/details/SharedDetailsSharingCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
  useParams: () => ({ code: 'test-qr' }),
}));

// Mock hooks
jest.mock('@/hooks/useQRCodes', () => ({
  useUserQrCodes: () => ({
    data: [
      {
        _id: 'qr-1',
        id: 'qr-1',
        shortCode: 'test-qr',
        svg: '<svg data-testid="backend-svg-markup"><circle cx="50" cy="50" r="40" /></svg>',
        shortUrl: 'http://localhost:4000/test-qr',
        qrConfig: { dotsStyle: 'square', cornersStyle: 'square', dotsColor: '#000000' },
        createdAt: new Date().toISOString(),
      },
    ],
    isLoading: false,
  }),
  useDuplicateQrCode: () => ({ mutateAsync: jest.fn() }),
  useUpdateQrCode: () => ({ mutateAsync: jest.fn() }),
}));

jest.mock('@/hooks/useBulkLinks', () => ({
  useBulkLinks: () => ({ bulkUpdateTags: jest.fn() }),
}));

describe('QR Code Render Architecture Separation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  it('QrCodeCard renders backend SVG markup directly', () => {
    const mockItem = {
      _id: 'qr-1',
      id: 'qr-1',
      title: 'My Custom QR',
      destinationUrl: 'https://example.com',
      shortCode: 'test-qr',
      createdAt: new Date().toISOString(),
      shortUrl: 'http://localhost:4000/test-qr',
      svg: '<svg data-testid="card-backend-svg"><rect width="100" height="100" /></svg>',
      qrConfig: { dotsStyle: 'square', cornersStyle: 'square', dotsColor: '#000000' },
    };

    render(
      <QueryClientProvider client={queryClient}>
        <QrCodeCard item={mockItem} />
      </QueryClientProvider>
    );

    const svgElement = screen.getByTestId('card-backend-svg_test-qr');
    expect(svgElement).toBeInTheDocument();
  });

  it('SharedDetailsSharingCard renders authoritative backend SVG markup on details page', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SharedDetailsSharingCard
          type="qrcode"
          shortCode="test-qr"
          destinationUrl="https://example.com"
          shortUrl="http://localhost:4000/test-qr"
        />
      </QueryClientProvider>
    );

    const svgElement = screen.getByTestId('backend-svg-markup_test-qr');
    expect(svgElement).toBeInTheDocument();
  });
});
