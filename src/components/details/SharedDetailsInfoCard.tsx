'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Check, CornerDownRight, Tag, PlusCircle, Globe, ExternalLink, Link2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/utils/clipboard';

export interface SharedDetailsInfoCardProps {
  type: 'link' | 'qrcode';
  shortCode: string;
  destinationUrl: string;
  shortUrl?: string;
  createdOn: string;
  tags?: string[];
  scanDestinationText?: string;
  visibleAsLink?: boolean;
}

export const SharedDetailsInfoCard: React.FC<SharedDetailsInfoCardProps> = ({
  type,
  shortCode,
  destinationUrl,
  shortUrl,
  createdOn,
  tags = [],
  scanDestinationText = 'Website / URL',
  visibleAsLink = true,
}) => {
  const router = useRouter();
  const isQrMode = type === 'qrcode';
  const displayShortLink = `trim.ly/${shortCode}`;

  const targetRedirectUrl =
    shortUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.hostname}:4000/${shortCode}`
      : `http://localhost:4000/${shortCode}`);

  const [copied, setCopied] = useState(false);
  const [destCopied, setDestCopied] = useState(false);

  const handleCopyShortLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(targetRedirectUrl);
    if (success) {
      setCopied(true);
      toast.success('Short link copied to clipboard!', { description: targetRedirectUrl });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error('Failed to copy short link');
    }
  };

  const handleCopyDestination = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(destinationUrl);
    if (success) {
      setDestCopied(true);
      toast.success('Destination URL copied!');
      setTimeout(() => setDestCopied(false), 2000);
    } else {
      toast.error('Failed to copy destination URL');
    }
  };

  return (
    <div className="h-full w-full rounded-xl border border-slate-200/80 bg-white p-4.5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-start space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h2 className="text-xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
          Details
        </h2>
        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          Active
        </span>
      </div>

      <div className="space-y-4">
        {/* QR Code Scan Destination label if QR mode */}
        {isQrMode && (
          <div className="space-y-1">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
              Scan destination
            </span>
            <div className="flex items-center gap-2 text-sm font-bold text-[#273144] dark:text-slate-100">
              <Globe className="h-4 w-4 text-slate-500" />
              <span>{scanDestinationText}</span>
            </div>
          </div>
        )}

        {/* Short Link - only shown if link is visible */}
        {(!isQrMode || visibleAsLink !== false) && (
          <div className="space-y-1">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
              Short link
            </span>
            <div className="flex items-center gap-2">
              <a
                href={targetRedirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-[#2a5bd7] hover:underline flex items-center gap-1.5"
              >
                <span>{displayShortLink}</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#2a5bd7]/70" />
              </a>
              <button
                type="button"
                onClick={handleCopyShortLink}
                title="Copy short link"
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Destination */}
        <div className="space-y-1">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
            Destination
          </span>
          <div className="flex items-start justify-between gap-2 text-sm font-medium text-[#273144] dark:text-slate-200 group">
            <div className="flex items-start gap-2 min-w-0">
              <CornerDownRight className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
              <a
                href={destinationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[#273144] dark:text-slate-200 break-all leading-snug"
              >
                {destinationUrl}
              </a>
            </div>
            <button
              type="button"
              onClick={handleCopyDestination}
              title="Copy destination URL"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 opacity-80 hover:opacity-100 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              {destCopied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
            Tags
          </span>
          <div className="flex items-center gap-3 text-sm font-medium text-[#526281] dark:text-slate-400 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Tag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              {tags.length > 0 ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-400">No tags</span>
              )}
            </div>
            {tags.length < 10 ? (
              <button
                type="button"
                onClick={() => router.push(isQrMode ? `/qrcodes/${shortCode}/edit` : `/links/${shortCode}/edit`)}
                className="text-[#2a5bd7] font-bold hover:underline flex items-center gap-1 text-xs cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add tag</span>
              </button>
            ) : (
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                (10/10 max)
              </span>
            )}
          </div>
        </div>

        {/* Created On */}
        <div className="space-y-1">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
            Created on
          </span>
          <div className="flex items-center gap-2 text-sm font-medium text-[#273144] dark:text-slate-200">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>{createdOn}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
