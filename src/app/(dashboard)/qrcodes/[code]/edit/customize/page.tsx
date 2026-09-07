'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { QrCustomizerCard, QrCustomizerState } from '@/components/qrcodes/QrCustomizerCard';
import { QrCodePreviewCard } from '@/components/qrcodes/QrCodePreviewCard';
import { useQrCodeDetails, useCreateQrCode } from '@/hooks/useQRCodes';
import { mapCustomizerToQrConfig, mapQrConfigToCustomizerState } from '@/lib/utils/qrConfigMapper';
import { checkQrContrast } from '@/lib/utils/qrContrastValidator';
import { RotateCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function QrCodeCustomizeDesignPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const code = (params?.code as string) || '';
  const from = searchParams.get('from');

  const { data: qrDetails, isLoading: isDetailsLoading } = useQrCodeDetails(code);
  const createQrMutation = useCreateQrCode();

  // Compute dynamic return destination
  const getReturnUrl = () => {
    if (from === 'edit') return `/qrcodes/${code}/edit`;
    if (from === 'details') return `/qrcodes/${code}/details`;
    if (from === 'list') return '/qrcodes';
    return `/qrcodes/${code}/details`;
  };

  // Default Customizer State
  const defaultState: QrCustomizerState = {
    pattern: 'p1',
    corner: 'c1',
    presetColor: '#000000',
    codeColor: '#000000',
    bgColor: '#FFFFFF',
    useQrColorForCorners: true,
    logoOption: 'none',
  };

  const [customizerState, setCustomizerState] = useState<QrCustomizerState>(defaultState);
  const [hasInitialized, setHasInitialized] = useState(false);

  const isLowContrast = checkQrContrast(customizerState.codeColor, customizerState.bgColor).isLowContrast;

  useEffect(() => {
    if (qrDetails?.qrConfig && !hasInitialized) {
      setCustomizerState(mapQrConfigToCustomizerState(qrDetails.qrConfig));
      setHasInitialized(true);
    }
  }, [qrDetails, hasInitialized]);

  const handleResetToDefault = () => {
    setCustomizerState(defaultState);
    toast.info('Customizer reset to default styles');
  };

  const handleSaveChanges = async () => {
    if (!code) return;
    if (isLowContrast) {
      toast.error('Code and background colors must have sufficient contrast to be scannable');
      return;
    }
    try {
      const payload = {
        shortCode: code,
        qrConfig: mapCustomizerToQrConfig(customizerState),
      };
      await createQrMutation.mutateAsync(payload);
      queryClient.invalidateQueries({ queryKey: ['qrcodes'] });
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['qr', code] });
      queryClient.invalidateQueries({ queryKey: ['link', code] });
      toast.success('QR Code design updated successfully!');
      router.push(getReturnUrl());
    } catch (error) {
      // Error handled by mutation toast
    }
  };

  const handleCancel = () => {
    router.push(getReturnUrl());
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Form Cards (~7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100 mb-1 sm:mb-2">
            Customize design
          </h1>

          {/* Reusable QrCustomizerCard Component */}
          <QrCustomizerCard
            customizerState={customizerState}
            onCustomizerStateChange={setCustomizerState}
          />

          {/* Save changes & Cancel Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={createQrMutation.isPending || isDetailsLoading || isLowContrast}
              title={isLowContrast ? 'Code and background colors must have sufficient contrast to be scannable' : undefined}
              className="h-9 sm:h-10 px-4 sm:px-6 rounded-lg sm:rounded-md bg-[#2a5bd7] font-bold text-white text-xs sm:text-sm hover:bg-[#1d4cc9] shadow-2xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {createQrMutation.isPending && <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />}
              <span>Save changes</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-md text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Right Column: Live QR Code Preview Column (~5 Cols) */}
        <div className="lg:col-span-5 self-start sticky top-6 space-y-3">
          <QrCodePreviewCard
            shortCode={code}
            shortUrl={qrDetails?.shortUrl || `http://localhost:4000/${code}`}
            destinationUrl={qrDetails?.destinationUrl || qrDetails?.longUrl || `http://localhost:4000/${code}`}
            fgColor={customizerState.codeColor}
            bgColor={customizerState.bgColor}
            pattern={customizerState.pattern}
            corners={customizerState.corner}
            logoUrl={customizerState.logoOption !== 'none' ? customizerState.logoOption : null}
            isStep2={true}
          />

          {/* Reset to Default Button */}
          <div className="flex items-center justify-center pt-1">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer dark:text-blue-400"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset to default</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
