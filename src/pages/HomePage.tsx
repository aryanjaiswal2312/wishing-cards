import { motion } from 'framer-motion';
import { Copy, DoorOpen, Images, Landmark, ListChecks, Lock, Mail, PencilLine, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { useExperiences } from '@/hooks/useExperiences';
import type { Experience } from '@/types';
import { OCCASIONS } from '@/utils/constants';
import { isPristine } from '@/utils/experience';
import { loadDraft } from '@/utils/storage';

const FEATURES = [
  { icon: DoorOpen, title: 'A door that needs three knocks', text: 'They earn their way in.' },
  { icon: Images, title: 'Photos to scratch away', text: 'Each memory is revealed by hand.' },
  { icon: Mail, title: 'A letter under wax', text: 'Break the seal, hear your voice.' },
  { icon: ListChecks, title: 'Promises to tick off', text: 'Small vows, kept one by one.' },
] as const;

export default function HomePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { items, loading, remove } = useExperiences();
  const [hasDraft, setHasDraft] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Experience | null>(null);

  useEffect(() => {
    loadDraft()
      .then((d) => setHasDraft(!!d && !isPristine(d)))
      .catch(() => setHasDraft(false));
  }, []);

  const copyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/view/${id}`);
      toast('Link copied.', 'success');
    } catch {
      toast('Couldn’t copy the link automatically.', 'error');
    }
  };

  const confirmDelete = async () => {
    const target = pendingDelete;
    setPendingDelete(null);
    if (!target) return;
    try {
      await remove(target.id);
      toast('Experience deleted from this device.', 'success');
    } catch {
      toast('Couldn’t delete that experience.', 'error');
    }
  };

  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
      <header className="flex items-center gap-2 py-5 font-serif text-xl font-semibold">
        <Landmark className="h-5 w-5 text-accent" aria-hidden="true" />
        Museum of Us
      </header>

      <main>
        <section className="grid justify-items-center gap-6 py-12 text-center sm:py-20">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-5xl leading-[1.05] sm:text-7xl"
          >
            Turn your memories into a museum they can walk through
          </motion.h1>
          <p className="max-w-xl text-lg text-soft">
            Add photos, reasons, a letter and a voice message. They open the door and explore it one room at a time.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" leftIcon={<PencilLine className="h-5 w-5" aria-hidden="true" />} onClick={() => navigate('/create')}>
              {hasDraft ? 'Continue your draft' : 'Create a museum'}
            </Button>
          </div>
          <p className="flex items-center gap-2 text-sm text-soft">
            <Lock className="h-4 w-4" aria-hidden="true" />
            No account, no uploads. Everything stays on this device.
          </p>
        </section>

        <section aria-label="What they will find" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass rounded-3xl p-5">
              <Icon className="mb-3 h-6 w-6 text-accent" aria-hidden="true" />
              <h2 className="text-xl leading-snug">{title}</h2>
              <p className="mt-1 text-sm text-soft">{text}</p>
            </div>
          ))}
        </section>

        <section aria-labelledby="saved-heading" className="mt-16">
          <h2 id="saved-heading" className="text-3xl">
            Your museums
          </h2>
          {loading ? (
            <p className="mt-4 text-soft" role="status">
              Loading…
            </p>
          ) : items.length === 0 ? (
            <p className="glass mt-4 rounded-3xl px-6 py-10 text-center text-soft">Nothing here yet. Your finished museums will appear here.</p>
          ) : (
            <ul className="mt-4 grid gap-3">
              {items.map((e) => (
                <li key={e.id} className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
                  <div className="min-w-0">
                    <p className="truncate font-serif text-xl font-semibold">For {e.recipient}</p>
                    <p className="text-sm text-soft">
                      {OCCASIONS.find((o) => o.id === e.occasion)?.label ?? 'Gift'} ·{' '}
                      {new Date(e.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/view/${e.id}`)}>
                      Open
                    </Button>
                    <IconButton label={`Copy link for ${e.recipient}`} onClick={() => void copyLink(e.id)}>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                    <IconButton label={`Delete museum for ${e.recipient}`} variant="danger" onClick={() => setPendingDelete(e)}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this museum?"
        message={`The experience for ${pendingDelete?.recipient ?? 'them'} will be removed from this device. This can’t be undone.`}
        confirmLabel="Delete"
        destructive
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
