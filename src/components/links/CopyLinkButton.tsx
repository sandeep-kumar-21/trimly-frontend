'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';

export interface CopyLinkButtonProps {
  url: string;
  variant?: 'outline' | 'ghost' | 'primary';
  size?: 'sm' | 'md' | 'icon';
  showLabel?: boolean;
  className?: string;
}

export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({
  url,
  variant = 'outline',
  size = 'sm',
  showLabel = true,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!', { description: url });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(copied && 'text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40', className)}
      leftIcon={copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    >
      {showLabel && (copied ? 'Copied' : 'Copy')}
    </Button>
  );
};
