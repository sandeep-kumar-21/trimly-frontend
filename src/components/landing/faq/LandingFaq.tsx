'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const LandingFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is the difference between static and dynamic QR codes?',
      answer:
        'Static QR codes permanently encode the target URL into the black-and-white pixel pattern, meaning they can never be modified once printed. Trimly creates dynamic QR codes that route through our high-performance redirect engine. You can change where the QR code redirects at any time from your dashboard without reprinting packaging, flyers, or business cards.',
    },
    {
      question: 'Is Trimly completely free to use without a credit card?',
      answer:
        'Yes! The Trimly Starter plan is 100% free forever. It includes 100 short links per month, 10 dynamic QR codes, custom back-half aliases, and 30-day analytics. No credit card is required to sign up.',
    },
    {
      question: 'How fast are Trimly short link redirects?',
      answer:
        'Trimly operates a low-latency cache-aside layer powered by distributed Redis clusters. Frequently accessed short links are resolved in single-digit milliseconds directly from memory before 302/301 forwarding to your final destination.',
    },
    {
      question: 'Can I lock links with passwords or set automatic expiration dates?',
      answer:
        'Yes. With Trimly, you can protect sensitive pitch decks or private documents with passwords securely hashed with bcrypt. You can also define an exact expiration timestamp after which the link automatically ceases redirecting.',
    },
    {
      question: 'How does the real-time clickstream telemetry work?',
      answer:
        'Unlike legacy link shorteners that rely on delayed batch aggregations, Trimly streams live interactions via native Server-Sent Events (SSE). When a visitor clicks your link or scans your QR code, origin location, operating system, and referrer data light up on your dashboard instantly.',
    },
    {
      question: 'Can I export QR codes for commercial and billboard printing?',
      answer:
        'Yes. You can export in raster PNG format for web & social media assets, or scalable vector SVG format for billboards, packaging, stickers, and commercial print shops.',
    },
  ];

  return (
    <section id="resources" className="py-20 sm:py-28 bg-[#fcfbf9] border-t border-slate-200/70 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#9c8266]">
            Questions &amp; answers
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#081638] tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Everything you need to know about Trimly links, dynamic QR codes, and performance.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold text-[#081638]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#0c56ec]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 font-normal">
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
