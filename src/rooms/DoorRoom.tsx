import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import type { RoomProps } from './types';

const REQUIRED_KNOCKS = 3;
type Phase = 'closed' | 'opening' | 'open';

/** Room 2: exactly three knocks open the door. */
export function DoorRoom({ sound, completed, onComplete }: RoomProps) {
  const [startedOpen] = useState(completed);
  const [phase, setPhase] = useState<Phase>(completed ? 'open' : 'closed');
  const [knocks, setKnocks] = useState(0);
  const [pulse, setPulse] = useState(0);
  const phaseRef = useRef<Phase>(phase);
  const knocksRef = useRef(0);
  const timers = useRef<number[]>([]);
  const shake = useAnimationControls();

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const knock = () => {
    // Refs make the count exact even when taps arrive faster than renders.
    if (phaseRef.current !== 'closed' || knocksRef.current >= REQUIRED_KNOCKS) return;
    knocksRef.current += 1;
    const count = knocksRef.current;
    setKnocks(count);
    setPulse((p) => p + 1);
    sound.knock();
    void shake.start({ x: [0, -6, 5, -3, 0], transition: { duration: 0.3 } });
    try {
      navigator.vibrate?.(30);
    } catch {
      // vibration is optional
    }

    if (count === REQUIRED_KNOCKS) {
      phaseRef.current = 'opening';
      setPhase('opening');
      later(500, () => sound.creak());
      later(1500, () => sound.chime());
      later(2700, () => {
        phaseRef.current = 'open';
        setPhase('open');
        onComplete();
      });
    }
  };

  const message =
    phase === 'open'
      ? 'The door is open.'
      : phase === 'opening'
        ? 'It’s opening…'
        : knocks === 0
          ? 'Knock three times to come in.'
          : knocks === 1
            ? 'One knock. Two more.'
            : 'Two knocks. One more.';

  const lit = phase !== 'closed';

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 py-8">
      <div className="max-w-md text-center">
        <h2 className="text-4xl sm:text-5xl">Someone’s waiting on the other side</h2>
        <p className="mt-3 text-soft">Tap the door, or press Enter when it’s focused, to knock.</p>
      </div>

      <div data-no-swipe className="glass relative aspect-[3/4] w-[min(70vw,19rem)] rounded-t-full p-3" style={{ perspective: '1400px' }}>
        {/* The light behind the door */}
        <div className="absolute inset-3 overflow-hidden rounded-t-full" aria-hidden="true">
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: lit ? 1 : 0.25 }}
            transition={{ duration: 1.2 }}
            style={{
              background:
                'radial-gradient(circle at 50% 70%, rgb(255 246 220) 0%, rgb(var(--accent-2) / 0.9) 45%, rgb(var(--accent) / 0.85) 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
        </div>

        <motion.div animate={shake} className="relative h-full w-full">
          <motion.button
            type="button"
            onClick={knock}
            aria-label={`Knock on the door. ${knocks} of ${REQUIRED_KNOCKS} knocks.`}
            aria-disabled={phase !== 'closed'}
            initial={false}
            animate={{ rotateY: phase === 'closed' ? 0 : -76 }}
            transition={{ duration: 1.5, ease: [0.6, 0, 0.2, 1] }}
            style={{
              transformOrigin: 'left center',
              background: 'linear-gradient(165deg, rgb(var(--accent)), rgb(var(--accent-2)))',
            }}
            className={cn(
              'absolute inset-0 rounded-t-full shadow-2xl outline-none focus-visible:ring-4 focus-visible:ring-accent/50',
              phase === 'closed' ? 'cursor-pointer' : 'cursor-default',
            )}
          >
            {/* Raised panels */}
            <span aria-hidden="true" className="absolute inset-x-[16%] top-[9%] h-[38%] rounded-t-full border border-black/15 bg-black/10 shadow-[inset_0_2px_8px_rgb(0_0_0/0.25)]" />
            <span aria-hidden="true" className="absolute inset-x-[16%] bottom-[8%] h-[36%] rounded-xl border border-black/15 bg-black/10 shadow-[inset_0_2px_8px_rgb(0_0_0/0.25)]" />
            {/* Knocker */}
            <span aria-hidden="true" className="absolute left-1/2 top-[44%] grid -translate-x-1/2 place-items-center">
              <span className="h-3 w-3 rounded-full bg-[rgb(var(--accent-ink))] shadow-md" />
              <span className="-mt-1 h-9 w-9 rounded-full border-[5px] border-[rgb(var(--accent-ink))] shadow-lg" />
            </span>
            {/* Handle */}
            <span aria-hidden="true" className="absolute right-[9%] top-[56%] h-4 w-4 rounded-full bg-[rgb(var(--accent-ink))] shadow-lg" />
          </motion.button>

          <AnimatePresence>
            {pulse > 0 && phase === 'closed' && (
              <motion.span
                key={pulse}
                aria-hidden="true"
                initial={{ scale: 0.3, opacity: 0.7 }}
                animate={{ scale: 2.4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="pointer-events-none absolute left-1/2 top-[48%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[rgb(var(--accent-ink))]"
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-3" aria-hidden="true">
          {Array.from({ length: REQUIRED_KNOCKS }, (_, i) => (
            <motion.span
              key={i}
              initial={false}
              animate={{ scale: i < knocks ? 1.25 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 14 }}
              className={cn('h-3.5 w-3.5 rounded-full border-2 transition-colors', i < knocks ? 'border-accent bg-accent' : 'border-line/40')}
            />
          ))}
        </div>
        <p aria-live="polite" className="min-h-6 font-serif text-xl italic text-ink">
          {message}
        </p>
        {startedOpen && (
          <Button size="lg" onClick={onComplete}>
            Step through
          </Button>
        )}
      </div>
    </div>
  );
}
