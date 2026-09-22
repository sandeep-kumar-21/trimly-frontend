'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Platform', href: '#platform', hasDropdown: true },
    { label: 'AI', href: '#ai', hasDropdown: true },
    { label: 'Solutions', href: '#solutions', hasDropdown: true },
    { label: 'Pricing', href: '#pricing', hasDropdown: false },
    { label: 'Resources', href: '#resources', hasDropdown: true },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 select-none ${
        scrolled
          ? 'bg-[#081638]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-[#081638] border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center">
            <Image
              src="/trimly-logo.svg"
              alt="Trimly"
              width={120}
              height={34}
              priority
              className="h-8 w-auto brightness-0 invert"
            />
          </div>
        </Link>

        {/* Center Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span>{link.label}</span>
              {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5 opacity-70" />}
            </a>
          ))}

          {/* Language Selector */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors ml-1 cursor-pointer"
          >
            <Globe className="h-4 w-4" />
            <span>EN</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>
        </nav>

        {/* Right Desktop Auth CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-3.5 py-2 text-sm font-semibold text-white hover:text-blue-200 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-md border border-white/40 hover:border-white text-white text-sm font-semibold hover:bg-white/10 transition-colors"
          >
            Get a Quote
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 rounded-md bg-white hover:bg-slate-100 text-[#081638] text-sm font-bold shadow-sm transition-colors cursor-pointer"
          >
            Sign up Free
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-white hover:bg-white/10 lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#081638]/98 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-md text-base font-semibold text-white/90 hover:bg-white/10 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <hr className="border-white/10" />

          <div className="flex flex-col gap-2.5 pt-1">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-bold text-white rounded-md border border-white/30 hover:bg-white/10 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-bold text-[#081638] bg-white hover:bg-slate-100 rounded-md shadow-sm transition-colors"
            >
              Sign up Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
