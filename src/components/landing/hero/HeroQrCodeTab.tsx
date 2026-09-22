'use client';

import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowRight, Download, Check, Sparkles, X as XIcon, MessageSquare } from 'lucide-react';

export const HeroQrCodeTab: React.FC = () => {
  const [destinationUrl, setDestinationUrl] = useState('https://trimly.link');
  const [pattern, setPattern] = useState<'square' | 'rounded' | 'dots'>('square');
  const [corner, setCorner] = useState<'square' | 'rounded'>('square');
  const [color, setColor] = useState('#081638');
  const [frame, setFrame] = useState<'none' | 'border' | 'badge' | 'bubble'>('none');
  const qrRef = useRef<HTMLDivElement>(null);

  const colors = [
    { label: 'Black', value: '#081638' },
    { label: 'Red', value: '#dc2626' },
    { label: 'Orange', value: '#ea580c' },
    { label: 'Green', value: '#16a34a' },
    { label: 'Sky', value: '#0ea5e9' },
    { label: 'Royal', value: '#2563eb' },
    { label: 'Purple', value: '#7c3aed' },
    { label: 'Magenta', value: '#db2777' },
  ];

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `trimly-qr-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-6 sm:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#081638] tracking-tight">
              Create a QR Code
            </h3>
          </div>

          {/* 1. URL Destination */}
          <div className="space-y-1.5">
            <label htmlFor="hero-qr-url-input" className="block text-sm font-bold text-slate-800">
              1. Enter your URL destination
            </label>
            <input
              id="hero-qr-url-input"
              type="text"
              placeholder="https://www.amazon.com/product/dp/B0CQPDTQ26"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c56ec] focus:border-transparent transition-all placeholder:text-slate-400 font-normal"
            />
          </div>

          {/* 2. Select Style */}
          <div className="space-y-2">
            <span className="block text-sm font-bold text-slate-800">
              2. Select a style <span className="text-xs font-normal text-slate-500">(optional)</span>
            </span>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-600">Pattern</span>
              <div className="flex items-center gap-2.5">
                {/* Pattern 1: Square */}
                <button
                  type="button"
                  onClick={() => setPattern('square')}
                  className={`p-2.5 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                    pattern === 'square' ? 'border-[#0c56ec] bg-blue-50/60 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  title="Square pattern"
                >
                  <div className="w-7 h-7 grid grid-cols-2 gap-0.5 p-0.5">
                    <span className="bg-slate-800 rounded-none" />
                    <span className="bg-slate-800 rounded-none" />
                    <span className="bg-slate-800 rounded-none" />
                    <span className="bg-slate-400 rounded-none" />
                  </div>
                </button>

                {/* Pattern 2: Rounded */}
                <button
                  type="button"
                  onClick={() => setPattern('rounded')}
                  className={`p-2.5 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                    pattern === 'rounded' ? 'border-[#0c56ec] bg-blue-50/60 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  title="Rounded pattern"
                >
                  <div className="w-7 h-7 grid grid-cols-2 gap-0.5 p-0.5">
                    <span className="bg-slate-800 rounded-xs" />
                    <span className="bg-slate-800 rounded-xs" />
                    <span className="bg-slate-800 rounded-xs" />
                    <span className="bg-slate-400 rounded-xs" />
                  </div>
                </button>

                {/* Pattern 3: Dots */}
                <button
                  type="button"
                  onClick={() => setPattern('dots')}
                  className={`p-2.5 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                    pattern === 'dots' ? 'border-[#0c56ec] bg-blue-50/60 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  title="Dots pattern"
                >
                  <div className="w-7 h-7 grid grid-cols-2 gap-1 p-0.5">
                    <span className="bg-slate-800 rounded-full" />
                    <span className="bg-slate-800 rounded-full" />
                    <span className="bg-slate-800 rounded-full" />
                    <span className="bg-slate-400 rounded-full" />
                  </div>
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1" />

                {/* Corners */}
                <button
                  type="button"
                  onClick={() => setCorner('square')}
                  className={`p-2.5 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                    corner === 'square' ? 'border-[#0c56ec] bg-blue-50/60 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  title="Square corners"
                >
                  <div className="w-6 h-6 border-2 border-slate-800 rounded-none flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-slate-800 rounded-none" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCorner('rounded')}
                  className={`p-2.5 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                    corner === 'rounded' ? 'border-[#0c56ec] bg-blue-50/60 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  title="Rounded corners"
                >
                  <div className="w-6 h-6 border-2 border-slate-800 rounded-md flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Choose Color */}
          <div className="space-y-2">
            <span className="block text-sm font-bold text-slate-800">
              3. Choose your color <span className="text-xs font-normal text-slate-500">(optional)</span>
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-7 w-7 rounded-full transition-all cursor-pointer flex items-center justify-center border-2 ${
                    color === c.value ? 'scale-115 border-slate-900 shadow-md ring-2 ring-blue-400/40' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                >
                  {color === c.value && <Check className="h-3.5 w-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Select Frame */}
          <div className="space-y-2">
            <span className="block text-sm font-bold text-slate-800">
              4. Select a frame <span className="text-xs font-normal text-slate-500">(optional)</span>
            </span>
            <div className="flex items-center gap-2.5">
              {/* Frame 1: None */}
              <button
                type="button"
                onClick={() => setFrame('none')}
                className={`w-11 h-11 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                  frame === 'none' ? 'border-[#0c56ec] bg-blue-50/60 text-[#0c56ec]' : 'border-slate-200 hover:border-slate-300 text-slate-500 bg-white'
                }`}
                title="No frame"
              >
                <XIcon className="h-5 w-5" />
              </button>

              {/* Frame 2: Square border */}
              <button
                type="button"
                onClick={() => setFrame('border')}
                className={`w-11 h-11 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                  frame === 'border' ? 'border-[#0c56ec] bg-blue-50/60' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
                title="Simple frame"
              >
                <div className="w-6 h-6 border-2 border-slate-700 rounded-xs" />
              </button>

              {/* Frame 3: Badge */}
              <button
                type="button"
                onClick={() => setFrame('badge')}
                className={`w-11 h-11 rounded-lg border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                  frame === 'badge' ? 'border-[#0c56ec] bg-blue-50/60' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
                title="Scan Me Badge"
              >
                <div className="w-6 h-4 border border-slate-700 rounded-t-xs" />
                <div className="w-6 bg-slate-700 text-[6px] text-white font-bold text-center leading-none py-0.5 rounded-b-xs">
                  SCAN
                </div>
              </button>

              {/* Frame 4: Speech bubble */}
              <button
                type="button"
                onClick={() => setFrame('bubble')}
                className={`w-11 h-11 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${
                  frame === 'bubble' ? 'border-[#0c56ec] bg-blue-50/60 text-[#0c56ec]' : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
                title="Speech bubble frame"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live QR Preview & Trust Badges (Matching Bitly Image 2) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-[#f7f6f2] border border-slate-200/80 space-y-5">
          {/* Canvas Wrapper */}
          <div
            ref={qrRef}
            className={`p-5 rounded-2xl bg-white shadow-md border flex flex-col items-center transition-all ${
              frame === 'border' ? 'border-2 border-slate-900' : 'border-slate-200'
            }`}
          >
            {frame === 'bubble' && (
              <div className="mb-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-wider uppercase">
                Scan Me
              </div>
            )}

            <QRCodeCanvas
              value={destinationUrl || 'https://trimly.link'}
              size={175}
              fgColor={color}
              bgColor="#ffffff"
              level="M"
              marginSize={1}
            />

            {frame === 'badge' && (
              <div className="mt-2 w-full py-1 rounded bg-[#081638] text-white text-[10px] font-bold text-center tracking-wider uppercase">
                Scan Me
              </div>
            )}

            <div className="mt-2 text-[10px] font-mono text-slate-400 text-center">
              trimly.link
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center font-medium">
            Note: This is a standard QR Code preview.
          </p>

          <button
            type="button"
            onClick={handleDownload}
            className="w-full py-3.5 px-6 rounded-md bg-[#0c56ec] hover:bg-[#0947c7] text-white font-bold text-sm shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Get your QR Code for free</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* G2 Leader Badges Row (as shown in Image 2) */}
          <div className="pt-2 grid grid-cols-3 gap-2 w-full text-center">
            <div className="p-2 rounded-lg bg-white border border-slate-200/70 shadow-2xs space-y-0.5">
              <div className="h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-bold mx-auto flex items-center justify-center">
                G
              </div>
              <div className="text-[10px] font-bold text-slate-800 leading-tight">Leader</div>
              <div className="text-[8px] text-slate-400">Winter 2026</div>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200/70 shadow-2xs space-y-0.5">
              <div className="h-4 w-4 rounded-full bg-amber-500 text-white text-[9px] font-bold mx-auto flex items-center justify-center">
                G
              </div>
              <div className="text-[10px] font-bold text-slate-800 leading-tight">Small Biz</div>
              <div className="text-[8px] text-slate-400">Leader 2026</div>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200/70 shadow-2xs space-y-0.5">
              <div className="h-4 w-4 rounded-full bg-blue-500 text-white text-[9px] font-bold mx-auto flex items-center justify-center">
                G
              </div>
              <div className="text-[10px] font-bold text-slate-800 leading-tight">Adoption</div>
              <div className="text-[8px] text-slate-400">Highest Rank</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
