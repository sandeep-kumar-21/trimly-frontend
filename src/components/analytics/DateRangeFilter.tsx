'use client';

import React, { useState } from 'react';
import { Calendar, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface DateRangeFilterProps {
  onRangeChange: (from?: string, to?: string) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onRangeChange }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('all');
  const [customFrom, setCustomFrom] = useState<string>('');
  const [customTo, setCustomTo] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  const applyPreset = (preset: string) => {
    setSelectedPreset(preset);
    const now = new Date();

    if (preset === '7d') {
      const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      onRangeChange(past.toISOString().split('T')[0], now.toISOString().split('T')[0]);
    } else if (preset === '30d') {
      const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      onRangeChange(past.toISOString().split('T')[0], now.toISOString().split('T')[0]);
    } else if (preset === '90d') {
      const past = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      onRangeChange(past.toISOString().split('T')[0], now.toISOString().split('T')[0]);
    } else {
      // 'all'
      onRangeChange(undefined, undefined);
    }
  };

  const applyCustomRange = () => {
    if (!customFrom && !customTo) return;
    setSelectedPreset('custom');
    onRangeChange(customFrom || undefined, customTo || undefined);
    setShowCustomModal(false);
  };

  const clearFilter = () => {
    setSelectedPreset('all');
    setCustomFrom('');
    setCustomTo('');
    onRangeChange(undefined, undefined);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400 mr-1">
        <Filter className="h-3.5 w-3.5" />
        <span>Date Range:</span>
      </div>

      {/* Preset Pill Buttons */}
      <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
        {[
          { id: '7d', label: 'Last 7 Days' },
          { id: '30d', label: 'Last 30 Days' },
          { id: '90d', label: 'Last 90 Days' },
          { id: 'all', label: 'All Time' },
        ].map((p) => {
          const isActive = selectedPreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${isActive
                ? 'bg-indigo-600 text-white shadow-2xs dark:bg-indigo-500'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom Range Button */}
      <Button
        variant={selectedPreset === 'custom' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => setShowCustomModal(!showCustomModal)}
        leftIcon={<Calendar className="h-3.5 w-3.5" />}
      >
        {selectedPreset === 'custom' && customFrom ? `${customFrom} to ${customTo || 'Now'}` : 'Custom Date'}
      </Button>

      {selectedPreset !== 'all' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilter}
          leftIcon={<X className="h-3.5 w-3.5" />}
          className="text-slate-500 hover:text-rose-600 dark:text-slate-400"
        >
          Reset
        </Button>
      )}

      {/* Custom Date Modal Popup */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" /> Select Custom Range
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">From Date</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">To Date</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowCustomModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={applyCustomRange}>
                Apply Filter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
