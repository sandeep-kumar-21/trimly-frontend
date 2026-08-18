'use client';

import React from 'react';
import Link from 'next/link';
import { Link2, Plus } from 'lucide-react';

export const EmptyLinksState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 mb-4">
        <Link2 className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No links created yet</h3>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
        Create your first short link to simplify long URLs, share them easily, and track click analytics in real time.
      </p>
      <Link
        href="/links/create"
        className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-[#2a5bd7] text-white font-bold text-sm hover:bg-[#1a4bb7] transition-colors shadow-sm"
      >
        <Plus className="h-4 w-4" />
        <span>Create your first link</span>
      </Link>
    </div>
  );
};
