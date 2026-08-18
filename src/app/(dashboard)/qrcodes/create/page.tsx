'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { QrCodeStepperHeader } from '@/components/qrcodes/QrCodeStepperHeader';
import { SharedDetailsCard } from '@/components/creation/SharedDetailsCard';
import { SharedSharingOptionsCard } from '@/components/creation/SharedSharingOptionsCard';
import { SharedAdvancedSettingsCard } from '@/components/creation/SharedAdvancedSettingsCard';
import { SharedCreationActionBar } from '@/components/creation/SharedCreationActionBar';
import { QrCustomizerCard, QrCustomizerState } from '@/components/qrcodes/QrCustomizerCard';
import { QrCodePreviewCard } from '@/components/qrcodes/QrCodePreviewCard';
import { useCreateLink } from '@/hooks/useCreateLink';
import { useCreateQrCode } from '@/hooks/useQRCodes';
import { useLinks } from '@/hooks/useLinks';
import { mapCustomizerToQrConfig } from '@/lib/utils/qrConfigMapper';
import { checkQrContrast } from '@/lib/utils/qrContrastValidator';
import { toast } from 'sonner';

export default function CreateQrCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeParam = searchParams?.get('code');

  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed);

  React.useEffect(() => {
    setSidebarCollapsed(true);
    return () => setSidebarCollapsed(false);
  }, [setSidebarCollapsed]);

  // Stepper State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCreating, setIsCreating] = useState(false);

  // Step 1 Form State
  const [destinationUrl, setDestinationUrl] = useState('');
  const [title, setTitle] = useState('');
  const [alsoCreateLink, setAlsoCreateLink] = useState(true);
  const [isDynamicRoutingActive, setIsDynamicRoutingActive] = useState(false);

  const { links } = useLinks();

  useEffect(() => {
    if (codeParam && links.length > 0) {
      const targetLink = links.find((l) => l.shortCode === codeParam);
      if (targetLink) {
        setDestinationUrl(targetLink.longUrl);
        setTitle(targetLink.title || '');
      }
    }
  }, [codeParam, links]);

  // Step 2 Customizer State
  const [customizerState, setCustomizerState] = useState<QrCustomizerState>({
    pattern: 'p1',
    corner: 'c1',
    presetColor: '#000000',
    codeColor: '#000000',
    bgColor: '#FFFFFF',
    useQrColorForCorners: true,
    logoOption: 'none',
  });

  // Mutations
  const createLinkMutation = useCreateLink();
  const createQrCodeMutation = useCreateQrCode();

  const handleSetItUpClick = () => {
    setIsDynamicRoutingActive(true);
    const el = document.getElementById('advanced-settings-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancel = () => {
    if (codeParam) {
      router.push(`/links/${codeParam}/details`);
    } else {
      router.push('/qrcodes');
    }
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep === 1) {
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (targetStep === 2) {
      if (!destinationUrl || destinationUrl.trim() === '') {
        toast.error('Please enter a Destination URL first');
        const el = document.getElementById('destination-url');
        if (el) el.focus();
      } else {
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleProceedToStep2 = () => {
    handleStepClick(2);
  };

  const handleBackToStep1 = () => {
    handleStepClick(1);
  };

  const isExistingLink = Boolean(codeParam);
  const isLowContrast = checkQrContrast(customizerState.codeColor, customizerState.bgColor).isLowContrast;

  const handleCreateCode = async () => {
    if (isCreating) return;
    if (isLowContrast) {
      toast.error('Code and background colors must have sufficient contrast to be scannable');
      return;
    }
    setIsCreating(true);

    try {
      const qrConfig = mapCustomizerToQrConfig(customizerState);

      if (codeParam) {
        // Attaching custom QR code to existing shortCode
        await createQrCodeMutation.mutateAsync({
          shortCode: codeParam,
          qrConfig,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem(`qr_created_${codeParam.toLowerCase()}`, 'true');
        }
        router.push(`/links/${codeParam}/details`);
      } else {
        // Formatting & creating new QR (with or without visible link) atomically
        let formattedUrl = destinationUrl.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
          formattedUrl = `https://${formattedUrl}`;
        }

        const qrRes = await createQrCodeMutation.mutateAsync({
          longUrl: formattedUrl,
          title: title.trim() || undefined,
          createLink: alsoCreateLink,
          qrConfig,
        });

        if (typeof window !== 'undefined' && qrRes?.qrCode?.shortCode) {
          localStorage.setItem(`qr_created_${qrRes.qrCode.shortCode.toLowerCase()}`, 'true');
        }
        router.push('/qrcodes');
      }
    } catch {
      // Individual mutation error handlers show toasts
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        {/* Left Column: Form Cards (~7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Stepper Header */}
          <QrCodeStepperHeader
            currentStep={currentStep}
            onStepClick={handleStepClick}
            shortCodePill={codeParam ? `trim.ly/${codeParam}` : undefined}
            isExistingLink={isExistingLink}
          />

          {isExistingLink ? (
            <>
              {/* Existing Link Mode: Direct Customize Card */}
              <QrCustomizerCard
                customizerState={customizerState}
                onCustomizerStateChange={setCustomizerState}
              />

              {/* Existing Link Action Bar */}
              <SharedCreationActionBar
                onCancel={handleCancel}
                onSubmit={handleCreateCode}
                submitText="Create your code"
                isLoading={isCreating}
                disabled={isLowContrast}
                disabledTooltip="Code and background colors must have sufficient contrast to be scannable"
              />
            </>
          ) : currentStep === 1 ? (
            <>
              {/* Step 1: Section 1 - Code details */}
              <SharedDetailsCard
                type="qrcode"
                destinationUrl={destinationUrl}
                onDestinationUrlChange={setDestinationUrl}
                title={title}
                onTitleChange={setTitle}
                onSetItUpClick={handleSetItUpClick}
              />

              {/* Step 1: Section 2 - Sharing options */}
              <SharedSharingOptionsCard
                mode="qrcode"
                toggleValue={alsoCreateLink}
                onToggleChange={setAlsoCreateLink}
              />

              {/* Step 1: Section 3 - Advanced settings */}
              <SharedAdvancedSettingsCard
                type="qrcode"
                isDynamicRoutingActive={isDynamicRoutingActive}
                onDynamicRoutingToggle={setIsDynamicRoutingActive}
                defaultDestinationUrl={destinationUrl}
              />

              {/* Step 1 Action Bar */}
              <SharedCreationActionBar
                onCancel={handleCancel}
                onSubmit={handleProceedToStep2}
                submitText="Design your code >"
              />
            </>
          ) : (
            <>
              {/* Step 2: Customizer Card */}
              <QrCustomizerCard
                customizerState={customizerState}
                onCustomizerStateChange={setCustomizerState}
              />

              {/* Step 2 Action Bar */}
              <SharedCreationActionBar
                onCancel={handleCancel}
                onBack={handleBackToStep1}
                onSubmit={handleCreateCode}
                submitText="Create your code"
                isLoading={isCreating}
                disabled={isLowContrast}
                disabledTooltip="Code and background colors must have sufficient contrast to be scannable"
              />
            </>
          )}
        </div>

        {/* Right Column: Live QR Code Preview (~5 Cols) */}
        <div className="lg:col-span-5 self-start sticky top-6">
          <QrCodePreviewCard
            shortCode={codeParam || undefined}
            shortUrl={codeParam ? `http://localhost:4000/${codeParam}` : undefined}
            destinationUrl={destinationUrl}
            fgColor={customizerState.codeColor}
            bgColor={customizerState.bgColor}
            pattern={customizerState.pattern}
            corners={customizerState.corner}
            logoUrl={customizerState.logoOption !== 'none' ? customizerState.logoOption : null}
            isStep2={isExistingLink || currentStep === 2}
          />
        </div>
      </div>
    </div>
  );
}
