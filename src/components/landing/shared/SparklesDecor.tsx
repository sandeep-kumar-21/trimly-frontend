'use client';

import React from 'react';

export const SparklesDecor: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      {/* 4-point Sparkle 1 (Top Left) */}
      <svg
        className="absolute top-16 left-[12%] h-8 w-8 text-blue-300/25 animate-pulse"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>

      {/* 4-point Sparkle 2 (Top Right) */}
      <svg
        className="absolute top-24 right-[14%] h-10 w-10 text-indigo-300/20 animate-pulse delay-300"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>

      {/* 8-point Asterisk Sparkle (Mid Left) */}
      <svg
        className="absolute top-52 left-[8%] h-12 w-12 text-slate-400/15"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      >
        <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
      </svg>

      {/* 4-point Sparkle 3 (Bottom Center) */}
      <svg
        className="absolute bottom-28 right-[10%] h-7 w-7 text-blue-400/20 animate-pulse delay-700"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
    </div>
  );
};
