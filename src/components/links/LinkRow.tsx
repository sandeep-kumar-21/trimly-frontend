'use client';

import React from 'react';
import { ShortLink } from '@/types/link.types';
import { CopyLinkButton } from './CopyLinkButton';
import { LinkActionsMenu } from './LinkActionsMenu';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/formatDate';
import { formatNumber } from '@/lib/utils/formatNumber';
import { ExternalLink, MousePointerClick, Calendar } from 'lucide-react';
import Link from 'next/link';

export interface LinkRowProps {
  link: ShortLink;
}

export const LinkRow: React.FC<LinkRowProps> = ({ link }) => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  const backendOrigin = apiBase.replace(/\/api\/?$/, '');
  const redirectUrl = `${backendOrigin}/${link.shortCode}`;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://trimly.link';
  const displayShortUrl = `${origin}/${link.shortCode}`;

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex flex-col space-y-1.5 min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`Redirect to ${link.longUrl}`}
            className="text-base font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
          >
            <span>/{link.shortCode}</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </a>
          <CopyLinkButton url={redirectUrl} size="sm" />
          {link.title && (
            <Badge variant="primary" className="text-[11px]">
              {link.title}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 truncate">
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <a
            href={link.longUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline truncate max-w-md"
            title={link.longUrl}
          >
            {link.longUrl}
          </a>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Created {formatDate(link.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 border-t border-slate-100 sm:border-t-0 pt-2 sm:pt-0 dark:border-slate-800">
        <Link
          href={`/links/${link.shortCode}`}
          title="View detailed link analytics"
          className="flex items-center gap-1.5 bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800 dark:hover:bg-indigo-950/40 transition-colors"
        >
          <MousePointerClick className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {formatNumber(link.clickCount)}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">clicks</span>
        </Link>

        <LinkActionsMenu link={link} />
      </div>
    </div>
  );
};
