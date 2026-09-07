'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, Plus } from 'lucide-react';
import { toast } from 'sonner';

export interface AiAssistSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistSidePanel: React.FC<AiAssistSidePanelProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userPrompt = prompt.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userPrompt }]);
    setPrompt('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `I'm analyzing your request regarding "${userPrompt}". Your Trimly links are performing at peak efficiency!`,
        },
      ]);
    }, 600);
  };

  return (
    <>
      {/* Mobile/Tablet Backdrop (Below Topbar, No Blur) */}
      <div
        className="fixed inset-x-0 top-14 bottom-0 bg-slate-900/40 z-30 lg:hidden animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className="fixed top-14 bottom-0 right-0 z-40 flex w-full sm:w-[380px] lg:w-[400px] lg:static lg:z-20 h-[calc(100vh-3.5rem)] lg:h-full shrink-0 flex-col border-l border-slate-200 bg-white shadow-2xl lg:shadow-none transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 animate-in slide-in-from-right duration-200">
        {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.3636 7.27273L17.5 4.77273L20 3.63636L17.5 2.5L16.3636 0L15.2273 2.5L12.7273 3.63636L15.2273 4.77273L16.3636 7.27273ZM9.54545 7.72727L7.27273 2.72727L5 7.72727L0 10L5 12.2727L7.27273 17.2727L9.54545 12.2727L14.5455 10L9.54545 7.72727ZM16.3636 12.7273L15.2273 15.2273L12.7273 16.3636L15.2273 17.5L16.3636 20L17.5 17.5L20 16.3636L17.5 15.2273L16.3636 12.7273Z" fill="url(#assist_sparkle_gradient)" />
            <defs>
              <linearGradient id="assist_sparkle_gradient" x1="0.182" y1="0.181" x2="19.818" y2="19.818" gradientUnits="userSpaceOnUse">
                <stop stopColor="#219ACD" />
                <stop offset="0.5" stopColor="#A950A4" />
                <stop offset="1" stopColor="#FF950A" />
              </linearGradient>
            </defs>
          </svg>
          <h3 className="text-base font-bold text-[#273144] dark:text-slate-100">Trimly Assist</h3>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close panel"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {messages.length === 0 ? (
          <>
            {/* Hero Illustration & Welcome Title */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-50/80 dark:bg-slate-800/60 p-3">
                <svg width="44" height="44" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.3636 7.27273L17.5 4.77273L20 3.63636L17.5 2.5L16.3636 0L15.2273 2.5L12.7273 3.63636L15.2273 4.77273L16.3636 7.27273ZM9.54545 7.72727L7.27273 2.72727L5 7.72727L0 10L5 12.2727L7.27273 17.2727L9.54545 12.2727L14.5455 10L9.54545 7.72727ZM16.3636 12.7273L15.2273 15.2273L12.7273 16.3636L15.2273 17.5L16.3636 20L17.5 17.5L20 16.3636L17.5 15.2273L16.3636 12.7273Z" fill="url(#hero_sparkle_gradient)" />
                  <defs>
                    <linearGradient id="hero_sparkle_gradient" x1="0.182" y1="0.181" x2="19.818" y2="19.818" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#219ACD" />
                      <stop offset="0.5" stopColor="#A950A4" />
                      <stop offset="1" stopColor="#FF950A" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <h2 className="text-xl font-bold text-[#273144] dark:text-slate-100">
                Trimly Assist
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                Bring AI into your workflow with Trimly Assist — from creating links to uncovering meaningful performance trends.
              </p>
            </div>

            {/* Benefits Checklist */}
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                What you can do
              </span>
              <ul className="space-y-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>Instantly generate clean short links & custom UTM tags</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>Ask analytical questions about your top traffic sources</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>Automate campaign setup across multi-channel rollouts</span>
                </li>
              </ul>
            </div>
          </>
        ) : (
          /* Active Chat Thread */
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#2a5bd7] text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-[#273144] dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Chat Launcher Form */}
      <form onSubmit={handleSubmit} className="border-t border-slate-200 p-2.5 sm:p-3 dark:border-slate-800 space-y-1.5 bg-white dark:bg-slate-900">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-2xs space-y-3">
          <textarea
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Paste a long URL to shorten, or ask about your link performance..."
            className="w-full resize-none bg-transparent text-xs font-medium text-[#273144] dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => toast.info('File attachment feature ready')}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Add attachment"
            >
              <Plus className="h-4 w-4" />
            </button>

            <button
              type="submit"
              disabled={!prompt.trim()}
              className="h-8 w-8 flex items-center justify-center rounded-md bg-[#2a5bd7] text-white hover:bg-[#1d4cc9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Submit prompt"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center leading-tight">
          Trimly Assist can make mistakes. Always verify your links, codes, and data.
        </p>
      </form>
    </aside>
  </>
  );
};
