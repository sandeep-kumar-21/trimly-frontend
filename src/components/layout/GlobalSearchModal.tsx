'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Link2,
  QrCode,
  BarChart3,
  Layers,
  Settings,
  Home,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Command,
  FileText,
} from 'lucide-react';
import { linksApi } from '@/lib/api/links.api';
import { qrcodesApi, QrCodeResponse } from '@/lib/api/qrcodes.api';
import { ShortLink } from '@/types/link.types';
import { useUIStore } from '@/store/uiStore';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreate?: () => void;
}

interface SearchItem {
  id: string;
  type: 'action' | 'nav' | 'link' | 'qrcode';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onSelect: () => void;
  badge?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onOpenCreate,
}) => {
  const router = useRouter();
  const { toggleAiAssist } = useUIStore();
  const [query, setQuery] = useState('');
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [qrCodes, setQrCodes] = useState<QrCodeResponse[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      // Pre-fetch user links & QR codes for instant instant-search
      linksApi.getUserLinks().then(setLinks).catch(() => {});
      qrcodesApi.getUserQrCodes().then(setQrCodes).catch(() => {});
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Static Navigation Items
  const navItems: SearchItem[] = [
    {
      id: 'nav-home',
      type: 'nav',
      title: 'Home Dashboard',
      subtitle: 'Overview of top metrics and recent activity',
      icon: <Home className="h-4 w-4 text-slate-500" />,
      onSelect: () => {
        router.push('/home');
        onClose();
      },
    },
    {
      id: 'nav-links',
      type: 'nav',
      title: 'Links Management',
      subtitle: 'View and manage all shortened URLs',
      icon: <Link2 className="h-4 w-4 text-[#2a5bd7]" />,
      onSelect: () => {
        router.push('/links');
        onClose();
      },
    },
    {
      id: 'nav-qr',
      type: 'nav',
      title: 'QR Codes Studio',
      subtitle: 'Design, edit and export dynamic QR codes',
      icon: <QrCode className="h-4 w-4 text-indigo-500" />,
      onSelect: () => {
        router.push('/qrcodes');
        onClose();
      },
    },
    {
      id: 'nav-analytics',
      type: 'nav',
      title: 'Analytics & Telemetry',
      subtitle: 'Inspect traffic sources, geos, and live SSE clickstreams',
      icon: <BarChart3 className="h-4 w-4 text-emerald-500" />,
      onSelect: () => {
        router.push('/analytics');
        onClose();
      },
    },
    {
      id: 'nav-campaigns',
      type: 'nav',
      title: 'Campaigns & UTMs',
      subtitle: 'Group links and track multi-channel marketing campaigns',
      icon: <Layers className="h-4 w-4 text-amber-500" />,
      onSelect: () => {
        router.push('/campaigns');
        onClose();
      },
    },
    {
      id: 'nav-settings',
      type: 'nav',
      title: 'Settings',
      subtitle: 'Profile, custom domains, and account preferences',
      icon: <Settings className="h-4 w-4 text-slate-500" />,
      onSelect: () => {
        router.push('/settings');
        onClose();
      },
    },
  ];

  // Quick Action Items
  const actionItems: SearchItem[] = [
    {
      id: 'action-create-link',
      type: 'action',
      title: 'Create new link or QR code',
      subtitle: 'Open the quick creation studio',
      icon: <Link2 className="h-4 w-4 text-[#2a5bd7]" />,
      badge: 'Action',
      onSelect: () => {
        onClose();
        if (onOpenCreate) {
          onOpenCreate();
        } else {
          router.push('/links');
        }
      },
    },
    {
      id: 'action-create-qr',
      type: 'action',
      title: 'Create custom QR code',
      subtitle: 'Jump directly into the QR code builder',
      icon: <QrCode className="h-4 w-4 text-indigo-500" />,
      badge: 'Action',
      onSelect: () => {
        onClose();
        router.push('/qrcodes/create');
      },
    },
    {
      id: 'action-ai',
      type: 'action',
      title: 'Ask Trimly AI Assist',
      subtitle: 'Generate marketing copy or analyze click trends with AI',
      icon: <Sparkles className="h-4 w-4 text-purple-500" />,
      badge: 'AI',
      onSelect: () => {
        onClose();
        toggleAiAssist();
      },
    },
  ];

  // Filter items based on query
  const q = query.trim().toLowerCase();

  const matchingActions = actionItems.filter(
    (item) => !q || item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q)
  );

  const matchingNav = navItems.filter(
    (item) => !q || item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q)
  );

  const matchingLinks: SearchItem[] = links
    .filter(
      (link) =>
        q &&
        (link.title?.toLowerCase().includes(q) ||
          link.shortCode.toLowerCase().includes(q) ||
          link.longUrl.toLowerCase().includes(q) ||
          link.tags?.some((t) => t.toLowerCase().includes(q)))
    )
    .slice(0, 5)
    .map((link) => ({
      id: `link-${link._id}`,
      type: 'link',
      title: link.title || link.shortCode,
      subtitle: link.longUrl,
      icon: <Link2 className="h-4 w-4 text-[#2a5bd7]" />,
      badge: `${link.clickCount || 0} clicks`,
      onSelect: () => {
        router.push(`/links/${link.shortCode}/details`);
        onClose();
      },
    }));

  const matchingQrs: SearchItem[] = qrCodes
    .filter(
      (qr) =>
        q &&
        (qr.title?.toLowerCase().includes(q) ||
          qr.shortCode?.toLowerCase().includes(q) ||
          qr.destinationUrl?.toLowerCase().includes(q))
    )
    .slice(0, 3)
    .map((qr) => ({
      id: `qr-${qr._id}`,
      type: 'qrcode',
      title: qr.title || `QR Code (${qr.shortCode})`,
      subtitle: qr.destinationUrl || 'Dynamic QR',
      icon: <QrCode className="h-4 w-4 text-indigo-500" />,
      badge: 'QR Code',
      onSelect: () => {
        router.push(`/qrcodes/${qr.shortCode || qr._id}/edit`);
        onClose();
      },
    }));

  const allVisibleItems: SearchItem[] = q
    ? [...matchingLinks, ...matchingQrs, ...matchingActions, ...matchingNav]
    : [...matchingActions, ...matchingNav];

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allVisibleItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allVisibleItems.length) % Math.max(1, allVisibleItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allVisibleItems[selectedIndex]) {
        allVisibleItems[selectedIndex].onSelect();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search links, QR codes, or jump to page..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-[#273144] dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-4 flex-1">
          {allVisibleItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
              <FileText className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-[#273144] dark:text-slate-200">No matching results</p>
              <p className="text-xs">Try searching for a different URL, alias, or keyword.</p>
            </div>
          ) : (
            <>
              {/* If query has matching links */}
              {matchingLinks.length > 0 && (
                <div className="space-y-1">
                  <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Links ({matchingLinks.length})
                  </span>
                  {matchingLinks.map((item, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={item.id}
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`px-3 py-2 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#2a5bd7]/10 dark:bg-blue-500/20 text-[#2a5bd7] dark:text-blue-300'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-[#273144] dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-1.5 rounded-md bg-blue-50 dark:bg-slate-800 shrink-0">
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{item.title}</p>
                            <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                          </div>
                        </div>
                        {item.badge && (
                          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Matching QR Codes */}
              {matchingQrs.length > 0 && (
                <div className="space-y-1">
                  <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    QR Codes ({matchingQrs.length})
                  </span>
                  {matchingQrs.map((item, idx) => {
                    const actualIdx = matchingLinks.length + idx;
                    const isSelected = selectedIndex === actualIdx;
                    return (
                      <div
                        key={item.id}
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(actualIdx)}
                        className={`px-3 py-2 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#2a5bd7]/10 dark:bg-blue-500/20 text-[#2a5bd7] dark:text-blue-300'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-[#273144] dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-slate-800 shrink-0">
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{item.title}</p>
                            <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                          </div>
                        </div>
                        {item.badge && (
                          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Quick Actions */}
              {matchingActions.length > 0 && (
                <div className="space-y-1">
                  <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Actions
                  </span>
                  {matchingActions.map((item, idx) => {
                    const actualIdx = matchingLinks.length + matchingQrs.length + idx;
                    const isSelected = selectedIndex === actualIdx;
                    return (
                      <div
                        key={item.id}
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(actualIdx)}
                        className={`px-3 py-2 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#2a5bd7]/10 dark:bg-blue-500/20 text-[#2a5bd7] dark:text-blue-300'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-[#273144] dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold">{item.title}</p>
                            <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                          </div>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#2a5bd7] dark:text-blue-400">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigation */}
              {matchingNav.length > 0 && (
                <div className="space-y-1">
                  <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Navigation
                  </span>
                  {matchingNav.map((item, idx) => {
                    const actualIdx =
                      matchingLinks.length + matchingQrs.length + matchingActions.length + idx;
                    const isSelected = selectedIndex === actualIdx;
                    return (
                      <div
                        key={item.id}
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(actualIdx)}
                        className={`px-3 py-2 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#2a5bd7]/10 dark:bg-blue-500/20 text-[#2a5bd7] dark:text-blue-300'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-[#273144] dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold">{item.title}</p>
                            <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                ↵
              </kbd>{' '}
              Select
            </span>
          </div>
          <span>
            <kbd className="font-mono bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              ESC
            </kbd>{' '}
            Close
          </span>
        </div>
      </div>
    </div>
  );
};
