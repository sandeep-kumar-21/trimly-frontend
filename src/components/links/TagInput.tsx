import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTags } from '@/hooks/useTags';
import { Checkbox } from '@/components/ui/Checkbox';
import { toast } from 'sonner';

export interface TagInputProps {
  selectedTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ selectedTags, onAddTag, onRemoveTag }) => {
  const { tags: availableTags, isLoading } = useTags();
  const [searchTerm, setSearchTerm] = useState('');

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

      if (selectedTags.length >= 10) {
        toast.warning('A link cannot have more than 10 tags.');
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

      if (selectedTags.some((t) => t.toLowerCase() === cleanTag.toLowerCase())) {
        toast.warning(`Tag "${cleanTag}" is already added.`);
        setSearchTerm('');
        return;
      }

      onAddTag(cleanTag);
      toast.success(`Tag "${cleanTag}" added.`);
      setSearchTerm('');
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      onRemoveTag(tag);
    } else {
      if (selectedTags.length >= 10) {
        toast.warning('A link cannot have more than 10 tags.');
        return;
      }
      onAddTag(tag);
      toast.success(`Tag "${tag}" added.`);
    }
  };

  return (
    <div className="w-56 p-2 bg-white rounded-lg shadow-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-sm">
      <div className="relative mb-2">
        <input
          type="text"
          maxLength={7}
          placeholder={selectedTags.length >= 10 ? 'Max 10 tags reached' : 'Search or add tag'}
          disabled={selectedTags.length >= 10}
          value={searchTerm}
          onChange={(e) => {
            const raw = e.target.value.slice(0, 7);
            if (/[^a-zA-Z0-9_-]/.test(raw)) {
              toast.warning('Tags can only contain letters, numbers, hyphens, and underscores.');
            }
            setSearchTerm(raw.replace(/[^a-zA-Z0-9_-]/g, ''));
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-2 pr-8 py-1.5 border-b border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#2a5bd7] transition-colors disabled:cursor-not-allowed"
          autoFocus
        />
        <Search className="absolute right-2 top-2 h-4 w-4 text-slate-400" />
      </div>

      <ul className="max-h-48 overflow-y-auto space-y-1">
        {isLoading ? (
          <li className="px-2 py-1.5 text-slate-500">Loading...</li>
        ) : filteredTags.length > 0 ? (
          filteredTags.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
              onClick={() => toggleTag(tag)}
            >
              <Checkbox
                checked={selectedTags.includes(tag)}
                readOnly
                tabIndex={-1}
              />
              <span className="text-[#273144] dark:text-slate-200 truncate text-sm font-medium">{tag}</span>
            </li>
          ))
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
