import { AnimatePresence, motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

// Moving forward feels like walking in (new room grows from slightly large); going back is the reverse.
const variants: Variants = {
  enter: (dir: number) => ({ opacity: 0, scale: dir > 0 ? 1.08 : 0.94, filter: 'blur(10px)' }),
  center: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: (dir: number) => ({ opacity: 0, scale: dir > 0 ? 0.95 : 1.06, filter: 'blur(8px)' }),
};

interface RoomTransitionProps {
  roomKey: string;
  direction: 1 | -1;
  children: ReactNode;
}

export function RoomTransition({ roomKey, direction, children }: RoomTransitionProps) {
  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div
        key={roomKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-0 flex-1 flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
