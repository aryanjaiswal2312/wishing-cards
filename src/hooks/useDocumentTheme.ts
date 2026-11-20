import { useEffect } from 'react';
import { applyTheme, DEFAULT_THEME } from '@/themes/themes';
import type { ThemeId } from '@/types';

/** Applies a theme to the page while the calling component is mounted. */
export function useDocumentTheme(theme: ThemeId): void {
  useEffect(() => {
    applyTheme(theme);
    return () => applyTheme(DEFAULT_THEME);
  }, [theme]);
}
