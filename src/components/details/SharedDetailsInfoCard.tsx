'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Copy, CornerDownRight, Tag, PlusCircle, Globe } from 'lucide-react';
import { toast } from 'sonner';

export interface SharedDetailsInfoCardProps {
  type: 'link' | 'qrcode';
  shortCode: string;
  destinationUrl: string;
  createdOn: string;
  tags?: string[];
  scanDestinationText?: string;
  visibleAsLink?: boolean;
}

export const SharedDetailsInfoCard: React.FC<SharedDetailsInfoCardProps> = ({
  type,
  shortCode,
  destinationUrl,
  createdOn,
  tags = [],
  scanDestinationText = 'Website / URL',
  visibleAsLink = true,
}) => {
  const router = useRouter();
  const isQrMode = type === 'qrcode';
  const displayShortLink = `trim.ly/${shortCode}`;

  const handleCopyShortLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://${displayShortLink}`);
      toast.success('Short link copied to clipboard!');
    }
  };

  return (
    <div className="h-full w-full rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-6 flex flex-col justify-between">
      <h2 className="text-xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
        Details
      </h2>

      <div className="space-y-5">
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
                href={`https://${displayShortLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-[#2a5bd7] hover:underline"
              >
                {displayShortLink}
              </a>
              <button
                type="button"
                onClick={handleCopyShortLink}
                title="Copy short link"
                className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Destination */}
        <div className="space-y-1">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
            Destination
          </span>
          <div className="flex items-start gap-2 text-sm font-medium text-[#273144] dark:text-slate-200">
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
        </div>

        {/* Tags */}
        <div className="space-y-1">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
            Tags
          </span>
          <div className="flex items-center gap-3 text-sm font-medium text-[#526281] dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-slate-400" />
              {tags.length > 0 ? (
                <span className="text-[#273144] dark:text-slate-200 font-semibold">{tags.join(', ')}</span>
              ) : (
                <span>No tags</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => router.push(isQrMode ? `/qrcodes/${shortCode}/edit` : `/links/${shortCode}/edit`)}
              className="text-[#2a5bd7] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add tag</span>
            </button>
          </div>
        </div>

        {/* Created On */}
        <div className="space-y-1">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#526281] dark:text-slate-400">
            Created on
          </span>
          <p className="text-sm font-medium text-[#273144] dark:text-slate-200">
            {createdOn}
          </p>
        </div>
      </div>
    </div>
  );
};
