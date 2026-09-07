'use client';

import React from 'react';
import Link from 'next/link';

export interface SharedPageHeaderProps {
  title: string;
  createButtonText: string;
  onCreateClick?: () => void;
  createHref?: string;
}

export const SharedPageHeader: React.FC<SharedPageHeaderProps> = ({
  title,
  createButtonText,
  onCreateClick,
  createHref,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#273144] dark:text-slate-100">
        {title}
      </h1>
      {createHref ? (
        <Link
          href={createHref}
          onClick={onCreateClick}
          className="h-10 px-5 rounded-md bg-[#2a5bd7] text-white text-sm font-bold hover:bg-[#1a4bb7] transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
        >
          {createButtonText}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onCreateClick}
          className="h-10 px-5 rounded-md bg-[#2a5bd7] text-white font-bold text-sm hover:bg-[#1a4bb7] transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
        >
          {createButtonText}
        </button>
      )}
    </div>
  );
};
