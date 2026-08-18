import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}) => {
  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center space-y-2">
        <Link href="/" className="flex items-center justify-center mb-2 group">
          <Image
            src="/trimly-logo.svg"
            alt="Trimly Logo"
            width={140}
            height={38}
            priority
            className="h-10 w-auto"
          />
        </Link>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">
        {children}
      </div>

      {/* Footer Link */}
      {footerText && footerLinkText && footerLinkHref && (
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          {footerText}{' '}
          <Link
            href={footerLinkHref}
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 underline"
          >
            {footerLinkText}
          </Link>
        </div>
      )}
    </div>
  );
};
