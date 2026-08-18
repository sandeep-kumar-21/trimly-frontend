'use client';

import React, { useState } from 'react';
import { useCreateLink } from '@/hooks/useCreateLink';
import { HelpCircle, Palette, Layers } from 'lucide-react';
import { LinkIcon, QrCodeIcon } from '@/components/icons/AppIcons';
import Link from 'next/link';

import { useCreateQrCode } from '@/hooks/useQRCodes';

export const QuickCreateBar: React.FC = () => {
  const [url, setUrl] = useState('');
  const [alsoCreateQr, setAlsoCreateQr] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');
  const createLinkMutation = useCreateLink();
  const createQrCodeMutation = useCreateQrCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      if (activeTab === 'link') {
        const newLink = await createLinkMutation.mutateAsync({ longUrl: formattedUrl });
        if (alsoCreateQr) {
          await createQrCodeMutation.mutateAsync({
            shortCode: newLink.shortCode,
            createLink: true,
            qrConfig: {
              dotsStyle: 'square',
              cornersStyle: 'square',
              dotsColor: '#000000',
              backgroundColor: '#ffffff',
            },
          });
          if (typeof window !== 'undefined') {
            localStorage.setItem(`qr_created_${newLink.shortCode.toLowerCase()}`, 'true');
          }
        }
      } else {
        const newQr = await createQrCodeMutation.mutateAsync({
          longUrl: formattedUrl,
          createLink: alsoCreateQr,
          qrConfig: {
            dotsStyle: 'square',
            cornersStyle: 'square',
            dotsColor: '#000000',
            backgroundColor: '#ffffff',
          },
        });
        if (typeof window !== 'undefined' && newQr?.qrCode?.shortCode) {
          localStorage.setItem(`qr_created_${newQr.qrCode.shortCode.toLowerCase()}`, 'true');
        }
      }

      setUrl('');
    } catch {
      // Handled in mutation onError
    }
  };

  return (
    <div className="space-y-5 w-full overflow-hidden">
      {/* Switch Button (Exact Bitly Design - Smooth Sliding White Pill) */}
      <div className="flex justify-center pb-2">
        <div className="relative inline-flex items-center gap-3 p-1">
          {/* Smooth Sliding White Pill Indicator */}
          <div
            className="absolute top-1 bottom-1 w-[140px] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-slate-200/60 dark:bg-slate-900 dark:border-slate-800 transition-transform duration-300 ease-in-out pointer-events-none"
            style={{
              transform: activeTab === 'link' ? 'translateX(0px)' : 'translateX(152px)',
            }}
          />

          <button
            type="button"
            onClick={() => setActiveTab('link')}
            className={`relative z-10 cursor-pointer w-[140px] h-11 flex items-center justify-center gap-2 rounded-full text-sm font-bold transition-colors duration-300 select-none ${
              activeTab === 'link'
                ? 'text-[#273144] dark:text-slate-100'
                : 'text-[#526281] hover:text-[#273144] dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <LinkIcon className={`h-5 w-5 transition-colors duration-300 ${activeTab === 'link' ? 'text-[#273144] dark:text-slate-100' : 'text-[#526281]'}`} />
            Short link
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`relative z-10 cursor-pointer w-[140px] h-11 flex items-center justify-center gap-2 rounded-full text-sm font-bold transition-colors duration-300 select-none ${
              activeTab === 'qr'
                ? 'text-[#273144] dark:text-slate-100'
                : 'text-[#526281] hover:text-[#273144] dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <QrCodeIcon className={`h-5 w-5 transition-colors duration-300 ${activeTab === 'qr' ? 'text-[#273144] dark:text-slate-100' : 'text-[#526281]'}`} />
            QR Code
          </button>
        </div>
      </div>

      {/* Main Two-Column Card Grid matching Bitly exact scale (100% responsive) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 rounded-xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-2xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Left Column: Quick Create Form */}
        <div className="xl:col-span-7 2xl:col-span-8 min-w-0 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
                Quick create: {activeTab === 'link' ? 'Short link' : 'QR Code'}
              </h2>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#526281] dark:text-slate-400">
                {activeTab === 'link' ? (
                  <span>
                    You can create <strong className="font-bold text-[#273144] dark:text-slate-100">50</strong> more links this month.
                  </span>
                ) : (
                  <span>
                    You can create <strong className="font-bold text-[#273144] dark:text-slate-100">2</strong> more QR Codes this month.
                  </span>
                )}
                <div className="group relative cursor-pointer">
                  <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
                  <div className="absolute right-0 bottom-full mb-2 hidden w-60 rounded-md bg-slate-900 p-2.5 text-sm text-white shadow-lg group-hover:block z-20">
                    Your current plan includes monthly limits.{' '}
                    <Link href="/settings" className="text-blue-400 underline font-semibold">Upgrade for more</Link>.
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {/* Domain Field Simulator (Only visible on Short Link tab as in Bitly) */}
              {activeTab === 'link' && (
                <div className="flex items-center gap-2.5 text-sm">
                  <span className="text-[#526281] font-medium">Domain:</span>
                  <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-bold text-[#273144] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    trim.ly
                  </div>
                </div>
              )}

              {/* URL Input & Submit Button */}
              <div>
                <label htmlFor="quick-create-input" className="block text-sm font-bold text-[#273144] dark:text-slate-200 mb-1.5">
                  Enter your destination URL
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    id="quick-create-input"
                    type="text"
                    placeholder="https://example.com/my-long-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full min-w-0 flex-1 h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={createLinkMutation.isPending}
                    className="h-11 px-5 sm:px-6 text-sm font-bold rounded-lg bg-[#2a5bd7] text-white hover:bg-[#1a4bb7] transition-colors shadow-2xs disabled:opacity-50 whitespace-nowrap cursor-pointer shrink-0 w-full sm:w-auto"
                  >
                    {createLinkMutation.isPending
                      ? 'Creating...'
                      : `Create your Trimly ${activeTab === 'link' ? 'link' : 'code'}`}
                  </button>
                </div>
              </div>

              {/* Also Create Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  id="qr-code-checkbox"
                  type="checkbox"
                  checked={alsoCreateQr}
                  onChange={(e) => setAlsoCreateQr(e.target.checked)}
                  className="h-4 w-4 rounded-xs border-slate-300 text-[#2a5bd7] focus:ring-[#2a5bd7] cursor-pointer"
                />
                <label htmlFor="qr-code-checkbox" className="text-sm font-medium text-[#273144] dark:text-slate-300 cursor-pointer select-none">
                  {activeTab === 'link'
                    ? 'Also create a QR Code for this link'
                    : 'Also create a link for this QR Code'}
                </label>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: AI Assistant Card (Simplify your workflow) */}
        <div className="xl:col-span-5 2xl:col-span-4 w-full rounded-xl border border-slate-200/50 bg-gradient-to-br from-[#edf7fc] via-[#f5eeea] to-[#fff4ec] p-5 shadow-2xs dark:border-slate-800 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 flex flex-col justify-between overflow-hidden">
          <div className="space-y-3">
            {/* Header with Bitly exact Sparkles SVG gradient */}
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M16.3636 7.27273L17.5 4.77273L20 3.63636L17.5 2.5L16.3636 0L15.2273 2.5L12.7273 3.63636L15.2273 4.77273L16.3636 7.27273ZM9.54545 7.72727L7.27273 2.72727L5 7.72727L0 10L5 12.2727L7.27273 17.2727L9.54545 12.2727L14.5455 10L9.54545 7.72727ZM16.3636 12.7273L15.2273 15.2273L12.7273 16.3636L15.2273 17.5L16.3636 20L17.5 17.5L20 16.3636L17.5 15.2273L16.3636 12.7273Z" fill="url(#ai_sparkles_grad)"></path>
                <defs>
                  <linearGradient id="ai_sparkles_grad" x1="0.182173" y1="0.181841" x2="19.8185" y2="19.8182" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#219ACD"></stop>
                    <stop offset="0.5" stopColor="#A950A4"></stop>
                    <stop offset="1" stopColor="#FF950A"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <h3 className="text-base font-bold text-[#273144] dark:text-slate-100">Simplify your workflow</h3>
            </div>
            <p className="text-xs text-[#526281] dark:text-slate-400">
              {activeTab === 'link'
                ? 'Explore smarter ways to create links.'
                : 'Explore smarter ways to create QR Codes.'}
            </p>

            {/* Pill Buttons list matching Bitly exact size and icon SVGs */}
            <div className="flex flex-col sm:flex-row xl:flex-col flex-wrap gap-2 pt-1">
              {activeTab === 'link' ? (
                <>
                  <button
                    type="button"
                    className="w-fit max-w-full flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#273144] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 truncate"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <path fill="#A950A4" d="M14.467 3c.066 0 .133.067.133.134.067.066.067.133.067.2 0 .066 0 .133-.067.2a.143.143 0 0 1-.133.133l-1 .466-.467 1a.143.143 0 0 1-.133.134c-.067.066-.134.066-.2.066-.067 0-.134 0-.2-.066a.143.143 0 0 1-.134-.134l-.466-1-1-.466a.143.143 0 0 1-.134-.133c-.066-.067-.066-.134-.066-.2 0-.067 0-.134.066-.2 0-.067.067-.134.134-.134l1-.466.466-1c0-.067.067-.134.134-.134.066-.066.133-.066.2-.066.066 0 .133 0 .2.066.066 0 .133.067.133.134l.467 1zM3.333 5.534c0 .533.2 1.066.6 1.533L5.4 8.534a.644.644 0 0 1 0 .933.72.72 0 0 1-.467.2.72.72 0 0 1-.466-.2L3 8c-.667-.667-1-1.533-1-2.466S2.333 3.667 3 3c.667-.6 1.533-1 2.467-1C6.4 2 7.333 2.4 8 3l1.467 1.534a.644.644 0 0 1 0 .933.644.644 0 0 1-.934 0L7.067 4C6.267 3.2 4.8 3.2 4 4c-.467.4-.667.934-.667 1.534M10.533 6.534a.645.645 0 0 1 .934 0l1.466 1.533c.667.666 1 1.533 1 2.467 0 .933-.333 1.8-1 2.466-.666.667-1.6 1-2.466 1s-1.8-.333-2.467-1l-1.467-1.466a.644.644 0 0 1 0-.934.644.644 0 0 1 .934 0l1.466 1.467c.867.867 2.2.867 3.067 0 .467-.4.667-.934.667-1.533 0-.6-.267-1.134-.667-1.534l-1.467-1.533a.645.645 0 0 1 0-.933"></path>
                      <path fill="#A950A4" d="M9.333 10c.2 0 .334-.066.467-.2a.644.644 0 0 0 0-.933L7.133 6.2a.644.644 0 0 0-.933 0 .644.644 0 0 0 0 .933L8.867 9.8c.133.133.266.2.466.2"></path>
                    </svg>
                    <span className="truncate">Personalize a short link</span>
                  </button>
                  <button
                    type="button"
                    className="w-fit max-w-full flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#273144] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 truncate"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#219ACD" className="shrink-0">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="truncate">Make a unique link for every post</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="w-fit max-w-full flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#273144] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 truncate"
                  >
                    <Palette className="h-3.5 w-3.5 text-[#A950A4] shrink-0" />
                    <span className="truncate">Customize a QR Code</span>
                  </button>
                  <button
                    type="button"
                    className="w-fit max-w-full flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#273144] shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 truncate"
                  >
                    <Layers className="h-3.5 w-3.5 text-[#219ACD] shrink-0" />
                    <span className="truncate">Bulk create QR Codes</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
