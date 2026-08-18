'use client';

import { Toaster as SonnerToaster } from 'sonner';

export const ToastProvider = () => {
  return (
    <SonnerToaster
      position="bottom-right"
      style={{
        bottom: '12px',
        right: '16px',
      }}
      toastOptions={{
        style: {
          background: 'var(--toast-bg, #ffffff)',
          color: '#0f172a',
          border: '1px solid #e2e8f0',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
          fontSize: '0.875rem',
          padding: '0.875rem 1rem',
        },
        className: 'font-sans dark:!bg-slate-900 dark:!text-slate-100 dark:!border-slate-800',
      }}
    />
  );
};
