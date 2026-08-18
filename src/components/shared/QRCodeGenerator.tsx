'use client';

import React, { useEffect, useRef } from 'react';
import QRCodeStyling, { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';

export interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
  dotsStyle?: string;
  cornersStyle?: string;
  cornersDotStyle?: string;
  logoUrl?: string | null;
  type?: 'svg' | 'canvas';
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 180,
  fgColor = '#273144',
  bgColor = '#ffffff',
  className,
  dotsStyle = 'square',
  cornersStyle = 'square',
  cornersDotStyle = 'square',
  logoUrl = null,
  type = 'svg',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const qrCode = useRef<QRCodeStyling>(
    new QRCodeStyling({
      type: type,
      width: size,
      height: size,
      data: value || 'https://trimly.link',
      image: logoUrl || undefined,
      dotsOptions: {
        color: fgColor,
        type: dotsStyle as DotType,
      },
      cornersSquareOptions: {
        type: cornersStyle as CornerSquareType,
      },
      cornersDotOptions: {
        type: cornersDotStyle as CornerDotType,
      },
      backgroundOptions: {
        color: bgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10,
        imageSize: 0.3,
      },
      qrOptions: {
        errorCorrectionLevel: logoUrl ? 'H' : 'M',
      },
    })
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
      qrCode.current.append(ref.current);
    }
  }, []);

  useEffect(() => {
    qrCode.current.update({
      type: type,
      width: size,
      height: size,
      data: value || 'https://trimly.link',
      image: logoUrl || undefined,
      dotsOptions: {
        color: fgColor,
        type: dotsStyle as DotType,
      },
      cornersSquareOptions: {
        type: cornersStyle as CornerSquareType,
      },
      cornersDotOptions: {
        type: cornersDotStyle as CornerDotType,
      },
      backgroundOptions: {
        color: bgColor,
      },
      qrOptions: {
        errorCorrectionLevel: logoUrl ? 'H' : 'M',
      },
    });
  }, [value, size, fgColor, bgColor, dotsStyle, cornersStyle, cornersDotStyle, logoUrl, type]);

  return (
    <div
      ref={ref}
      style={{ width: size, height: size }}
      className={`[&>canvas]:w-full [&>canvas]:h-full [&>svg]:w-full [&>svg]:h-full flex items-center justify-center ${className || ''}`}
    />
  );
};
