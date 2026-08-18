'use client';

import React from 'react';

export interface QrColorPickerGroupProps {
  codeColor: string;
  bgColor: string;
  presetColor: string;
  onChangeCodeColor: (hex: string) => void;
  onChangeBgColor: (hex: string) => void;
  onChangePresetColor: (hex: string) => void;
}

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

export const QrColorPickerGroup: React.FC<QrColorPickerGroupProps> = ({
  codeColor,
  bgColor,
  presetColor,
  onChangeCodeColor,
  onChangeBgColor,
  onChangePresetColor,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#273144] dark:text-slate-100">
        Choose your colors
      </h2>

      {/* Preset colors */}
      <div className="space-y-3">
        <p className="text-sm font-bold text-[#273144] dark:text-slate-200">
          Preset
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {COLOR_PRESETS.map((preset) => {
            const isSelected =
              (codeColor && codeColor.toLowerCase() === preset.hex.toLowerCase()) ||
              (presetColor && presetColor.toLowerCase() === preset.hex.toLowerCase());
            return (
              <button
                key={preset.hex}
                type="button"
                title={preset.name}
                onClick={() => {
                  onChangePresetColor(preset.hex);
                  onChangeCodeColor(preset.hex);
                }}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#2a5bd7] ring-offset-2 scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: preset.hex }}
                aria-label={`Select ${preset.name} preset`}
              />
            );
          })}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <label htmlFor="dots-color-input" className="block text-xs font-bold uppercase text-slate-500">
            QR Code Color
          </label>
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-800">
            <input
              id="dots-color-input"
              type="color"
              value={codeColor}
              onChange={(e) => onChangeCodeColor(e.target.value)}
              className="h-8 w-8 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <span className="text-sm font-mono font-bold text-[#273144] dark:text-slate-200">
              {codeColor.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="bg-color-input" className="block text-xs font-bold uppercase text-slate-500">
            Background Color
          </label>
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-800">
            <input
              id="bg-color-input"
              type="color"
              value={bgColor}
              onChange={(e) => onChangeBgColor(e.target.value)}
              className="h-8 w-8 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <span className="text-sm font-mono font-bold text-[#273144] dark:text-slate-200">
              {bgColor.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
