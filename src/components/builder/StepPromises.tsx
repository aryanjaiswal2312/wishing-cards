import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button, IconButton } from '@/components/ui/Button';
import { FieldGroup, TextInput } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/utils/cn';
import { LIMITS, PROMISE_TEMPLATES } from '@/utils/constants';
import type { StepProps } from './stepTypes';

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function StepPromises({ draft, update, errors }: StepProps) {
  const toast = useToast();
  const [custom, setCustom] = useState('');
  const promises = draft.promises;
  const full = promises.length >= LIMITS.promises;
  const has = (text: string) => promises.some((p) => same(p, text));

  const toggleTemplate = (text: string) => {
    if (!has(text) && full) {
      toast(`You can add up to ${LIMITS.promises} promises. Remove one to swap.`, 'info');
      return;
    }
    update((d) => ({
      promises: d.promises.some((p) => same(p, text)) ? d.promises.filter((p) => !same(p, text)) : [...d.promises, text],
    }));
  };

  const addCustom = (e: FormEvent) => {
    e.preventDefault();
    const text = custom.trim();
    if (!text) return;
    if (has(text)) {
      toast('You already added that promise.', 'info');
      return;
    }
    if (full) {
      toast(`You can add up to ${LIMITS.promises} promises.`, 'info');
      return;
    }
    update((d) => ({ promises: [...d.promises, text] }));
    setCustom('');
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="grid content-start gap-8">
        <FieldGroup label="Pick from our ideas" hint={`${promises.length}/${LIMITS.promises} chosen`}>
          <div className="flex flex-wrap gap-2">
            {PROMISE_TEMPLATES.map((t) => {
              const selected = has(t);
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleTemplate(t)}
                  className={cn(
                    'flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-left text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-accent/60',
                    selected ? 'border-transparent bg-accent text-accent-ink' : 'glass text-ink hover:bg-surface/25',
                  )}
                >
                  {selected && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                  {t}
                </button>
              );
            })}
          </div>
        </FieldGroup>

        <form onSubmit={addCustom} className="grid gap-3">
          <TextInput
            label="Or write your own"
            placeholder="I promise to…"
            maxLength={LIMITS.promise}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
          <Button type="submit" variant="secondary" size="sm" className="justify-self-start" leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />} disabled={!custom.trim()}>
            Add promise
          </Button>
        </form>
      </div>

      <section aria-label="Your promises" className="glass self-start rounded-3xl p-5">
        <h3 className="text-2xl">Your promises</h3>
        <p className="mb-4 text-sm text-soft">They’ll tick each one off at the end.</p>
        {promises.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line/30 px-4 py-8 text-center text-sm text-soft">
            Nothing here yet. Pick a few on the left.
          </p>
        ) : (
          <ul className="grid gap-2">
            <AnimatePresence initial={false}>
              {promises.map((p) => (
                <motion.li
                  key={p}
                  layout
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="flex items-center gap-3 rounded-2xl bg-surface/30 px-3 py-2.5"
                >
                  <span className="h-5 w-5 shrink-0 rounded-md border-2 border-accent/60" aria-hidden="true" />
                  <span className="flex-1 break-words text-sm text-ink">{p}</span>
                  <IconButton label={`Remove promise: ${p}`} size="sm" variant="danger" onClick={() => update((d) => ({ promises: d.promises.filter((x) => x !== p) }))}>
                    <X className="h-4 w-4" aria-hidden="true" />
                  </IconButton>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
        {errors.promises && (
          <p role="alert" className="mt-3 text-sm text-red-500">
            {errors.promises}
          </p>
        )}
      </section>
    </div>
  );
}
