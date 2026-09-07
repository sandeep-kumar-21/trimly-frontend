'use client';

import React, { useState, useEffect } from 'react';
import { useCampaignMutations } from '@/hooks/useCampaignMutations';
import { useUserChannels } from '@/hooks/useUserChannels';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Plus, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  initialName: string;
  initialDescription?: string | null;
  initialChannels?: string[];
}

export const EditCampaignModal: React.FC<EditCampaignModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  initialName,
  initialDescription,
  initialChannels = ['email', 'social', 'sms', 'paid'],
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription || '');
  const [channels, setChannels] = useState<string[]>(initialChannels);
  const [customChannelInput, setCustomChannelInput] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const { channels: userChannels = [] } = useUserChannels();
  const { updateCampaign, isUpdating } = useCampaignMutations();

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription || '');
    setChannels(initialChannels);
  }, [initialName, initialDescription, initialChannels, isOpen]);

  const allAvailableChannels = Array.from(
    new Set([...initialChannels, ...userChannels, 'email', 'social', 'sms', 'paid', 'linkedin', 'youtube', 'newsletters']),
  );

  const handleToggleChannel = (ch: string) => {
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch],
    );
  };

  const handleAddCustom = () => {
    const clean = customChannelInput.trim().toLowerCase();
    if (!clean) return;
    if (!channels.includes(clean)) {
      setChannels([...channels, clean]);
    }
    setCustomChannelInput('');
    setIsAddingCustom(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Campaign name is required');
      return;
    }

    try {
      await updateCampaign({
        id: campaignId,
        payload: {
          name: name.trim(),
          description: description.trim() || undefined,
          channels,
        },
      });
      onClose();
    } catch {
      // Handled by hook
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Campaign"
      description="Update campaign name, description, and marketing channels."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Campaign Name */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
            Campaign Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Q4 Growth Sprint"
            className="w-full h-10 sm:h-11 rounded-md border border-slate-300 bg-white px-3.5 sm:px-4 text-xs sm:text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Campaign Description */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
            Description <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional context or marketing goals..."
            className="w-full rounded-md border border-slate-300 bg-white p-3 text-xs sm:text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Marketing Channels */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
              Active Marketing Channels ({channels.length})
            </label>
            <span className="text-xs text-slate-400">Used for channel telemetry</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allAvailableChannels.map((ch) => {
              const isSelected = channels.includes(ch);
              return (
                <button
                  key={ch}
                  type="button"
                  onClick={() => handleToggleChannel(ch)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#e8effe] text-[#2a5bd7] border border-blue-200 shadow-2xs dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span className="capitalize">{ch}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                </button>
              );
            })}

            {/* Custom Channel Input Toggle */}
            {isAddingCustom ? (
              <div className="inline-flex items-center gap-1.5">
                <input
                  type="text"
                  autoFocus
                  value={customChannelInput}
                  onChange={(e) => setCustomChannelInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustom();
                    } else if (e.key === 'Escape') {
                      setIsAddingCustom(false);
                    }
                  }}
                  placeholder="Channel name"
                  className="h-8 w-28 rounded-md border border-blue-400 bg-white px-2 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="h-8 px-2 rounded-md bg-[#2a5bd7] text-xs font-bold text-white hover:bg-[#1d4cc9] cursor-pointer"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingCustom(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-dashed border-slate-300 text-[#2a5bd7] hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Custom channel</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating || !name.trim()} className="w-full sm:w-auto font-bold">
            {isUpdating ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
