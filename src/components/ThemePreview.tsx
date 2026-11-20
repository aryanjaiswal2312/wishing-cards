import { motion } from 'framer-motion';
import { THEMES } from '@/themes/themes';
import type { ThemeId } from '@/types';
import { Particles } from './Particles';
import { ThemeScope } from './ThemeScope';

interface ThemePreviewProps {
  theme: ThemeId;
  recipient: string;
  message: string;
}

/** A miniature of the welcome room, re-themed instantly when the choice changes. */
export function ThemePreview({ theme, recipient, message }: ThemePreviewProps) {
  return (
    <motion.div
      key={theme}
      initial={{ opacity: 0.3, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
    >
      <ThemeScope theme={theme} className="theme-bg relative overflow-hidden rounded-3xl border border-line/20 p-6 shadow-xl">
        <Particles count={10} className="absolute inset-0" />
        <div className="relative flex min-h-[19rem] flex-col items-center justify-between text-center">
          <p className="text-xs text-soft">Museum of Us · {THEMES[theme].label}</p>
          <div className="grid justify-items-center gap-4">
            <div className="glass relative grid h-32 w-24 place-items-center rounded-t-full">
              <span className="absolute right-4 top-1/2 h-2.5 w-2.5 rounded-full bg-accent shadow-glow" />
              <span className="h-24 w-px bg-line/30" />
            </div>
            <h3 className="text-3xl leading-tight">For {recipient.trim() || 'you'}</h3>
            <p className="line-clamp-2 max-w-[16rem] text-sm text-soft">{message.trim() || 'Step inside. Every room holds a piece of us.'}</p>
          </div>
          <span className="rounded-full bg-gradient-to-br from-accent to-accent2 px-5 py-2 text-sm font-medium text-accent-ink shadow-lg shadow-accent/25">
            Start exploring
          </span>
        </div>
      </ThemeScope>
    </motion.div>
  );
}
