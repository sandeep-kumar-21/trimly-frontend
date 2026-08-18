'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Edit2, CornerDownRight, X, AlertCircle, Palette, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { ResetDraftModal } from '@/components/modals/ResetDraftModal';
import { UnsavedChangesModal } from '@/components/modals/UnsavedChangesModal';

export interface SharedEditFormProps {
  type: 'link' | 'qrcode';
  shortCode: string;
  shortUrl?: string;
  initialDestinationUrl: string;
  initialTitle?: string;
  initialTags?: string[];
  qrPreviewSvg?: string | null;
  isLoadingPreview?: boolean;
  onSave?: (data: {
    title: string;
    tags: string[];
    destinationUrl: string;
    customBackHalf?: string;
  }) => Promise<string | void> | string | void;
  onCancel?: () => void;
  onRedirectClick?: () => void;
  onEditBackHalfClick?: () => void;
}

export const SharedEditForm: React.FC<SharedEditFormProps> = ({
  type,
  shortCode,
  shortUrl: propShortUrl,
  initialDestinationUrl,
  initialTitle = '',
  initialTags = [],
  qrPreviewSvg,
  isLoadingPreview = false,
  onSave,
  onCancel,
  onRedirectClick,
  onEditBackHalfClick,
}) => {
  const router = useRouter();
  const isQrMode = type === 'qrcode';
  const shortUrl = propShortUrl || `https://trim.ly/${shortCode}`;

  const [title, setTitle] = useState(initialTitle);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [destinationUrl, setDestinationUrl] = useState(initialDestinationUrl);
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isEditingBackHalf, setIsEditingBackHalf] = useState(false);
  const [customBackHalf, setCustomBackHalf] = useState(shortCode);
  const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  const [isSavingAndLeaving, setIsSavingAndLeaving] = useState(false);

  const isDirty =
    title !== initialTitle ||
    JSON.stringify(tags) !== JSON.stringify(initialTags) ||
    destinationUrl !== initialDestinationUrl ||
    customBackHalf !== shortCode;

  // Prompt user if closing or refreshing tab with unsaved edits
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Intercept internal link navigation (sidebar, topbar, links) when form has unsaved edits
  useEffect(() => {
    if (!isDirty) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      // Allow navigation to customization page without blocking
      if (href.includes(`/edit/customize`) || href === window.location.pathname) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      setPendingUrl(href);
      setIsUnsavedModalOpen(true);
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => document.removeEventListener('click', handleDocumentClick, true);
  }, [isDirty]);

  // Restore draft from sessionStorage if available, else initialize from props
  useEffect(() => {
    if (typeof window === 'undefined' || !shortCode) return;
    try {
      const draftRaw = sessionStorage.getItem(`edit_draft_${type}_${shortCode}`);
      if (draftRaw) {
        const draft = JSON.parse(draftRaw);
        if (draft.title !== undefined) setTitle(draft.title);
        if (Array.isArray(draft.tags)) setTags(draft.tags);
        if (draft.destinationUrl !== undefined) setDestinationUrl(draft.destinationUrl);
        if (draft.customBackHalf !== undefined) setCustomBackHalf(draft.customBackHalf);
        setHasRestoredDraft(true);
        return;
      }
    } catch {
      // Ignore JSON parse errors and fallback to props
    }

    if (initialTitle) setTitle(initialTitle);
    if (initialTags && initialTags.length > 0) setTags(initialTags);
    if (initialDestinationUrl) setDestinationUrl(initialDestinationUrl);
    if (shortCode) setCustomBackHalf(shortCode);
    setHasRestoredDraft(true);
  }, [shortCode, type, initialTitle, initialTags, initialDestinationUrl]);

  // Keep sessionStorage updated with in-progress draft changes
  useEffect(() => {
    if (!hasRestoredDraft || typeof window === 'undefined' || !shortCode) return;
    try {
      sessionStorage.setItem(
        `edit_draft_${type}_${shortCode}`,
        JSON.stringify({
          title,
          tags,
          destinationUrl,
          customBackHalf,
        })
      );
    } catch {}
  }, [title, tags, destinationUrl, customBackHalf, hasRestoredDraft, shortCode, type]);

  const handleCustomizeNavigation = () => {
    if (typeof window !== 'undefined' && shortCode) {
      try {
        sessionStorage.setItem(
          `edit_draft_${type}_${shortCode}`,
          JSON.stringify({
            title,
            tags,
            destinationUrl,
            customBackHalf,
          })
        );
      } catch {}
    }
    router.push(`/qrcodes/${shortCode}/edit/customize?from=edit`);
  };

  const handleCancelClick = () => {
    if (typeof window !== 'undefined' && shortCode) {
      sessionStorage.removeItem(`edit_draft_${type}_${shortCode}`);
    }
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const handleResetConfirm = () => {
    if (typeof window !== 'undefined' && shortCode) {
      sessionStorage.removeItem(`edit_draft_${type}_${shortCode}`);
    }
    setTitle(initialTitle);
    setTags(initialTags);
    setDestinationUrl(initialDestinationUrl);
    setCustomBackHalf(shortCode);
    setIsResetModalOpen(false);
    toast.success('Restored to original saved values');
  };

  const handleDiscardAndLeave = () => {
    if (typeof window !== 'undefined' && shortCode) {
      sessionStorage.removeItem(`edit_draft_${type}_${shortCode}`);
    }
    setIsUnsavedModalOpen(false);
    if (pendingUrl) {
      router.push(pendingUrl);
    }
  };

  const handleSaveAndLeave = async () => {
    setIsSavingAndLeaving(true);
    try {
      if (typeof window !== 'undefined' && shortCode) {
        sessionStorage.removeItem(`edit_draft_${type}_${shortCode}`);
      }
      if (onSave) {
        await onSave({
          title,
          tags,
          destinationUrl,
          customBackHalf: customBackHalf.trim() !== shortCode ? customBackHalf.trim() : undefined,
        });
      }
      setIsUnsavedModalOpen(false);
      if (pendingUrl) {
        router.push(pendingUrl);
      }
    } catch {
      // Handled in mutation
    } finally {
      setIsSavingAndLeaving(false);
    }
  };

  const normalizedSvg = useMemo(() => {
    if (!qrPreviewSvg) return null;
    let svg = qrPreviewSvg;
    if (!svg.includes('viewBox')) {
      svg = svg.replace(
        /<svg\s+([^>]*?)width="(\d+)"\s+height="(\d+)"([^>]*?)>/i,
        '<svg $1viewBox="0 0 $2 $3" width="100%" height="100%"$4>'
      );
    }
    const sfx = `_${shortCode}`;
    if (shortCode && !svg.includes(sfx)) {
      svg = svg.replace(/id="([^"]+)"/g, `id="$1${sfx}"`);
      svg = svg.replace(/url\('#([^']+)'\)/g, `url('#$1${sfx}')`);
      svg = svg.replace(/url\(#([^)]+)\)/g, `url(#$1${sfx})`);
      svg = svg.replace(/href="#([^"]+)"/g, `href="#$1${sfx}"`);
      svg = svg.replace(/xlink:href="#([^"]+)"/g, `xlink:href="#$1${sfx}"`);
    }
    return svg;
  }, [qrPreviewSvg, shortCode]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Short link copied to clipboard!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && shortCode) {
      sessionStorage.removeItem(`edit_draft_${type}_${shortCode}`);
    }
    if (onSave) {
      const targetUrl = await onSave({
        title,
        tags,
        destinationUrl,
        customBackHalf: customBackHalf.trim() !== shortCode ? customBackHalf.trim() : undefined,
      });
      if (typeof targetUrl === 'string') {
        router.push(targetUrl);
      } else {
        router.push(isQrMode ? '/qrcodes' : '/links');
      }
    } else {
      toast.success(`${isQrMode ? 'QR Code' : 'Link'} changes saved successfully!`);
    }
  };

  return (
    <>
      <div className="-mx-6 -my-6 sm:-mx-12 sm:-my-8 lg:-mx-16 lg:-my-10 p-6 sm:p-12 lg:p-16 min-h-[calc(100vh-3.5rem)] bg-white dark:bg-slate-900 transition-colors">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Edit Form Cards */}
          <form onSubmit={handleSubmit} className={`${isQrMode ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl'} space-y-8`}>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100 mb-2">
            {isQrMode ? 'Edit QR Code' : 'Edit link'}
          </h1>

          {/* SECTION 1: Details / Short link section */}
          <div className="space-y-6">
            {isQrMode && (
              <h2 className="text-xl font-bold text-[#273144] dark:text-slate-100">
                Details
              </h2>
            )}

            {/* Link Edit Banner Warning (Matching Bitly exact alert) */}
            {!isQrMode && showAlert && (
              <aside className="relative flex items-start gap-3 rounded-xl border border-[#cce0ff] bg-[#edf4ff] p-4 dark:border-blue-900/80 dark:bg-blue-950/40 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 text-[#1d4cc9] dark:text-blue-300 mt-0.5" />
                <div className="flex-1 text-[#273144] dark:text-slate-200 leading-relaxed">
                  Editing your short link will create a new, separate short link. The current short link will remain active and continue to point to the same destination.{' '}
                  <a
                    href="https://support.bitly.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#1d4cc9] hover:underline dark:text-blue-300"
                  >
                    Learn more
                  </a>.
                </div>
                <button
                  type="button"
                  onClick={() => setShowAlert(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                  aria-label="Close alert"
                >
                  <X className="h-4 w-4" />
                </button>
              </aside>
            )}

            {/* Short link row */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
                Short link
              </label>

              {isQrMode ? (
                /* QR Mode Short link display */
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#273144] dark:text-slate-100">
                    {shortUrl.replace(/^https?:\/\//, '')}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 rounded-md text-slate-500 hover:text-[#2a5bd7] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Copy short link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                /* Link Mode Short link with Edit back-half button */
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#273144] dark:text-slate-100">
                    {shortUrl.replace(/^https?:\/\//, '')}
                  </span>

                  {isEditingBackHalf ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-slate-300 bg-white px-2.5 shadow-2xs focus-within:border-[#2a5bd7] focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-700 dark:bg-slate-800">
                        <span className="text-xs font-semibold text-slate-400 select-none">
                          {shortUrl.replace(new RegExp(`/${shortCode}$`), '/') || 'trim.ly/'}
                        </span>
                        <input
                          type="text"
                          value={customBackHalf}
                          onChange={(e) => setCustomBackHalf(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                          className="h-8 w-32 bg-transparent text-sm font-semibold text-slate-800 focus:outline-hidden dark:text-slate-100"
                          autoFocus
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingBackHalf(false);
                          toast.success('Custom back-half updated! Click Save to apply.');
                        }}
                        className="h-8 px-3 rounded-lg bg-[#2a5bd7] text-xs font-bold text-white hover:bg-[#1d4cc9] cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingBackHalf(true);
                        setShowAlert(true);
                        if (onEditBackHalfClick) onEditBackHalfClick();
                      }}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer dark:text-blue-400"
                    >
                      <Edit2 className="h-4 w-4" />
                      <span>Edit back-half</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* If Link mode: Optional details header divider */}
            {!isQrMode && (
              <>
                {/* Destination URL row for Link Mode */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
                    Destination URL
                  </label>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {isEditingDestination ? (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="url"
                          value={destinationUrl}
                          onChange={(e) => setDestinationUrl(e.target.value)}
                          className="flex-1 h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:ring-2 focus:ring-blue-100 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                          placeholder="https://example.com"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setIsEditingDestination(false)}
                          className="h-10 px-4 rounded-lg bg-[#2a5bd7] text-xs font-bold text-white hover:bg-[#1d4cc9] cursor-pointer"
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium text-[#273144] dark:text-slate-200 break-all max-w-lg leading-relaxed">
                          {destinationUrl || 'No destination URL set'}
                        </span>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => setIsEditingDestination(true)}
                            className="inline-flex items-center gap-1 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer dark:text-blue-400"
                            title="Edit destination URL"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span>Edit</span>
                          </button>

                          <a
                            href={destinationUrl?.startsWith('http') ? destinationUrl : `https://${destinationUrl || ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer dark:text-blue-400"
                          >
                            <CornerDownRight className="h-4 w-4" />
                            <span>Redirect</span>
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <hr className="border-slate-200 dark:border-slate-800 my-6" />

                <h3 className="text-lg font-bold text-[#273144] dark:text-slate-100">
                  Optional details
                </h3>
              </>
            )}

            {/* Title Input Field */}
            <div className="space-y-1.5">
              <label htmlFor="edit-title" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                Title
              </label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder=""
                maxLength={2048}
                className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:ring-2 focus:ring-blue-100 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Tags Select Field with Pill Tags */}
            <div className="space-y-1.5">
              <label htmlFor="edit-tags" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                Tags
              </label>

              <div className="flex min-h-11 w-full flex-wrap items-center gap-2 rounded-lg border border-slate-300 bg-white p-2 shadow-2xs focus-within:border-[#2a5bd7] focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-700 dark:bg-slate-800">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 cursor-pointer p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                <input
                  id="edit-tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={tags.length === 0 ? 'Select tags' : 'Add tag...'}
                  className="flex-1 min-w-[120px] bg-transparent px-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Content (QR Mode only) */}
          {isQrMode && (
            <div className="space-y-6 pt-4">
              <h2 className="text-xl font-bold text-[#273144] dark:text-slate-100">
                Content
              </h2>

              {/* Scan Destination */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
                  Scan destination
                </label>
                <div className="flex items-center gap-2 text-sm font-bold text-[#273144] dark:text-slate-100">
                  <svg viewBox="0 0 20 20" height="18" width="18" fill="currentColor">
                    <path d="M4.917 8.833c-.5-.583-.75-1.25-.75-1.916 0-.75.25-1.417.833-1.917 1-1 2.833-1 3.833 0l1.834 1.833a.805.805 0 001.166 0 .805.805 0 000-1.166L10 3.75C9.167 3 8 2.5 6.833 2.5c-1.166 0-2.25.5-3.083 1.25-.833.833-1.25 2-1.25 3.167 0 1.166.417 2.25 1.25 3.083l1.833 1.833a.9.9 0 00.584.25.9.9 0 00.583-.25.805.805 0 000-1.166L4.917 8.833zM16.25 10l-1.833-1.833a.806.806 0 00-1.167 0 .806.806 0 000 1.166l1.833 1.917c.5.5.834 1.167.834 1.917s-.25 1.416-.834 1.916c-1.083 1.084-2.75 1.084-3.833 0L9.417 13.25a.806.806 0 00-1.167 0 .806.806 0 000 1.167l1.833 1.833c.834.833 2 1.25 3.084 1.25 1.083 0 2.25-.417 3.083-1.25.833-.833 1.25-1.917 1.25-3.083 0-1.25-.417-2.334-1.25-3.167z" />
                    <path d="M12.25 12.25a.756.756 0 01-.583.25.757.757 0 01-.584-.25L7.75 8.917a.806.806 0 010-1.167.806.806 0 011.167 0l3.333 3.333a.806.806 0 010 1.167z" />
                  </svg>
                  <span>Website</span>
                </div>
              </div>

              {/* Destination URL row */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
                  Destination
                </label>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  {isEditingDestination ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="url"
                        value={destinationUrl}
                        onChange={(e) => setDestinationUrl(e.target.value)}
                        className="flex-1 h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:ring-2 focus:ring-blue-100 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        placeholder="https://example.com"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setIsEditingDestination(false)}
                        className="h-10 px-4 rounded-lg bg-[#2a5bd7] text-xs font-bold text-white hover:bg-[#1d4cc9] cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-[#273144] dark:text-slate-200 break-all max-w-lg leading-relaxed">
                        {destinationUrl || 'No destination URL set'}
                      </span>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsEditingDestination(true)}
                          className="inline-flex items-center gap-1 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer dark:text-blue-400"
                          title="Edit destination URL"
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Edit</span>
                        </button>

                        <a
                          href={destinationUrl?.startsWith('http') ? destinationUrl : `https://${destinationUrl || ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer dark:text-blue-400"
                        >
                          <CornerDownRight className="h-4 w-4" />
                          <span>Redirect</span>
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons: Save changes & Cancel & Reset to original */}
          <div className="flex flex-wrap items-center gap-4 pt-6">
            <button
              type="submit"
              className="h-10 px-6 rounded-lg bg-[#2a5bd7] font-bold text-white text-sm hover:bg-[#1d4cc9] shadow-2xs transition-colors cursor-pointer"
            >
              {isQrMode ? 'Save changes' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancelClick}
              className="h-10 px-4 rounded-lg text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {isDirty && (
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer dark:text-blue-400 sm:ml-auto"
                title="Discard all un-saved changes and restore original values"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset to original</span>
              </button>
            )}
          </div>
        </form>

        {/* Right Column: Preview Column (QR Code Preview only for QR Mode) */}
        {isQrMode && (
          <div className="lg:col-span-5 self-start sticky top-6">
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200/90 bg-[#f4f6f8] p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900/60 min-h-[380px] sm:min-h-[420px] space-y-4">
              <h3 className="text-base font-bold text-[#273144] dark:text-slate-200 text-center">
                Preview
              </h3>

              <div className="relative group flex items-center justify-center rounded-xl bg-white p-4 shadow-sm border border-slate-100 dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
                {normalizedSvg ? (
                  <div
                    className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                    dangerouslySetInnerHTML={{ __html: normalizedSvg }}
                  />
                ) : (
                  <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                )}
              </div>

              {/* Action Link under preview image - Customize Button matching details page */}
              <button
                type="button"
                onClick={handleCustomizeNavigation}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer"
              >
                <Palette className="h-4 w-4" />
                <span>Customize</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>

      <ResetDraftModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
      />

      <UnsavedChangesModal
        isOpen={isUnsavedModalOpen}
        onClose={() => {
          setIsUnsavedModalOpen(false);
          setPendingUrl(null);
        }}
        onDiscard={handleDiscardAndLeave}
        onSaveAndProceed={handleSaveAndLeave}
        isSaving={isSavingAndLeaving}
      />
    </>
  );
};
