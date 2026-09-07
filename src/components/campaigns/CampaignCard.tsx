'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Link2,
  MousePointerClick,
  ChevronRight,
  Calendar,
  MoreVertical,
  PlusCircle,
  Edit2,
  Trash2,
  Trophy,
} from 'lucide-react';
import { Campaign } from '@/types/campaign.types';
import { formatNumber } from '@/lib/utils/formatNumber';
import { formatDate } from '@/lib/utils/formatDate';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useCampaignMutations } from '@/hooks/useCampaignMutations';

interface CampaignCardProps {
  campaign: Campaign;
  onOpenAddLinks?: (campaign: Campaign) => void;
  onOpenEdit?: (campaign: Campaign) => void;
}

const channelBadgeStyles: Record<string, string> = {
  email: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800',
  social: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
  sms: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  paid: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  linkedin: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
  youtube: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
  newsletters: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
  other: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onOpenAddLinks,
  onOpenEdit,
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { deleteCampaign, isDeleting } = useCampaignMutations();

  useEffect(() => {
    if (campaign._id) {
      router.prefetch(`/campaigns/${campaign._id}`);
    }
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [campaign._id, router]);

  const handleDelete = async () => {
    try {
      await deleteCampaign(campaign._id);
      setIsDeleteOpen(false);
    } catch {
      // Handled by hook
    }
  };

  const channels = campaign.channels || ['email', 'social', 'sms', 'paid'];

  return (
    <>
      <div
        onClick={() => router.push(`/campaigns/${campaign._id}`)}
        className={`group relative flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4.5 sm:p-6 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50 cursor-pointer ${isMenuOpen ? 'z-30' : 'z-0'}`}
      >
        <div>
          {/* Header Row: Title, Created Date, Actions Menu */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold tracking-tight text-[#273144] transition-colors group-hover:text-[#2a5bd7] dark:text-slate-100 dark:group-hover:text-blue-400 truncate">
                {campaign.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created {formatDate(campaign.createdAt)}</span>
              </div>
            </div>

            {/* Actions Menu */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isMenuOpen
                    ? 'text-[#2a5bd7] bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
                aria-label="Campaign actions menu"
              >
                <MoreVertical className="h-4.5 w-4.5" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xl z-50 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      router.push(`/campaigns/${campaign._id}`);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                    <span>View dashboard</span>
                  </button>
                  {onOpenAddLinks && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        onOpenAddLinks(campaign);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                      <span>Add links</span>
                    </button>
                  )}
                  {onOpenEdit && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                        onOpenEdit(campaign);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-4.5 w-4.5 shrink-0 text-[#273144] dark:text-slate-200" />
                      <span>Edit campaign</span>
                    </button>
                  )}
                  <hr className="my-1 border-slate-100 dark:border-slate-800" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      setIsDeleteOpen(true);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#273144] hover:bg-rose-50 hover:text-rose-600 dark:text-slate-200 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer group/delete"
                  >
                    <Trash2 className="h-4.5 w-4.5 shrink-0 text-[#273144] group-hover/delete:text-rose-600 dark:text-slate-200 dark:group-hover/delete:text-rose-400 transition-colors" />
                    <span>Delete campaign</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {campaign.description && (
            <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {campaign.description}
            </p>
          )}

          {/* Channel Chips Preview */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {channels.slice(0, 4).map((ch) => (
              <span
                key={ch}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {ch.charAt(0).toUpperCase() + ch.slice(1)}
              </span>
            ))}
            {channels.length > 4 && (
              <span className="text-[11px] font-semibold text-slate-400 self-center">
                +{channels.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <Link2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>{formatNumber(campaign.totalLinks || 0)} links</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <MousePointerClick className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>{formatNumber(campaign.totalClicks || 0)} clicks</span>
            </span>
          </div>

          {campaign.topChannel && campaign.topChannel.clicks > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-slate-200 bg-white text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <Trophy className="h-3 w-3 text-slate-500 dark:text-slate-400" />
              <span>Top: {campaign.topChannel.channel}</span>
            </span>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Campaign?"
        description={`Are you sure you want to delete "${campaign.name}"? All associated links will remain active but will be unlinked from this campaign.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};
