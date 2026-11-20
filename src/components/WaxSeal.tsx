import { useId } from 'react';
import type { SealColor } from '@/types';
import { SEAL_COLORS } from '@/utils/constants';

export function WaxSeal({ color, size = 64 }: { color: SealColor; size?: number }) {
  const gradientId = useId();
  const c = SEAL_COLORS[color];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`${c.label} wax seal`}>
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="55%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.dark} />
        </radialGradient>
      </defs>
      <path
        d="M50 4c9 0 12 6 20 8s14 6 15 15 6 12 8 21-4 13-8 20-5 13-14 17-13 6-21 6-13-3-21-6-13-9-15-17-8-12-8-20 4-12 8-21 6-12 15-15S41 4 50 4Z"
        fill={`url(#${gradientId})`}
      />
      <circle cx="50" cy="50" r="31" fill="none" stroke={c.dark} strokeOpacity="0.45" strokeWidth="2" />
      <path
        transform="translate(30 31) scale(1.67)"
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        fill={c.light}
        fillOpacity="0.85"
      />
    </svg>
  );
}
