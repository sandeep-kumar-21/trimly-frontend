'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateLink } from '@/hooks/useCreateLink';
import { useUIStore } from '@/store/uiStore';
import { SharedDetailsCard } from '@/components/creation/SharedDetailsCard';
import { SharedSharingOptionsCard } from '@/components/creation/SharedSharingOptionsCard';
import { SharedAdvancedSettingsCard } from '@/components/creation/SharedAdvancedSettingsCard';
import { SharedCreationActionBar } from '@/components/creation/SharedCreationActionBar';
import { toast } from 'sonner';

export default function CreateLinkPage() {
  const router = useRouter();
  const createLinkMutation = useCreateLink();
  const setSidebarCollapsed = useUIStore((state) => state.setSidebarCollapsed);

  // Collapse sidebar on mount for spacious layout
  React.useEffect(() => {
    setSidebarCollapsed(true);
    return () => setSidebarCollapsed(false);
  }, [setSidebarCollapsed]);

  const [destinationUrl, setDestinationUrl] = useState('');
  const [domain, setDomain] = useState('trim.ly');
  const [backHalf, setBackHalf] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [alsoCreateQr, setAlsoCreateQr] = useState(false);
  const [errorUrl, setErrorUrl] = useState('');

  const [isDynamicRoutingActive, setIsDynamicRoutingActive] = useState(false);

  const handleSetItUpClick = () => {
    setIsDynamicRoutingActive(true);
    const el = document.getElementById('advanced-settings-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGenerateBackHalf = () => {
    const randomCode = Math.random().toString(36).substring(2, 8);
    setBackHalf(randomCode);
    toast.success(`Generated back-half: ${randomCode}`);
  };

  const handleCancel = () => {
    router.push('/links');
  };

  const handleSubmit = async () => {
    if (!destinationUrl.trim()) {
      setErrorUrl('Please enter a destination URL');
      return;
    }
    setErrorUrl('');

    let formattedUrl = destinationUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const parsedTags = tags
      ? tags
          .split(',')
          .map((t) => t.trim().slice(0, 7).replace(/[^a-zA-Z0-9_-]/g, ''))
          .filter(Boolean)
          .slice(0, 10)
      : undefined;

    try {
      await createLinkMutation.mutateAsync({
        longUrl: formattedUrl,
        customAlias: backHalf.trim() || undefined,
        title: title.trim() || undefined,
        tags: parsedTags && parsedTags.length > 0 ? parsedTags : undefined,
        generateQrCode: alsoCreateQr,
      });

      if (alsoCreateQr) {
        toast.success('Link and QR Code created successfully!');
      } else {
        toast.success('Link created successfully!');
      }

      router.push('/links');
    } catch {
      // Handled in mutation onError
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
          Create a new link
        </h1>

        <button
          type="button"
          onClick={() => toast.info('Bulk upload feature is ready.')}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer dark:text-blue-400"
        >
          <span>Bulk upload</span>
          <svg viewBox="0 0 17 16" height="18" width="18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.83341 12.6667H9.16675V9.88333L10.2334 10.95L11.1667 9.99999L8.50008 7.33333L5.83341 9.99999L6.78341 10.9333L7.83341 9.88333V12.6667ZM4.50008 14.6667C4.13341 14.6667 3.81953 14.5361 3.55841 14.275C3.2973 14.0139 3.16675 13.7 3.16675 13.3333V2.66666C3.16675 2.29999 3.2973 1.98611 3.55841 1.72499C3.81953 1.46388 4.13341 1.33333 4.50008 1.33333H9.83341L13.8334 5.33333V13.3333C13.8334 13.7 13.7029 14.0139 13.4417 14.275C13.1806 14.5361 12.8667 14.6667 12.5001 14.6667H4.50008ZM9.16675 5.99999V2.66666H4.50008V13.3333H12.5001V5.99999H9.16675Z"
              fill="#2a5bd7"
            />
          </svg>
        </button>
      </div>

      {/* Main Form Stack (Expanded to max-w-3xl for extra width) */}
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Section 1: Link details */}
        <SharedDetailsCard
          type="link"
          destinationUrl={destinationUrl}
          onDestinationUrlChange={setDestinationUrl}
          domain={domain}
          onDomainChange={setDomain}
          backHalf={backHalf}
          onBackHalfChange={setBackHalf}
          onGenerateBackHalf={handleGenerateBackHalf}
          title={title}
          onTitleChange={setTitle}
          tags={tags}
          onTagsChange={setTags}
          errorUrl={errorUrl}
          onSetItUpClick={handleSetItUpClick}
        />

        {/* Section 2: Sharing options */}
        <SharedSharingOptionsCard
          mode="link"
          toggleValue={alsoCreateQr}
          onToggleChange={setAlsoCreateQr}
        />

        {/* Section 3: Advanced settings */}
        <SharedAdvancedSettingsCard
          type="link"
          isDynamicRoutingActive={isDynamicRoutingActive}
          onDynamicRoutingToggle={setIsDynamicRoutingActive}
          defaultDestinationUrl={destinationUrl}
        />

        {/* Section 4: Floating Action Bar */}
        <SharedCreationActionBar
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitText="Create your link"
          isLoading={createLinkMutation.isPending}
        />
      </div>
    </div>
  );
}
