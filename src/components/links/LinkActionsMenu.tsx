'use client';

import React, { useState } from 'react';
import { MoreHorizontal, BarChart3, Copy, Trash2, ExternalLink } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ShortLink } from '@/types/link.types';
import { useRouter } from 'next/navigation';
import { useLinks } from '@/hooks/useLinks';
import { toast } from 'sonner';
import { copyToClipboard } from '@/lib/utils/clipboard';

export interface LinkActionsMenuProps {
  link: ShortLink;
}

export const LinkActionsMenu: React.FC<LinkActionsMenuProps> = ({ link }) => {
  const router = useRouter();
  const { deleteLink, isDeleting } = useLinks();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const shortUrl = link.shortUrl || `/${link.shortCode}`;

  const menuItems = [
    {
      label: 'View Analytics',
      icon: <BarChart3 className="h-4 w-4 text-[#2a5bd7]" />,
      onClick: () => router.push(`/links/${link.shortCode}`),
    },
    {
      label: 'Copy Link',
      icon: <Copy className="h-4 w-4 text-slate-500" />,
      onClick: async () => {
        const success = await copyToClipboard(shortUrl);
        if (success) {
          toast.success('Link copied to clipboard!');
        } else {
          toast.error('Failed to copy link');
        }
      },
    },
    {
      label: 'Visit Link',
      icon: <ExternalLink className="h-4 w-4 text-slate-500" />,
      onClick: () => window.open(link.longUrl, '_blank', 'noopener,noreferrer'),
    },
    {
      label: 'Delete Link',
      icon: <Trash2 className="h-4 w-4" />,
      danger: true,
      onClick: () => setIsDeleteOpen(true),
    },
  ];

  const handleDeleteConfirm = async () => {
    try {
      await deleteLink(link.shortCode);
      setIsDeleteOpen(false);
    } catch {
      // Handled in mutation
    }
  };

  return (
    <>
      <Dropdown
        trigger={
          <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        }
        items={menuItems}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Short Link?"
        description={`Are you sure you want to delete /${link.shortCode}? People clicking this link will no longer be redirected.`}
        confirmText="Delete Link"
        isLoading={isDeleting}
      />
    </>
  );
};
