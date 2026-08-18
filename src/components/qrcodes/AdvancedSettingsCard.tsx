'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Clock, GitFork, Code2, Crown, Sparkles } from 'lucide-react';

export const AdvancedSettingsCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [utmEnabled, setUtmEnabled] = useState(false);
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [dynamicRoutingEnabled, setDynamicRoutingEnabled] = useState(false);

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
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
        <div className="space-y-6">
          {/* Row 1: UTM Parameters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Code2 className="h-5 w-5 text-slate-500 shrink-0" />
              <span className="text-sm font-bold text-[#273144] dark:text-slate-200">
                UTM parameters
              </span>
              <Crown className="h-4 w-4 text-teal-600 shrink-0" />
            </div>

            <button
              type="button"
              onClick={() => setUtmEnabled(!utmEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${utmEnabled ? 'bg-[#2a5bd7]' : 'bg-slate-200 dark:bg-slate-700'
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${utmEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Row 2: Code Expiration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-slate-500 shrink-0" />
              <span className="text-sm font-bold text-[#273144] dark:text-slate-200">
                Code expiration
              </span>
              <Crown className="h-4 w-4 text-teal-600 shrink-0" />
            </div>

            <button
              type="button"
              onClick={() => setExpirationEnabled(!expirationEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${expirationEnabled ? 'bg-[#2a5bd7]' : 'bg-slate-200 dark:bg-slate-700'
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${expirationEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Row 3: Dynamic Routing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GitFork className="h-5 w-5 text-slate-500 shrink-0" />
                <span className="text-sm font-bold text-[#273144] dark:text-slate-200">
                  Dynamic routing
                </span>
                <Crown className="h-4 w-4 text-teal-600 shrink-0" />
              </div>

              <button
                type="button"
                onClick={() => setDynamicRoutingEnabled(!dynamicRoutingEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${dynamicRoutingEnabled ? 'bg-[#2a5bd7]' : 'bg-slate-200 dark:bg-slate-700'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${dynamicRoutingEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            <p className="text-sm text-[#526281] leading-relaxed dark:text-slate-400">
              Direct visitors to different destination URLs based on conditions such as device or location. Rules apply in order, and traffic is routed based on the first condition matched. All other traffic is routed to the default destination.{' '}
              <a href="#learn" className="text-[#2a5bd7] underline font-semibold">
                Learn more
              </a>
              .
            </p>

            <div className="flex items-center gap-2 rounded-xl bg-[#eef7ff] border border-blue-100 p-3 text-sm font-semibold text-[#273144] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
              <Sparkles className="h-4 w-4 text-[#2a5bd7] shrink-0" />
              <span>
                <a href="#upgrade" className="text-[#2a5bd7] underline">Upgrade</a> to send each visitor to the right destination automatically.
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
