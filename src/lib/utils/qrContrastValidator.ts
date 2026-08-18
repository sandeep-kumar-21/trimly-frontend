/**
 * Utility to calculate WCAG 2.1 contrast ratio and color distance
 * between QR code foreground and background colors to ensure scannability.
 */

export interface ContrastResult {
  isValid: boolean;
  isLowContrast: boolean;
  contrastRatio: number;
  distance: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!hex || typeof hex !== 'string') return null;
  const cleanHex = hex.replace(/^#/, '').trim();
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16),
    };
  }
  if (cleanHex.length === 6) {
    return {
      r: parseInt(cleanHex.slice(0, 2), 16),
      g: parseInt(cleanHex.slice(2, 4), 16),
      b: parseInt(cleanHex.slice(4, 6), 16),
    };
  }
  return null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function checkQrContrast(codeColor?: string, bgColor?: string): ContrastResult {
  const c1 = codeColor || '#000000';
  const c2 = bgColor || '#ffffff';

  const rgb1 = hexToRgb(c1);
  const rgb2 = hexToRgb(c2);

  if (!rgb1 || !rgb2) {
    return { isValid: true, isLowContrast: false, contrastRatio: 21, distance: 441 };
  }

  // Calculate Euclidean RGB distance
  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );

  // Calculate relative luminance & WCAG contrast ratio
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const contrastRatio = (lighter + 0.05) / (darker + 0.05);

  // Identical or very close colors (distance < 50 or contrast ratio < 2.0:1)
  const isIdentical = c1.toLowerCase() === c2.toLowerCase();
  const isLowContrast = isIdentical || distance < 50 || contrastRatio < 2.0;

  return {
    isValid: !isLowContrast,
    isLowContrast,
    contrastRatio,
    distance,
  };
}
