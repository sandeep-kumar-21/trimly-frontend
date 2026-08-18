'use client';

import React from 'react';
import { ImagePlus, Plus, AlertTriangle } from 'lucide-react';
import { checkQrContrast } from '@/lib/utils/qrContrastValidator';

export interface QrCustomizerState {
  pattern: string;
  corner: string;
  presetColor: string;
  codeColor: string;
  bgColor: string;
  useQrColorForCorners: boolean;
  logoOption: string;
}

export interface QrCustomizerCardProps {
  customizerState: QrCustomizerState;
  onCustomizerStateChange: (newState: QrCustomizerState) => void;
}

// Preset color options
const COLOR_PRESETS = [
  { hex: '#000000', name: 'Black' },
  { hex: '#e12d2d', name: 'Red' },
  { hex: '#f27200', name: 'Orange' },
  { hex: '#0f9d45', name: 'Green' },
  { hex: '#1ba0e6', name: 'Light Blue' },
  { hex: '#2a5bd7', name: 'Royal Blue' },
  { hex: '#704bd7', name: 'Purple' },
  { hex: '#e0357c', name: 'Pink' },
];

// SVG Pattern Icons (Exact 6 dot styles from qr-code-styling)
const PATTERNS = [
  { id: 'p1', src: '/images/icons/p1.svg', alt: 'Square', title: 'Square (Default)' },
  { id: 'p2', src: '/images/icons/p2.svg', alt: 'Dots', title: 'Circular dots' },
  { id: 'p3', src: '/images/icons/p3.svg', alt: 'Rounded', title: 'Rounded squares' },
  { id: 'p4', src: '/images/icons/p4.svg', alt: 'Extra rounded', title: 'Extra rounded' },
  { id: 'p5', src: '/images/icons/p5.svg', alt: 'Classy', title: 'Classy diamond-cut' },
  { id: 'p6', src: '/images/icons/p6.svg', alt: 'Classy rounded', title: 'Classy rounded' },
];

// SVG Corner Icons (Exact 6 corner combinations from qr-code-styling)
const CORNERS = [
  { id: 'c1', src: '/images/icons/c1.svg', alt: 'Square Frame + Square Dot', title: 'Square frame with square dot' },
  { id: 'c2', src: '/images/icons/c2.svg', alt: 'Square Frame + Circular Dot', title: 'Square frame with round dot' },
  { id: 'c3', src: '/images/icons/c3.svg', alt: 'Rounded Frame + Square Dot', title: 'Rounded frame with square dot' },
  { id: 'c4', src: '/images/icons/c4.svg', alt: 'Rounded Frame + Circular Dot', title: 'Rounded frame with round dot' },
  { id: 'c5', src: '/images/icons/c5.svg', alt: 'Circular Frame + Circular Dot', title: 'Concentric circular rings' },
  { id: 'c6', src: '/images/icons/c6.svg', alt: 'Circular Frame + Square Dot', title: 'Circular frame with square dot' },
];

export const QrCustomizerCard: React.FC<QrCustomizerCardProps> = ({
  customizerState,
  onCustomizerStateChange,
}) => {
  const updateState = (key: keyof QrCustomizerState, value: any) => {
    onCustomizerStateChange({
      ...customizerState,
      [key]: value,
    });
  };

  return (
    <div className="space-y-8 rounded-xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1: Select styles */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-[#273144] dark:text-slate-100">
          Select styles
        </h2>

        {/* 1A. Patterns */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-[#273144] dark:text-slate-200">
            Patterns
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {PATTERNS.map((item) => {
              const isSelected =
                customizerState.pattern === item.id ||
                (customizerState.pattern === 'standard' && item.id === 'p1') ||
                (!customizerState.pattern && item.id === 'p1');
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`patterns-${item.id}`}
                  onClick={() => updateState('pattern', item.id)}
                  className={`relative flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all cursor-pointer p-2 overflow-hidden ${isSelected
                      ? 'border-[#2a5bd7] bg-white shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                    }`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-contain"
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer pt-1"
          >
            <Plus className="h-4 w-4" />
            <span>More</span>
          </button>
        </div>

        {/* 1B. Corners */}
        <div className="space-y-3 pt-2">
          <p className="text-sm font-bold text-[#273144] dark:text-slate-200">
            Corners
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {CORNERS.map((item) => {
              const isSelected =
                customizerState.corner === item.id ||
                (customizerState.corner === 'standard' && item.id === 'c1') ||
                (!customizerState.corner && item.id === 'c1');
              return (
                <button
                  key={item.id}
                  type="button"
                  id={`corners-${item.id}`}
                  onClick={() => updateState('corner', item.id)}
                  className={`relative flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all cursor-pointer p-2.5 overflow-hidden ${isSelected
                      ? 'border-[#2a5bd7] bg-white shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800'
                    }`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-contain"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2: Choose your colors */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-[#273144] dark:text-slate-100">
          Choose your colors
        </h2>

        {/* 2A. Presets */}
        <div className="space-y-3">
          <p className="text-sm font-bold text-[#273144] dark:text-slate-200">
            Preset
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {COLOR_PRESETS.map((preset) => {
              const isSelected =
                (customizerState.codeColor &&
                  customizerState.codeColor.toLowerCase() === preset.hex.toLowerCase()) ||
                (customizerState.presetColor &&
                  customizerState.presetColor.toLowerCase() === preset.hex.toLowerCase());
              return (
                <button
                  key={preset.hex}
                  type="button"
                  title={preset.name}
                  onClick={() => {
                    onCustomizerStateChange({
                      ...customizerState,
                      presetColor: preset.hex,
                      codeColor: preset.hex,
                    });
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-[#2a5bd7] ring-offset-2 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.hex }}
                />
              );
            })}
          </div>
        </div>

        {/* 2B. Code Color Row & Background Color Row (Compact Width & Minimal Rounded Corners) */}
        {(() => {
          const contrast = checkQrContrast(customizerState.codeColor, customizerState.bgColor);
          return (
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap gap-6 items-end">
                {/* Code Color Hex Field */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                    Code
                  </label>
                  <div className={`flex h-10 w-48 sm:w-56 items-center overflow-hidden rounded-xs border transition-colors shadow-2xs ${
                    contrast.isLowContrast
                      ? 'border-amber-400 bg-amber-50/30 dark:border-amber-500/80 dark:bg-amber-950/20 ring-1 ring-amber-400/50'
                      : 'border-slate-200 bg-[#ebf0f7] dark:border-slate-700 dark:bg-slate-800'
                  }`}>
                    <div
                      className="relative flex h-full w-10 shrink-0 items-center justify-center cursor-pointer transition-colors"
                      style={{ backgroundColor: customizerState.codeColor || '#000000' }}
                    >
                      <input
                        type="color"
                        value={customizerState.codeColor && customizerState.codeColor.length === 7 ? customizerState.codeColor : '#000000'}
                        onChange={(e) => {
                          const val = e.target.value;
                          onCustomizerStateChange({
                            ...customizerState,
                            codeColor: val,
                            presetColor: val,
                          });
                        }}
                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={customizerState.codeColor}
                      onChange={(e) => {
                        const val = e.target.value;
                        onCustomizerStateChange({
                          ...customizerState,
                          codeColor: val,
                          presetColor: val,
                        });
                      }}
                      placeholder="Enter hex code"
                      maxLength={7}
                      className="h-full flex-1 bg-transparent px-3 font-mono text-xs font-semibold text-[#526281] placeholder-slate-400 focus:outline-hidden dark:text-slate-200 uppercase"
                    />
                  </div>
                </div>

                {/* Background Color Hex Field */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                    Background
                  </label>
                  <div className={`flex h-10 w-48 sm:w-56 items-center overflow-hidden rounded-xs border transition-colors shadow-2xs ${
                    contrast.isLowContrast
                      ? 'border-amber-400 bg-amber-50/30 dark:border-amber-500/80 dark:bg-amber-950/20 ring-1 ring-amber-400/50'
                      : 'border-slate-200 bg-[#ebf0f7] dark:border-slate-700 dark:bg-slate-800'
                  }`}>
                    <div
                      className="relative flex h-full w-10 shrink-0 items-center justify-center cursor-pointer transition-colors border-r border-slate-200/60 dark:border-slate-700"
                      style={{ backgroundColor: customizerState.bgColor || '#ffffff' }}
                    >
                      <input
                        type="color"
                        value={customizerState.bgColor && customizerState.bgColor.length === 7 ? customizerState.bgColor : '#ffffff'}
                        onChange={(e) => updateState('bgColor', e.target.value)}
                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={customizerState.bgColor}
                      onChange={(e) => updateState('bgColor', e.target.value)}
                      placeholder="Enter hex code"
                      maxLength={7}
                      className="h-full flex-1 bg-transparent px-3 font-mono text-xs font-semibold text-[#526281] placeholder-slate-400 focus:outline-hidden dark:text-slate-200 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Low Contrast Warning Banner */}
              {contrast.isLowContrast && (
                <div className="flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50/90 p-3 text-xs font-medium text-amber-800 dark:border-amber-800/80 dark:bg-amber-950/40 dark:text-amber-300 animate-in fade-in duration-150">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold">Low Contrast Warning:</span> The code color and background color are too similar. Your QR code will not be scannable. Please choose contrasting colors.
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* 2C. Corners Color Toggle */}
        <div className="space-y-2 pt-1">
          <p className="text-sm font-bold text-[#273144] dark:text-slate-200">
            Corners
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateState('useQrColorForCorners', !customizerState.useQrColorForCorners)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${customizerState.useQrColorForCorners ? 'bg-[#2a5bd7]' : 'bg-slate-200 dark:bg-slate-700'
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${customizerState.useQrColorForCorners ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Use QR Code color
            </span>
          </div>
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-800" />

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3: Add a logo or center text */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#273144] dark:text-slate-100">
          Add a logo or center text
        </h2>

        {/* Grid of Logo Options */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Option 1: None (X) */}
          <button
            type="button"
            onClick={() => updateState('logoOption', 'none')}
            className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${customizerState.logoOption === 'none'
                ? 'border-[#2a5bd7] bg-white text-[#2a5bd7]'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
          >
            <span className="text-xl font-semibold">✕</span>
          </button>

          {/* Option 2: Upload Image */}
          <button
            type="button"
            onClick={() => updateState('logoOption', 'upload')}
            className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${customizerState.logoOption === 'upload'
                ? 'border-[#2a5bd7] bg-white text-[#2a5bd7]'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
          >
            <ImagePlus className="h-6 w-6" />
          </button>

          {/* Option 3: Custom Text */}
          <button
            type="button"
            onClick={() => updateState('logoOption', 'custom_text')}
            className={`flex h-14 px-4 items-center justify-center rounded-xl border-2 transition-all text-xs font-bold cursor-pointer ${customizerState.logoOption === 'custom_text'
                ? 'border-[#2a5bd7] bg-white text-[#2a5bd7]'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
          >
            CUSTOM TEXT
          </button>

          {/* Option 4: Trimly Logo */}
          <button
            type="button"
            onClick={() => updateState('logoOption', 'trimly_logo')}
            className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${customizerState.logoOption === 'trimly_logo'
                ? 'border-[#2a5bd7] bg-white text-[#2a5bd7]'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
          >
            <span className="text-xl font-extrabold italic font-serif">b</span>
          </button>

          {/* Option 5: Facebook */}
          <button
            type="button"
            onClick={() => updateState('logoOption', 'facebook')}
            className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${customizerState.logoOption === 'facebook'
                ? 'border-[#2a5bd7] bg-white text-[#2a5bd7]'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
          >
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>

          {/* Option 6: Instagram */}
          <button
            type="button"
            onClick={() => updateState('logoOption', 'instagram')}
            className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${customizerState.logoOption === 'instagram'
                ? 'border-[#2a5bd7] bg-white text-[#2a5bd7]'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
          >
            <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#2a5bd7] hover:underline cursor-pointer ml-1"
          >
            <Plus className="h-4 w-4" />
            <span>More</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 pt-1 font-medium">
          File type: PNG. 1:1 aspect ratio. Max size: 5MB, 2500x2500px
        </p>
      </div>
    </div>
  );
};
