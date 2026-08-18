'use client';

import React, { useState } from 'react';
import { Lock, Sparkles, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

export interface SharedDetailsMetricsModuleProps {
  titleText?: string;
  metricType?: 'clicks' | 'scans';
}

export const SharedDetailsMetricsModule: React.FC<SharedDetailsMetricsModuleProps> = ({
  titleText,
  metricType = 'clicks',
}) => {
  const isScanMode = metricType === 'scans';
  const mainTitle = titleText || (isScanMode ? 'Scan data' : 'Engagements over time');
  const [activeTab, setActiveTab] = useState<'countries' | 'cities'>('countries');

  return (
    <div className="space-y-6 pt-2">
      {/* 1. Main Engagements / Scans over time Chart Card */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold tracking-tight text-[#273144] dark:text-slate-100 flex items-center gap-1">
              <span>{mainTitle}</span>
              {!titleText && <ChevronDown className="h-5 w-5 text-slate-400" />}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* What's driving engagement AI Badge */}
            <button
              type="button"
              onClick={() => toast.info("AI Insights feature coming soon!")}
              className="h-9 px-3.5 rounded-lg border border-purple-200 bg-purple-50/50 text-xs font-bold text-purple-700 hover:bg-purple-100/60 transition-colors flex items-center gap-2 cursor-pointer dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300"
            >
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span>What's driving engagement?</span>
            </button>

            {/* Upgrade Badge */}
            <button
              type="button"
              onClick={() => toast.info('Upgrade to view detailed metrics')}
              className="h-9 px-3.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer dark:bg-slate-800 dark:text-slate-200"
            >
              <Lock className="h-3.5 w-3.5 text-slate-500" />
              <span>Upgrade</span>
            </button>
          </div>
        </div>

        {/* Chart SVG Canvas Box (Bitly Exact Match Mock Wave Lines) */}
        <div className="relative w-full h-64 rounded-xl bg-slate-50/50 border border-slate-100 dark:border-slate-800 dark:bg-slate-800/20 p-4 flex flex-col justify-between overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
            {/* Grid Dotted Lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="#e2e8f0" strokeDasharray="4 4" />
            <line x1="0" y1="90" x2="800" y2="90" stroke="#e2e8f0" strokeDasharray="4 4" />
            <line x1="0" y1="140" x2="800" y2="140" stroke="#e2e8f0" strokeDasharray="4 4" />
            <line x1="0" y1="190" x2="800" y2="190" stroke="#e2e8f0" strokeDasharray="4 4" />

            {/* Solid Wave Line */}
            <path
              d="M0 120 C 150 70, 300 130, 450 80 C 600 30, 700 90, 800 60"
              fill="none"
              stroke="#2a5bd7"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Dashed Wave Line */}
            <path
              d="M0 160 C 150 140, 300 160, 450 130 C 600 110, 700 140, 800 120"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* 2. Locations, Referrers / Browsers, and Devices Masonry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Box: Locations */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-[#273144] dark:text-slate-100">
              {isScanMode ? 'Scans by location' : 'Locations'}
            </h4>
            <button
              type="button"
              onClick={() => toast.info('Upgrade to unlock full data')}
              className="h-8 px-3 rounded-full bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer dark:bg-slate-800 dark:text-slate-200"
            >
              <Lock className="h-3 w-3 text-slate-500" />
              <span>Upgrade</span>
            </button>
          </div>

          {/* Countries / Cities Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 gap-4 text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('countries')}
              className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'countries'
                  ? 'border-[#2a5bd7] text-[#2a5bd7]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Countries
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cities')}
              className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'cities'
                  ? 'border-[#2a5bd7] text-[#2a5bd7]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Cities
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#273144] dark:text-slate-200">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5">Country</th>
                  <th className="py-2.5 text-right">Engagements</th>
                  <th className="py-2.5 text-right">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                <tr>
                  <td className="py-3">Sample one</td>
                  <td className="py-3 text-right">1,240</td>
                  <td className="py-3 text-right">38%</td>
                </tr>
                <tr>
                  <td className="py-3">Sample two</td>
                  <td className="py-3 text-right">860</td>
                  <td className="py-3 text-right">26%</td>
                </tr>
                <tr>
                  <td className="py-3">Sample three</td>
                  <td className="py-3 text-right">540</td>
                  <td className="py-3 text-right">17%</td>
                </tr>
                <tr>
                  <td className="py-3">Sample four</td>
                  <td className="py-3 text-right">360</td>
                  <td className="py-3 text-right">11%</td>
                </tr>
                <tr>
                  <td className="py-3">Sample five</td>
                  <td className="py-3 text-right">260</td>
                  <td className="py-3 text-right">8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Box: Referrers / Browsers & Devices */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-[#273144] dark:text-slate-100">
                {isScanMode ? 'Scans by browser' : 'Referrers'}
              </h4>
              <button
                type="button"
                onClick={() => toast.info('Upgrade to unlock full data')}
                className="h-8 px-3 rounded-full bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer dark:bg-slate-800 dark:text-slate-200"
              >
                <Lock className="h-3 w-3 text-slate-500" />
                <span>Upgrade</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#273144] dark:text-slate-200">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-2.5">{isScanMode ? 'Browser' : 'Referrer'}</th>
                    <th className="py-2.5 text-right">{isScanMode ? 'Scans' : 'Engagements'}</th>
                    <th className="py-2.5 text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  <tr>
                    <td className="py-3">Sample one</td>
                    <td className="py-3 text-right">1,240</td>
                    <td className="py-3 text-right">38%</td>
                  </tr>
                  <tr>
                    <td className="py-3">Sample two</td>
                    <td className="py-3 text-right">860</td>
                    <td className="py-3 text-right">26%</td>
                  </tr>
                  <tr>
                    <td className="py-3">Sample three</td>
                    <td className="py-3 text-right">540</td>
                    <td className="py-3 text-right">17%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {!isScanMode && (
            <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-[#273144] dark:text-slate-100">
                  Devices
                </h4>
                <button
                  type="button"
                  onClick={() => toast.info('Upgrade to unlock full data')}
                  className="h-8 px-3 rounded-full bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer dark:bg-slate-800 dark:text-slate-200"
                >
                  <Lock className="h-3 w-3 text-slate-500" />
                  <span>Upgrade</span>
                </button>
              </div>

              <div className="h-44 w-full flex items-end justify-between gap-3 pt-4 px-4">
                <div className="w-12 bg-[#2a5bd7] rounded-t-md h-full" />
                <div className="w-12 bg-[#2a5bd7] rounded-t-md h-4/5" />
                <div className="w-12 bg-[#2a5bd7] rounded-t-md h-3/5" />
                <div className="w-12 bg-[#2a5bd7] rounded-t-md h-2/5" />
                <div className="w-12 bg-[#2a5bd7] rounded-t-md h-1/5" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
