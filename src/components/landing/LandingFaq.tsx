'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const LandingFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is the difference between static and dynamic QR codes?',
      answer:
        'Static QR codes hardcode the destination URL directly into the pixel pattern, meaning they can never be changed once printed. Trimly creates dynamic QR codes that point to your short link. You can change where the QR code redirects at any time from your dashboard without having to reprint physical packaging, menus, or marketing materials.',
    },
    {
      question: 'Can I use Trimly for free without a credit card?',
      answer:
        'Yes! The Trimly Starter plan is 100% free forever. It includes 100 short links per month, 10 dynamic QR codes, custom back-half aliases, and 30-day click analytics. No credit card is required to sign up.',
    },
    {
      question: 'How does Trimly achieve sub-5ms redirection latency?',
      answer:
        'Trimly utilizes a high-performance cache-aside architecture powered by distributed Redis. Frequently accessed links are resolved directly in-memory, avoiding round-trip database queries and delivering instant 302/301 redirects to your audience.',
    },
    {
      question: 'Can I protect sensitive links with passwords or expiration dates?',
      answer:
        'Yes. With Trimly, you can secure any link with a password hashed via bcrypt. Visitors must provide the correct password before being forwarded. You can also specify an exact expiration timestamp after which the link automatically deactivates.',
    },
    {
      question: 'How does the real-time clickstream telemetry work?',
      answer:
        'Unlike traditional link shorteners that rely on delayed batch jobs or aggressive polling, Trimly streams live interactions via Server-Sent Events (SSE). When a user clicks your link, referrer data, city, country, and device type are pushed directly to your dashboard in milliseconds.',
    },
    {
      question: 'Can I export QR codes for high-resolution commercial printing?',
      answer:
        'Yes. You can export QR codes as crisp raster PNGs for digital assets or infinite-scale vector SVGs ready for billboards, product packaging, vinyl wraps, and professional print shops.',
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2a5bd7] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#273144] dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 font-normal">
            Everything you need to know about Trimly links, QR codes, and performance.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-base font-bold text-[#273144] dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#2a5bd7]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
