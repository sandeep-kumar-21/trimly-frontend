'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { QrCodeLanding } from '@/components/qrcodes/QrCodeLanding';

export default function NewQrCodeLandingPage() {
  const router = useRouter();

  const handleStartCreate = () => {
    router.push('/qrcodes/create');
  };

  return (
    <div className="py-6">
      <QrCodeLanding onStartCreate={handleStartCreate} />
    </div>
  );
}
