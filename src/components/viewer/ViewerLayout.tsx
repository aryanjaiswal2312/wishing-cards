import { useEffect, useRef, type ReactNode, type TouchEvent } from 'react';

interface ViewerLayoutProps {
  topBar: ReactNode;
  /** Pass null to hide the bottom bar (e.g. before the visitor has started). */
  bottomBar: ReactNode | null;
  onNext: () => void;
  onPrev: () => void;
  children: ReactNode;
}

const SWIPE_DISTANCE = 60;

/** Full-screen shell: top bar, current room, bottom bar. Handles swipe and arrow-key navigation. */
export function ViewerLayout({ topBar, bottomBar, onNext, onPrev, children }: ViewerLayoutProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNext, onPrev]);

  const handleTouchStart = (e: TouchEvent) => {
    // Interactive objects (like the door) opt out of swipe with data-no-swipe.
    if ((e.target as HTMLElement).closest('[data-no-swipe]')) {
      touchStart.current = null;
      return;
    }
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    if (dx < 0) onNext();
    else onPrev();
  };

  return (
    <div
      className="relative z-10 flex h-dvh flex-col overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <header className="mx-auto flex w-full max-w-4xl items-center gap-4 px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">{topBar}</header>
      <main className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col overflow-y-auto overflow-x-hidden">{children}</main>
      {bottomBar && <footer className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">{bottomBar}</footer>}
    </div>
  );
}
