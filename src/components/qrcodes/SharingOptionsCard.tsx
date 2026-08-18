'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Link2 } from 'lucide-react';

export interface SharingOptionsCardProps {
  alsoCreateLink: boolean;
  onAlsoCreateLinkChange: (val: boolean) => void;
}

export const SharingOptionsCard: React.FC<SharingOptionsCardProps> = ({
  alsoCreateLink,
  onAlsoCreateLinkChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h2 className="text-lg font-bold text-[#273144] dark:text-slate-100">
          Sharing options
        </h2>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Collapse Sharing options section"
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <Link2 className="h-5 w-5 text-amber-600 shrink-0" />
            <label htmlFor="short-link" className="text-sm font-bold text-[#273144] dark:text-slate-200 cursor-pointer">
              Create a link
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#526281] underline cursor-pointer" title="Your current plan includes 50 links per month. Upgrade for more.">
              49 left
            </span>
            {/* Toggle Switch */}
            <button
              id="short-link"
              type="button"
              onClick={() => onAlsoCreateLinkChange(!alsoCreateLink)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${alsoCreateLink ? 'bg-[#2a5bd7]' : 'bg-slate-200 dark:bg-slate-700'
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${alsoCreateLink ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
