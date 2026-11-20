import { motion } from 'framer-motion';
import { Check, Copy, DoorOpen, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import type { Experience } from '@/types';

interface SuccessScreenProps {
  experience: Experience;
  onCreateAnother: () => void;
}

export function SuccessScreen({ experience, onCreateAnother }: SuccessScreenProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const link = `${window.location.origin}/view/${experience.id}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast('Link copied.', 'success');
    } catch {
      toast('Couldn’t copy automatically. Select the link and copy it.', 'error');
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full rounded-[2rem] p-8 text-center sm:p-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}
          className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-accent to-accent2 text-accent-ink shadow-lg shadow-accent/30"
        >
          <Check className="h-8 w-8" aria-hidden="true" />
        </motion.div>
        <h1 className="text-4xl">Your museum is ready</h1>
        <p className="mt-3 text-soft">
          {experience.recipient} is about to step into something made just for them.
        </p>

        <div className="mt-6 flex items-center gap-2">
          <input readOnly aria-label="Experience link" value={link} onFocus={(e) => e.currentTarget.select()} className="input-base text-sm" />
          <IconButton label="Copy link" variant="secondary" onClick={() => void copy()}>
            <Copy className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </div>
        <p className="mt-3 text-sm text-soft">
          Everything is stored on this device only. This link opens in this browser; export and import arrive in a later phase.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" leftIcon={<DoorOpen className="h-5 w-5" aria-hidden="true" />} onClick={() => navigate(`/view/${experience.id}`)}>
            Open experience
          </Button>
          <Button size="lg" variant="secondary" leftIcon={<Plus className="h-5 w-5" aria-hidden="true" />} onClick={onCreateAnother}>
            Create another
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
