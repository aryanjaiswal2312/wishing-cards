import { motion, type Variants } from 'framer-motion';
import { DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { RoomProps } from './types';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.28, delayChildren: 0.2 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

/** Room 1: personalised welcome. Every word on screen comes from the saved experience. */
export function IntroRoom({ experience, sound, onComplete }: RoomProps) {
  const { sender, recipient, openingMessage } = experience;

  const start = () => {
    sound.chime();
    onComplete();
  };

  return (
    <div className="relative grid flex-1 place-items-center px-5 py-10">
      {/* Atmosphere: a tall arch of light behind the text */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-full max-h-[46rem] w-full max-w-lg">
        <div className="absolute inset-x-6 top-4 bottom-0 rounded-t-full border border-line/30 bg-gradient-to-b from-accent/15 via-accent2/5 to-transparent" />
        <div className="absolute inset-x-14 top-12 bottom-0 rounded-t-full border border-line/20" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex max-w-xl flex-col items-center gap-6 text-center"
      >
        <motion.p variants={rise} className="text-sm text-soft">
          Curated by {sender}
        </motion.p>
        <motion.h1 variants={rise} className="text-5xl leading-[1.05] sm:text-7xl">
          A museum made for {recipient}
        </motion.h1>
        <motion.blockquote
          variants={rise}
          className="max-w-md whitespace-pre-line break-words border-t border-line/30 pt-6 font-serif text-xl italic leading-relaxed text-ink/90 sm:text-2xl"
        >
          {openingMessage}
        </motion.blockquote>
        <motion.div variants={rise} className="pt-2">
          <Button size="lg" leftIcon={<DoorOpen className="h-5 w-5" aria-hidden="true" />} onClick={start}>
            Start exploring
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
