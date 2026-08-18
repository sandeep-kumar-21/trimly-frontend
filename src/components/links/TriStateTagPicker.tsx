import React, { useState, useMemo } from 'react';
import { Search, Minus } from 'lucide-react';
import { useTags } from '@/hooks/useTags';

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
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      e.preventDefault();
      const newTag = searchTerm.trim();
      onAddTag(newTag);
      setSearchTerm('');
    }
  };

  const handleTagClick = (tag: string) => {
    const currentState = tagStates[tag] || 'unchecked';
    if (currentState === 'checked') {
      onRemoveTag(tag);
    } else {
      // If 'dash' or 'unchecked', click adds it to all
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
          filteredTags.map((tag) => {
            const state = tagStates[tag] || 'unchecked';
            return (
              <li
                key={tag}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
                onClick={() => handleTagClick(tag)}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                    state === 'checked'
                      ? 'bg-[#2a5bd7] border-[#2a5bd7] text-white'
                      : state === 'dash'
                      ? 'bg-[#2a5bd7] border-[#2a5bd7] text-white'
                      : 'border-slate-300 bg-white dark:bg-transparent dark:border-slate-600'
                  }`}
                >
                  {state === 'checked' && (
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {state === 'dash' && <Minus className="h-3 w-3" strokeWidth={3} />}
                </div>
                <span className="text-slate-700 dark:text-slate-200 truncate select-none">
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
