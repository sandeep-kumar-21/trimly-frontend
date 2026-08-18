import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTags } from '@/hooks/useTags';

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
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      e.preventDefault();
      const newTag = searchTerm.trim();
      if (!selectedTags.includes(newTag)) {
        onAddTag(newTag);
      }
      setSearchTerm('');
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onRemoveTag(tag);
    } else {
      onAddTag(tag);
    }
  };

  return (
    <div className="w-56 p-2 bg-white rounded-lg shadow-lg border border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-sm">
      <div className="relative mb-2">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-2 pr-8 py-1.5 border-b border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#2a5bd7] transition-colors"
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
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
              onClick={() => toggleTag(tag)}
            >
              <label className="flex items-center gap-2 cursor-pointer w-full">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  readOnly
                  className="h-3.5 w-3.5 rounded-sm border-slate-300 text-[#2a5bd7] focus:ring-[#2a5bd7]"
                />
                <span className="text-slate-700 dark:text-slate-200 truncate">{tag}</span>
              </label>
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
