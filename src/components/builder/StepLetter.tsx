import { Plus, X } from 'lucide-react';
import { LetterPreview } from '@/components/LetterPreview';
import { Button, IconButton } from '@/components/ui/Button';
import { FieldGroup, TextArea, TextInput } from '@/components/ui/Field';
import { cn } from '@/utils/cn';
import { LIMITS, REASON_PLACEHOLDERS, SEAL_COLORS, SEAL_COLOR_IDS } from '@/utils/constants';
import type { StepProps } from './stepTypes';

export function StepLetter({ draft, update, errors }: StepProps) {
  const setReason = (index: number, value: string) =>
    update((d) => ({ reasons: d.reasons.map((r, i) => (i === index ? value : r)) }));

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="grid content-start gap-8">
        <FieldGroup label="Reasons I love you" hint={`up to ${LIMITS.reasons}`} error={errors.reasons}>
          <ul className="grid gap-3">
            {draft.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-2.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/15 font-serif text-sm text-accent">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <TextInput
                    hideLabel
                    label={`Reason ${i + 1}`}
                    placeholder={REASON_PLACEHOLDERS[i] ?? 'Something only you would notice'}
                    maxLength={LIMITS.reason}
                    value={reason}
                    onChange={(e) => setReason(i, e.target.value)}
                  />
                </div>
                {draft.reasons.length > 1 && (
                  <IconButton
                    label={`Remove reason ${i + 1}`}
                    variant="danger"
                    className="mt-1"
                    onClick={() => update((d) => ({ reasons: d.reasons.filter((_, idx) => idx !== i) }))}
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </IconButton>
                )}
              </li>
            ))}
          </ul>
          {draft.reasons.length < LIMITS.reasons && (
            <Button
              variant="secondary"
              size="sm"
              className="justify-self-start"
              leftIcon={<Plus className="h-4 w-4" aria-hidden="true" />}
              onClick={() => update((d) => ({ reasons: [...d.reasons, ''] }))}
            >
              Add a reason
            </Button>
          )}
        </FieldGroup>

        <TextArea
          label="Your letter"
          placeholder="Write the things that are hard to say out loud…"
          rows={8}
          maxLength={LIMITS.letter}
          value={draft.letter}
          error={errors.letter}
          onChange={(e) => update({ letter: e.target.value })}
        />

        <FieldGroup label="Wax seal colour">
          <div role="radiogroup" aria-label="Wax seal colour" className="flex flex-wrap gap-3">
            {SEAL_COLOR_IDS.map((id) => {
              const c = SEAL_COLORS[id];
              const selected = draft.sealColor === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={c.label}
                  title={c.label}
                  onClick={() => update({ sealColor: id })}
                  className={cn(
                    'h-10 w-10 rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-accent/60',
                    selected ? 'scale-110 ring-2 ring-accent ring-offset-2 ring-offset-transparent' : 'hover:scale-105',
                  )}
                  style={{ background: `radial-gradient(circle at 35% 30%, ${c.light}, ${c.base} 55%, ${c.dark})` }}
                />
              );
            })}
          </div>
        </FieldGroup>
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start" aria-label="Letter preview">
        <p className="mb-3 text-sm font-medium text-ink">Letter preview</p>
        <LetterPreview recipient={draft.recipient} sender={draft.sender} letter={draft.letter} sealColor={draft.sealColor} />
      </aside>
    </div>
  );
}
