'use client';

import React from 'react';
import { Tag, PlusCircle } from 'lucide-react';
import { TagInput } from '../TagInput';

export interface LinkTagsSectionProps {
  tags?: string[];
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
  tagMenuRef: React.RefObject<HTMLDivElement | null>;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  layout?: 'stacked' | 'inline';
}

export const LinkTagsSection: React.FC<LinkTagsSectionProps> = ({
  tags = [],
  isOpen,
  onToggle,
  tagMenuRef,
  onAddTag,
  onRemoveTag,
  layout = 'stacked',
}) => {
  if (layout === 'inline') {
    return (
      <div className="hidden sm:inline-flex group/tags items-center gap-2.5">
        <span className="flex items-center gap-1.5">
          <Tag className="h-4 w-4 text-slate-400 shrink-0" />
          {tags.length > 0 ? (
            <span className="flex items-center gap-1.5 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-sm bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </span>
          ) : (
            <span className="text-xs text-slate-400">No tags</span>
          )}
        </span>

        <div className="relative shrink-0" ref={tagMenuRef}>
          <button
            type="button"
            onClick={onToggle}
            className={`text-[#2a5bd7] font-semibold hover:underline flex items-center gap-1 cursor-pointer transition-opacity duration-200 ${
              isOpen ? 'opacity-100' : 'opacity-0 group-hover/tags:opacity-100'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add tag</span>
          </button>
          {isOpen && (
            <div className="absolute left-0 bottom-full mb-1 z-50">
              <TagInput
                selectedTags={tags}
                onAddTag={onAddTag}
                onRemoveTag={onRemoveTag}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1 text-xs text-[#526281] dark:text-slate-400 pt-0.5">
      <div className="flex items-center gap-1.5">
        <Tag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        {tags.length > 0 ? (
          <span className="flex items-center gap-1.5 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-sm bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {tag}
              </span>
            ))}
          </span>
        ) : (
          <span className="text-xs text-slate-400">No tags</span>
        )}
      </div>

      <div className="relative inline-block" ref={tagMenuRef}>
        <button
          type="button"
          onClick={onToggle}
          className="text-[#2a5bd7] font-semibold hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Add tag</span>
        </button>
        {isOpen && (
          <div className="absolute left-0 bottom-full mb-1 z-50">
            <TagInput
              selectedTags={tags}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
            />
          </div>
        )}
      </div>
    </div>
  );
};
