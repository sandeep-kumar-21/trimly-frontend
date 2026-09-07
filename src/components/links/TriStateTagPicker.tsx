import React, { useState, useMemo } from 'react';
import { Minus } from 'lucide-react';
import { useTags } from '@/hooks/useTags';
import { SearchInput } from '@/components/ui/SearchInput';
import { Checkbox } from '@/components/ui/Checkbox';
import { toast } from 'sonner';

export interface TriStateTagPickerProps {
  selectedLinkTags: string[][]; // Array of tags arrays from the selected links
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TriStateTagPicker: React.FC<TriStateTagPickerProps> = ({
  selectedLinkTags,
  onAddTag,
  onRemoveTag,
}) => {
  const { tags: availableTags, isLoading } = useTags();
  const [searchTerm, setSearchTerm] = useState('');

  const numLinks = selectedLinkTags.length;

  // Compute state for each tag
  const tagStates = useMemo(() => {
    const states: Record<string, 'checked' | 'dash' | 'unchecked'> = {};
    for (const tag of availableTags) {
      const count = selectedLinkTags.filter((tagsArr) => tagsArr.includes(tag)).length;
      if (count === 0) {
        states[tag] = 'unchecked';
      } else if (count === numLinks) {
        states[tag] = 'checked';
      } else {
        states[tag] = 'dash';
      }
    }
    return states;
  }, [availableTags, selectedLinkTags, numLinks]);

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const raw = searchTerm.trim();
      if (!raw) {
        toast.warning('Please enter a tag.');
        return;
      }

      if (raw.length > 7) {
        toast.warning('Each tag cannot exceed 7 characters.');
      }

      if (/[^a-zA-Z0-9_-]/.test(raw)) {
        toast.warning('Tags can only contain letters, numbers, hyphens, and underscores.');
      }

      const cleanTag = raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 7);
      if (!cleanTag) {
        setSearchTerm('');
        return;
      }

      onAddTag(cleanTag);
      toast.success(`Tag "${cleanTag}" applied to selected links.`);
      setSearchTerm('');
    }
  };

  const handleTagClick = (tag: string) => {
    const currentState = tagStates[tag] || 'unchecked';
    if (currentState === 'checked') {
      onRemoveTag(tag);
    } else {
      onAddTag(tag);
      toast.success(`Tag "${tag}" applied to selected links.`);
    }
  };

  return (
    <div className="w-56 p-2 bg-white rounded-md shadow-lg border border-slate-200/90 dark:bg-slate-900 dark:border-slate-800 text-sm">
      <div className="mb-2">
        <SearchInput
          variant="minimal"
          iconPosition="right"
          maxLength={7}
          placeholder="Search or add tag"
          value={searchTerm}
          onChange={(val) => {
            const raw = val.slice(0, 7);
            if (/[^a-zA-Z0-9_-]/.test(raw)) {
              toast.warning('Tags can only contain letters, numbers, hyphens, and underscores.');
            }
            setSearchTerm(raw.replace(/[^a-zA-Z0-9_-]/g, ''));
          }}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>

      <ul className="max-h-48 overflow-y-auto space-y-0.5">
        {isLoading ? (
          <li className="px-3 py-1.5 text-slate-500">Loading...</li>
        ) : filteredTags.length > 0 ? (
          filteredTags.map((tag) => {
            const state = tagStates[tag] || 'unchecked';
            return (
              <li
                key={tag}
                className="flex items-center gap-2.5 px-3 py-1.5 sm:py-2 hover:bg-[#f4f6f8] dark:hover:bg-slate-800/80 rounded-md cursor-pointer transition-colors"
                onClick={() => handleTagClick(tag)}
              >
                <Checkbox
                  checked={state === 'checked'}
                  indeterminate={state === 'dash'}
                  readOnly
                  tabIndex={-1}
                />
                <span className="text-[#273144] dark:text-slate-200 font-medium truncate select-none">
                  {tag}
                </span>
              </li>
            );
          })
        ) : (
          <li className="px-2 py-1.5 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            {availableTags.length === 0
              ? 'No tags exist. Enter text and hit enter to create a new tag.'
              : 'No matches. Hit enter to create a new tag.'}
          </li>
        )}
      </ul>
    </div>
  );
};
