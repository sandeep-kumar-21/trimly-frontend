'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import { Link2, QrCode, Copy, Check, ArrowRight, Download, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';
import { linksApi } from '@/lib/api/links.api';
import { ShortLink } from '@/types/link.types';

export const HeroDualWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');

  // Short link state
  const [longUrl, setLongUrl] = useState('');
  const [isShortening, setIsShortening] = useState(false);
  const [shortenedResult, setShortenedResult] = useState<ShortLink | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // QR Code state
  const [qrInputUrl, setQrInputUrl] = useState('https://trimly.link');
  const [qrColor, setQrColor] = useState('#273144');
  const [qrCopied, setQrCopied] = useState(false);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    let formattedUrl = longUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    setIsShortening(true);
    setLinkError(null);

    try {
      const res = await linksApi.createLink({ longUrl: formattedUrl });
      setShortenedResult(res);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to shorten URL. Please check the address.';
      setLinkError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsShortening(false);
    }
  };

  const handleCopyShortLink = async () => {
    if (!shortenedResult) return;
    const urlToCopy = shortenedResult.shortUrl || `${window.location.origin}/${shortenedResult.shortCode}`;
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadQr = () => {
    const canvas = qrCanvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `trimly-qr-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const colorOptions = [
    { label: 'Slate', value: '#273144' },
    { label: 'Blue', value: '#2a5bd7' },
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Emerald', value: '#059669' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-all">
      {/* Top Tab Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 px-4 pt-3 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('link')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg font-bold text-sm transition-all border-b-2 cursor-pointer ${
            activeTab === 'link'
              ? 'bg-white dark:bg-slate-900 text-[#2a5bd7] dark:text-blue-400 border-[#2a5bd7] dark:border-blue-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
          }`}
        >
          <Link2 className="h-4 w-4" />
          <span>Short link</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('qr')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg font-bold text-sm transition-all border-b-2 cursor-pointer ${
            activeTab === 'qr'
              ? 'bg-white dark:bg-slate-900 text-[#2a5bd7] dark:text-blue-400 border-[#2a5bd7] dark:border-blue-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
          }`}
        >
          <QrCode className="h-4 w-4" />
          <span>QR Code</span>
        </button>
      </div>

      {/* Tab 1: Short Link */}
      {activeTab === 'link' && (
        <div className="p-6 md:p-8 space-y-6">
          {!shortenedResult ? (
            <form onSubmit={handleShorten} className="space-y-4">
              <div>
                <label htmlFor="landing-url-input" className="block text-sm font-semibold text-[#273144] dark:text-slate-200 mb-2">
                  Paste a long URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <input
                      id="landing-url-input"
                      type="text"
                      placeholder="https://example.com/my-very-long-product-launch-campaign-url"
                      value={longUrl}
                      onChange={(e) => {
                        setLongUrl(e.target.value);
                        if (linkError) setLinkError(null);
                      }}
                      className="w-full px-4 py-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2a5bd7] focus:border-transparent transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isShortening || !longUrl.trim()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#2a5bd7] hover:bg-[#1a4bb7] disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isShortening ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Shortening...</span>
                      </>
                    ) : (
                      <>
                        <span>Shorten link</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {linkError && (
                <p className="text-xs text-rose-500 font-medium">{linkError}</p>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400">
                By clicking Shorten link, you agree to Trimly&apos;s Terms of Service and Privacy Policy. Free anonymous links are generated instantly.
              </p>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" /> Link generated
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShortenedResult(null);
                    setLongUrl('');
                  }}
                  className="text-xs text-slate-500 hover:text-[#2a5bd7] font-medium flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Shorten another</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <a
                      href={shortenedResult.shortUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/${shortenedResult.shortCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-[#2a5bd7] dark:text-blue-400 hover:underline truncate inline-flex items-center gap-1"
                    >
                      <span>{shortenedResult.shortUrl || `${typeof window !== 'undefined' ? window.location.origin : 'trimly.link'}/${shortenedResult.shortCode}`}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-500 truncate max-w-md">
                    {shortenedResult.longUrl}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyShortLink}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                      linkCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#2a5bd7] hover:bg-[#1a4bb7] text-white'
                    }`}
                  >
                    {linkCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-blue-900 dark:text-blue-200">
                  <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Want custom back-halves, QR codes &amp; click analytics?</span>
                </div>
                <Link
                  href="/register"
                  className="shrink-0 text-xs font-bold text-[#2a5bd7] dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Sign up free</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: QR Code */}
      {activeTab === 'qr' && (
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Left: Input & Options */}
            <div className="sm:col-span-7 space-y-4">
              <div>
                <label htmlFor="landing-qr-url" className="block text-sm font-semibold text-[#273144] dark:text-slate-200 mb-2">
                  Enter your destination URL
                </label>
                <input
                  id="landing-qr-url"
                  type="text"
                  placeholder="https://mywebsite.com"
                  value={qrInputUrl}
                  onChange={(e) => setQrInputUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2a5bd7] focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#273144] dark:text-slate-300 mb-2">
                  QR Color
                </span>
                <div className="flex items-center gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setQrColor(c.value)}
                      className={`h-7 w-7 rounded-full transition-transform cursor-pointer border-2 ${
                        qrColor === c.value ? 'scale-110 border-slate-900 dark:border-white shadow-sm' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-[#2a5bd7] hover:bg-[#1a4bb7] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PNG</span>
                </button>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-[#273144] dark:text-slate-200 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#2a5bd7]" />
                  <span>Custom logos &amp; frames</span>
                </Link>
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <div
                ref={qrCanvasRef}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center"
              >
                <QRCodeCanvas
                  value={qrInputUrl || 'https://trimly.link'}
                  size={150}
                  fgColor={qrColor}
                  bgColor="#ffffff"
                  level="M"
                  marginSize={1}
                />
              </div>
              <span className="mt-2 text-[11px] text-slate-500 font-medium">
                Live scan preview
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
