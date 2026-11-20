import type { CSSProperties } from 'react';
import type { ThemeId } from '@/types';

/**
 * Single source of truth for all four themes.
 * Colours are stored as "R G B" triplets so Tailwind can add alpha
 * (e.g. bg-accent/20) and they are applied as CSS custom properties.
 */
type TokenName =
  | 'bg-from' | 'bg-via' | 'bg-to'
  | 'ink' | 'soft'
  | 'accent' | 'accent-2' | 'accent-ink'
  | 'surface' | 'surface-alpha' | 'field-alpha'
  | 'line' | 'line-alpha' | 'shadow';

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  tagline: string;
  colorScheme: 'light' | 'dark';
  swatch: readonly [string, string, string];
  tokens: Record<TokenName, string>;
}

export const DEFAULT_THEME: ThemeId = 'rose';

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  rose: {
    id: 'rose',
    label: 'Rose',
    tagline: 'Blush pink with a warm red heart',
    colorScheme: 'light',
    swatch: ['#d23868', '#ee7062', '#fac8dc'],
    tokens: {
      'bg-from': '255 245 247', 'bg-via': '255 228 235', 'bg-to': '250 200 220',
      ink: '72 22 42', soft: '128 74 94',
      accent: '210 56 104', 'accent-2': '238 112 98', 'accent-ink': '255 255 255',
      surface: '255 255 255', 'surface-alpha': '0.55', 'field-alpha': '0.7',
      line: '210 56 104', 'line-alpha': '0.18', shadow: '150 40 80',
    },
  },
  midnight: {
    id: 'midnight',
    label: 'Midnight',
    tagline: 'Deep navy with golden highlights',
    colorScheme: 'dark',
    swatch: ['#e5ba66', '#8c9cf6', '#101632'],
    tokens: {
      'bg-from': '8 12 28', 'bg-via': '16 22 50', 'bg-to': '32 28 64',
      ink: '236 240 255', soft: '160 170 205',
      accent: '229 186 102', 'accent-2': '140 156 246', 'accent-ink': '24 22 40',
      surface: '255 255 255', 'surface-alpha': '0.07', 'field-alpha': '0.08',
      line: '255 255 255', 'line-alpha': '0.16', shadow: '0 0 0',
    },
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset',
    tagline: 'Amber and orange, golden hour glow',
    colorScheme: 'light',
    swatch: ['#e26218', '#f4a41e', '#fcbe8c'],
    tokens: {
      'bg-from': '255 246 230', 'bg-via': '255 226 190', 'bg-to': '252 190 140',
      ink: '80 36 14', soft: '140 84 46',
      accent: '226 98 24', 'accent-2': '244 164 30', 'accent-ink': '255 255 255',
      surface: '255 255 255', 'surface-alpha': '0.55', 'field-alpha': '0.7',
      line: '226 98 24', 'line-alpha': '0.2', shadow: '170 80 20',
    },
  },
  mint: {
    id: 'mint',
    label: 'Mint',
    tagline: 'Fresh greens, calm and bright',
    colorScheme: 'light',
    swatch: ['#128c68', '#40bc9c', '#b8ead6'],
    tokens: {
      'bg-from': '238 252 245', 'bg-via': '214 246 230', 'bg-to': '184 234 214',
      ink: '16 60 48', soft: '58 108 92',
      accent: '18 140 104', 'accent-2': '64 188 156', 'accent-ink': '255 255 255',
      surface: '255 255 255', 'surface-alpha': '0.55', 'field-alpha': '0.7',
      line: '18 140 104', 'line-alpha': '0.2', shadow: '20 100 80',
    },
  },
};

export const THEME_LIST: ThemeDefinition[] = Object.values(THEMES);
export const THEME_IDS = Object.keys(THEMES) as ThemeId[];

export const isThemeId = (value: unknown): value is ThemeId => THEME_IDS.some((id) => id === value);

/** Inline style that scopes a theme to one element (used for previews). */
export function themeStyle(id: ThemeId): CSSProperties {
  const theme = THEMES[id];
  const style: Record<string, string> = { colorScheme: theme.colorScheme };
  for (const [name, value] of Object.entries(theme.tokens)) style[`--${name}`] = value;
  return style as CSSProperties;
}

/** Applies a theme to the whole document. */
export function applyTheme(id: ThemeId, el: HTMLElement = document.documentElement): void {
  const theme = THEMES[id];
  for (const [name, value] of Object.entries(theme.tokens)) el.style.setProperty(`--${name}`, value);
  el.style.colorScheme = theme.colorScheme;
  el.dataset.theme = id;
}
