'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Link2, QrCode } from 'lucide-react';

export default function QrCodePreviewLandingPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f4f6f8] text-[#273144] font-sans">
      <header className="w-full bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/trimly-logo.svg"
              alt="Trimly Logo"
              width={120}
              height={36}
              priority
              style={{ width: 'auto', height: '36px' }}
            />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto my-10 px-5 flex flex-col items-center text-center">
        <div className="mb-8 w-full">
          <div className="hidden sm:block mb-4 space-y-1">
            <h1 className="text-3xl font-extrabold text-[#0b1528] tracking-tight">
              You&apos;re almost there!
            </h1>
            <h2 className="text-3xl font-extrabold text-[#0b1528] tracking-tight">
              Don&apos;t forget to finish creating your QR Code.
            </h2>
          </div>
          <h1 className="block sm:hidden text-2xl font-extrabold text-[#0b1528] tracking-tight mb-3">
            You&apos;re almost there! Don&apos;t forget to finish creating your QR Code.
          </h1>
          <p className="text-base text-[#526281] max-w-xl mx-auto leading-relaxed">
            If you are seeing this message, your QR Code is still a preview. Make sure you finish customizing your QR Code and then select <span className="font-bold text-[#273144]">&apos;Create QR Code&apos;</span>.
          </p>
        </div>

        <div className="relative my-3 mb-10 w-full max-w-[320px] drop-shadow-md">
          <Image
            src="/qrcode_image.webp"
            alt="QR Code Illustration"
            width={320}
            height={240}
            priority
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="w-full max-w-xl border-t border-slate-200 pt-9 flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-1 mb-2">
            <p className="text-sm font-semibold text-[#273144]">
              While you are here... Check out what else you can do with Trimly
            </p>
          </div>

          <div className="flex items-center gap-3.5 bg-white border border-slate-200 rounded-xl p-3.5 px-5 w-full text-left shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Link2 className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Personalize, share, and track your short links
            </p>
          </div>

          <div className="flex items-center gap-3.5 bg-white border border-slate-200 rounded-xl p-3.5 px-5 w-full text-left shadow-2xs hover:shadow-md transition-all">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <QrCode className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              Showcase your important links with a Link-in-bio page
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
