'use client';

import React from 'react';
import Image from 'next/image';

export interface SharedEmptyLandingProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: string;
  primaryButtonText: string;
  onPrimaryClick: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
  className?: string;
}

export const SharedEmptyLanding: React.FC<SharedEmptyLandingProps> = ({
  imageSrc,
  imageAlt = 'Illustration',
  title,
  description,
  primaryButtonText,
  onPrimaryClick,
  secondaryButtonText = 'Learn more',
  onSecondaryClick,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center pt-2 pb-10 text-center max-w-2xl mx-auto space-y-4 px-4 animate-fadeIn ${className}`}
    >
      {/* Hero Illustration */}
      <div className="relative w-full max-w-[340px] sm:max-w-[400px] flex items-center justify-center">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={225}
          priority
          className="w-full rounded-xl max-w-[400px] h-auto object-contain mx-auto shadow-2xs"
        />
      </div>

      {/* Heading & Subheading */}
      <div className="space-y-2 pt-2">
        <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#273144] dark:text-slate-100">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-[#526281] dark:text-slate-400 leading-relaxed max-w-lg mx-auto font-medium">
          {description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onPrimaryClick}
          className="h-11 px-7 rounded-md bg-[#2a5bd7] text-white font-bold text-sm hover:bg-[#1d4cc9] transition-all shadow-sm cursor-pointer"
        >
          {primaryButtonText}
        </button>

        {secondaryButtonText && (
          <div>
            <button
              type="button"
              onClick={onSecondaryClick}
              className="text-sm font-semibold text-[#2a5bd7] hover:underline cursor-pointer dark:text-blue-400"
            >
              {secondaryButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
