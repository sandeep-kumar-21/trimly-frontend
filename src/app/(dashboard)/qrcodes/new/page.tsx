'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCodeLanding } from '@/components/qrcodes/QrCodeLanding';
import { useUserQrCodes } from '@/hooks/useQRCodes';

export default function NewQrCodeLandingPage() {
  const router = useRouter();
  const { data: qrCodes = [], isLoading, isFetched } = useUserQrCodes();

  useEffect(() => {
    if (isFetched && !isLoading && qrCodes.length > 0) {
      router.replace('/qrcodes');
    }
  }, [isFetched, isLoading, qrCodes.length, router]);

  const handleStartCreate = () => {
    router.push('/qrcodes/create');
  };

  if (isFetched && !isLoading && qrCodes.length > 0) {
    return null;
  }

  return (
    <div className="py-0">
      <QrCodeLanding onStartCreate={handleStartCreate} />
    </div>
  );
}
