import { useMemo } from 'react';
import { cn } from '@/utils/cn';

interface ParticlesProps {
  count?: number;
  className?: string;
}

/** Soft floating specks. Motion is disabled by the reduced-motion rule in index.css. */
export function Particles({ count = 18, className = 'fixed inset-0' }: ParticlesProps) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, id) => ({
        id,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 3 + Math.random() * 7,
        delay: -Math.random() * 14,
        duration: 10 + Math.random() * 12,
        opacity: 0.2 + Math.random() * 0.4,
      })),
    [count],
  );
  return (
    <div aria-hidden="true" className={cn('pointer-events-none overflow-hidden', className)}>
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute animate-float rounded-full bg-accent"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
