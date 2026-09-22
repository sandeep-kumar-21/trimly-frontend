'use client';

import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowRight, TrendingUp, Clock, Info } from 'lucide-react';
import { QrDetailsModal } from './QrDetailsModal';

export const QrCardMockup: React.FC = () => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <div className="p-6 sm:p-8 rounded-3xl bg-[#f4f3ef] border border-slate-200/80 shadow-md hover:shadow-lg transition-all space-y-5 flex flex-col justify-between h-full relative overflow-hidden group">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
            <span>QR Destination</span>
            <ArrowRight className="h-3 w-3 text-[#0c56ec]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 shadow-2xs">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+23% scan rate</span>
          </div>
        </div>

        {/* Center Stylized QR Card with Logo */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="p-4 rounded-2xl bg-white border-2 border-blue-500 shadow-md relative group/qr">
            <QRCodeCanvas
              value="https://trimly.link/summer-campaign"
              size={135}
              fgColor="#2563eb"
              bgColor="#ffffff"
              level="M"
              marginSize={1}
            />
            {/* Center Logo Pin */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-7 w-7 rounded-md bg-white border border-blue-300 shadow-xs flex items-center justify-center text-[10px] font-black text-blue-600">
                TM
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Expiration & Scans Row */}
        <div className="space-y-2">
          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span>Code expiration</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              Active
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Total scans</span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm">1,200</span>
              <button
                type="button"
                onClick={() => setDetailsOpen(true)}
                className="text-[11px] font-bold text-[#0c56ec] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Info className="h-3.5 w-3.5" />
                <span>Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal matching Image 4 */}
      <QrDetailsModal isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </>
  );
};
