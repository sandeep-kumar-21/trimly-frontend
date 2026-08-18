import { QrCustomizerState } from '@/components/qrcodes/QrCustomizerCard';
import { QrConfigPayload } from '@/lib/api/qrcodes.api';

/**
 * Exact Dot Types supported by qr-code-styling (6 options):
 * 1. square (default)
 * 2. dots
 * 3. rounded
 * 4. extra-rounded
 * 5. classy
 * 6. classy-rounded
 */
export const PATTERN_TO_DOTS_STYLE: Record<string, string> = {
  p1: 'square',
  p2: 'dots',
  p3: 'rounded',
  p4: 'extra-rounded',
  p5: 'classy',
  p6: 'classy-rounded',
  square: 'square',
  dots: 'dots',
  rounded: 'rounded',
  'extra-rounded': 'extra-rounded',
  classy: 'classy',
  'classy-rounded': 'classy-rounded',
};

export const DOTS_STYLE_TO_PATTERN: Record<string, string> = {
  square: 'p1',
  dots: 'p2',
  rounded: 'p3',
  'extra-rounded': 'p4',
  classy: 'p5',
  'classy-rounded': 'p6',
};

/**
 * Exact Corner Styles supported by qr-code-styling:
 * cornersSquareOptions.type: 'square' | 'dot' | 'extra-rounded' (3 options)
 * cornersDotOptions.type: 'square' | 'dot' (2 options)
 *
 * Combinations:
 * c1: square outer + square inner
 * c2: square outer + dot inner
 * c3: extra-rounded outer + square inner
 * c4: extra-rounded outer + dot inner
 * c5: dot outer + dot inner (concentric circles)
 * c6: dot outer + square inner
 */
export const CORNER_CONFIG_MAP: Record<string, { cornersStyle: string; cornersDotStyle: string }> = {
  c1: { cornersStyle: 'square', cornersDotStyle: 'square' },
  c2: { cornersStyle: 'square', cornersDotStyle: 'dot' },
  c3: { cornersStyle: 'extra-rounded', cornersDotStyle: 'square' },
  c4: { cornersStyle: 'extra-rounded', cornersDotStyle: 'dot' },
  c5: { cornersStyle: 'dot', cornersDotStyle: 'dot' },
  c6: { cornersStyle: 'dot', cornersDotStyle: 'square' },
};

export const CORNER_TO_CORNERS_STYLE: Record<string, string> = {
  c1: 'square',
  c2: 'square',
  c3: 'extra-rounded',
  c4: 'extra-rounded',
  c5: 'dot',
  c6: 'dot',
};

export const CORNER_TO_CORNERS_DOT_STYLE: Record<string, string> = {
  c1: 'square',
  c2: 'dot',
  c3: 'square',
  c4: 'dot',
  c5: 'dot',
  c6: 'square',
};

export function mapCornerToStyles(cornerId: string): { cornersStyle: string; cornersDotStyle: string } {
  return CORNER_CONFIG_MAP[cornerId] || { cornersStyle: 'square', cornersDotStyle: 'square' };
}

export function mapStylesToCorner(cornersStyle?: string, cornersDotStyle?: string): string {
  const sq = cornersStyle || 'square';
  const dot = cornersDotStyle || 'square';

  for (const [id, cfg] of Object.entries(CORNER_CONFIG_MAP)) {
    if (cfg.cornersStyle === sq && cfg.cornersDotStyle === dot) {
      return id;
    }
  }

  // Fallback match on outer shape
  if (sq === 'dot') return 'c5';
  if (sq === 'extra-rounded') return 'c4';
  return 'c1';
}

/**
 * Converts frontend QR customizer state into backend QrConfigPayload.
 */
export function mapCustomizerToQrConfig(state: QrCustomizerState): QrConfigPayload {
  const cornerConfig = mapCornerToStyles(state.corner);
  return {
    dotsStyle: PATTERN_TO_DOTS_STYLE[state.pattern] || state.pattern || 'square',
    cornersStyle: cornerConfig.cornersStyle,
    cornersDotStyle: cornerConfig.cornersDotStyle,
    dotsColor: state.codeColor || '#000000',
    backgroundColor: state.bgColor || '#ffffff',
    logoUrl: state.logoOption !== 'none' ? state.logoOption : null,
    centerText: null,
  };
}

/**
 * Converts backend QrConfig into frontend QrCustomizerState.
 */
export function mapQrConfigToCustomizerState(config?: any): QrCustomizerState {
  if (!config) {
    return {
      pattern: 'p1',
      corner: 'c1',
      presetColor: '#000000',
      codeColor: '#000000',
      bgColor: '#FFFFFF',
      useQrColorForCorners: true,
      logoOption: 'none',
    };
  }

  const pattern = DOTS_STYLE_TO_PATTERN[config.dotsStyle] || 'p1';
  const corner = mapStylesToCorner(config.cornersStyle, config.cornersDotStyle);
  const codeColor = config.dotsColor || '#000000';
  const bgColor = config.backgroundColor || '#FFFFFF';
  const logoOption = config.logoUrl || 'none';

  return {
    pattern,
    corner,
    presetColor: codeColor,
    codeColor,
    bgColor,
    useQrColorForCorners: true,
    logoOption,
  };
}
