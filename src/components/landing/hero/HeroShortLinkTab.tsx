'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy, ExternalLink, RefreshCw, Star } from 'lucide-react';
import { linksApi } from '@/lib/api/links.api';
import { ShortLink } from '@/types/link.types';

export const HeroShortLinkTab: React.FC = () => {
  const [longUrl, setLongUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shortenedResult, setShortenedResult] = useState<ShortLink | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    let formattedUrl = longUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await linksApi.createLink({ longUrl: formattedUrl });
      setShortenedResult(res);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Please enter a valid HTTP or HTTPS URL';
      setErrorMsg(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!shortenedResult) return;
    const urlToCopy = shortenedResult.shortUrl || `${window.location.origin}/${shortenedResult.shortCode}`;
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="p-6 sm:p-10 space-y-6">
      {!shortenedResult ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#081638] tracking-tight">
              Shorten a long link
            </h3>
            <label htmlFor="hero-long-url-input" className="block text-sm font-bold text-slate-700 pt-1">
              Paste your long link here
            </label>
          </div>

          <div>
            <input
              id="hero-long-url-input"
              type="text"
              placeholder="https://www.amazon.com/product/dp/B0CQPDTQ26/ref=pd_sim_d_sccl_3_2?utm_campaign=summer"
              value={longUrl}
              onChange={(e) => {
                setLongUrl(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              className="w-full px-4 py-3.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c56ec] focus:border-transparent transition-all placeholder:text-slate-400 font-normal"
            />
            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">{errorMsg}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <button
              type="submit"
              disabled={isSubmitting || !longUrl.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[#0c56ec] hover:bg-[#0947c7] disabled:bg-slate-300 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Shortening...</span>
                </>
              ) : (
                <>
                  <span>Get your link for free</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* G2 Rating Social Proof Badge (matching Bitly Image 1) */}
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-[#f26522] flex items-center justify-center text-white text-xs font-black shadow-2xs">
                G
              </div>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[11px] font-bold text-slate-700 ml-1">4.8/5</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Loved by 1,200+ on G2</span>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <Check className="h-4 w-4" /> Short link ready!
            </span>
            <button
              type="button"
              onClick={() => {
                setShortenedResult(null);
                setLongUrl('');
              }}
              className="text-xs text-[#0c56ec] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Shorten another</span>
            </button>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <a
                href={shortenedResult.shortUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/${shortenedResult.shortCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-extrabold text-[#0c56ec] hover:underline truncate inline-flex items-center gap-1.5"
              >
                <span>{shortenedResult.shortUrl || `${typeof window !== 'undefined' ? window.location.origin : 'trimly.link'}/${shortenedResult.shortCode}`}</span>
                <ExternalLink className="h-4 w-4 shrink-0 opacity-70" />
              </a>
              <p className="text-xs text-slate-500 truncate max-w-md">
                {shortenedResult.longUrl}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-md text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                copied ? 'bg-emerald-600 text-white' : 'bg-[#0c56ec] hover:bg-[#0947c7] text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-900">
            <span>Want custom back-halves, branded QR codes, and clickstream analytics?</span>
            <Link href="/register" className="font-bold text-[#0c56ec] hover:underline whitespace-nowrap">
              Sign up for free &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
