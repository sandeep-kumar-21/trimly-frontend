'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Crown, Sparkles, Clock, Zap } from 'lucide-react';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

export const LinkAdvancedSettingsCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [enableUtm, setEnableUtm] = useState(false);
  const [enableExpiration, setEnableExpiration] = useState(false);
  const [enableDynamic, setEnableDynamic] = useState(false);

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h2 className="text-lg font-bold text-[#273144] dark:text-slate-100">
          Advanced settings
        </h2>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Collapse Advanced settings section"
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          {/* Option 1: UTM Parameters */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-600 dark:text-slate-400">{"{}"}</span>
              <span className="text-sm font-bold text-[#273144] dark:text-slate-100">
                UTM parameters
              </span>
              <Crown className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 fill-teal-600" />
            </div>

            <ToggleSwitch
              checked={enableUtm}
              onChange={setEnableUtm}
              aria-label="Toggle UTM parameters"
            />
          </div>

          {/* Option 2: Link Expiration */}
          <div className="flex items-center justify-between py-1 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm font-bold text-[#273144] dark:text-slate-100">
                Link expiration
              </span>
              <Crown className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 fill-teal-600" />
            </div>

            <ToggleSwitch
              checked={enableExpiration}
              onChange={setEnableExpiration}
              aria-label="Toggle expiration"
            />
          </div>

          {/* Option 3: Dynamic Routing */}
          <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-bold text-[#273144] dark:text-slate-100">
                  Dynamic routing
                </span>
                <Crown className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 fill-teal-600" />
              </div>

              <ToggleSwitch
                checked={enableDynamic}
                onChange={setEnableDynamic}
                aria-label="Toggle dynamic routing"
              />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
              Direct visitors to different destination URLs based on conditions such as device or location. Rules apply in order, and traffic is routed based on the first condition matched.{' '}
              <span className="text-blue-600 underline cursor-pointer">Learn more</span>.
            </p>

            <div className="rounded-xl border border-teal-200/80 bg-teal-50/60 p-3 text-xs text-teal-900 flex items-center gap-2 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200 mt-2">
              <Sparkles className="h-4 w-4 text-teal-600 shrink-0" />
              <span>
                <strong className="underline cursor-pointer">Upgrade</strong> to send each visitor to the right destination automatically.
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
