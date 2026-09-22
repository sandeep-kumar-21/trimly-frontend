'use client';

import React from 'react';
import Link from 'next/link';
import { QrCode, CheckCircle2, X } from 'lucide-react';

export interface QrDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrDetailsModal: React.FC<QrDetailsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    'Customizable colors, patterns, and logos',
    'Dynamic QR Codes you can edit anytime',
    'High-resolution PNG/SVG vector downloads',
    'Bulk QR Code creation and tag organization',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border-2 border-[#081638] bg-orange-50 text-[#f26522] shadow-xs">
              <QrCode className="h-6 w-6 stroke-[2.2]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#081638] tracking-tight">
              QR Codes
            </h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Generate dynamic, custom QR Codes you can update anytime.
          </p>
        </div>

        {/* Features Checklist with Orange Checkmarks (matching Bitly Image 4) */}
        <div className="space-y-3 pt-2">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-[#f26522] flex items-center justify-center text-[#f26522] shrink-0">
                <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {feat}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons (matching Bitly Image 4) */}
        <div className="space-y-2.5 pt-4">
          <Link
            href="/register"
            onClick={onClose}
            className="w-full py-3 px-5 rounded-lg bg-[#0c56ec] hover:bg-[#0947c7] text-white text-sm font-bold text-center shadow-sm transition-colors block cursor-pointer"
          >
            Get started for free
          </Link>
          <Link
            href="/qrcodes"
            onClick={onClose}
            className="w-full py-3 px-5 rounded-lg border-2 border-[#0c56ec] text-[#0c56ec] hover:bg-blue-50 text-sm font-bold text-center transition-colors block cursor-pointer"
          >
            Learn more
          </Link>
        </div>
      </div>
    </div>
  );
};
