import type { ReactNode } from 'react';
import { themeStyle } from '@/themes/themes';
import type { ThemeId } from '@/types';
import { cn } from '@/utils/cn';

/** Scopes a theme to a single element, e.g. for live previews. */
export function ThemeScope({ theme, className, children }: { theme: ThemeId; className?: string; children: ReactNode }) {
  return (
    <div style={themeStyle(theme)} className={cn('text-ink', className)}>
      {children}
    </div>
  );
}
