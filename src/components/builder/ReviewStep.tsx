import { Pencil, Puzzle } from 'lucide-react';
import type { ReactNode } from 'react';
import { LetterPreview } from '@/components/LetterPreview';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { THEMES } from '@/themes/themes';
import type { ExperienceDraft } from '@/types';
import { OCCASIONS, RELATIONSHIPS } from '@/utils/constants';
import { sanitizeDraft } from '@/utils/experience';
import { daysTogether, formatLongDate } from '@/utils/format';

interface SectionProps {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: ReactNode;
}

function Section({ title, step, onEdit, children }: SectionProps) {
  return (
    <section className="glass rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl">{title}</h2>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-soft outline-none transition hover:bg-surface/25 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
          <span className="sr-only"> {title}</span>
        </button>
      </div>
      {children}
    </section>
  );
}

interface ReviewStepProps {
  draft: ExperienceDraft;
  onEdit: (step: number) => void;
}

export function ReviewStep({ draft, onEdit }: ReviewStepProps) {
  const d = sanitizeDraft(draft);
  const occasion = OCCASIONS.find((o) => o.id === d.occasion)?.label;
  const relationship = RELATIONSHIPS.find((r) => r.id === d.relationship)?.label;
  const days = daysTogether(d.startDate);
  const reasons = d.reasons.filter(Boolean);

  return (
    <div className="grid gap-5">
      <Section title="Welcome" step={0} onEdit={onEdit}>
        <p className="text-sm text-soft">
          From <span className="font-medium text-ink">{d.sender}</span> to <span className="font-medium text-ink">{d.recipient}</span>
        </p>
        <blockquote className="mt-3 border-l-2 border-accent pl-4 font-serif text-xl italic leading-snug">{d.openingMessage}</blockquote>
      </Section>

      <Section title="Style" step={1} onEdit={onEdit}>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-soft">Occasion</dt>
            <dd className="font-medium text-ink">{occasion}</dd>
          </div>
          <div>
            <dt className="text-soft">Relationship</dt>
            <dd className="font-medium text-ink">{relationship}</dd>
          </div>
          <div>
            <dt className="text-soft">Theme</dt>
            <dd className="flex items-center gap-2 font-medium text-ink">
              <span className="flex">
                {THEMES[d.theme].swatch.map((c) => (
                  <span key={c} className="-ml-1 h-4 w-4 rounded-full border border-black/10 first:ml-0" style={{ background: c }} />
                ))}
              </span>
              {THEMES[d.theme].label}
            </dd>
          </div>
          <div>
            <dt className="text-soft">Together since</dt>
            <dd className="font-medium text-ink">
              {d.startDate ? `${formatLongDate(d.startDate)} · ${days?.toLocaleString()} days` : 'Not set'}
            </dd>
          </div>
        </dl>
      </Section>

      <Section title="Gallery" step={2} onEdit={onEdit}>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {d.photos.map((p, i) => (
            <li key={p.id}>
              <figure className="grid gap-1.5">
                <div className="relative aspect-square overflow-hidden rounded-xl">
                  <img src={p.src} alt={p.caption || `Photograph ${i + 1}`} className="h-full w-full object-cover" />
                  {p.id === d.puzzlePhotoId && (
                    <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-ink">
                      <Puzzle className="h-3 w-3" aria-hidden="true" />
                      Puzzle
                    </span>
                  )}
                </div>
                <figcaption className="truncate text-xs text-soft">{p.caption || 'No caption'}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Reasons and letter" step={3} onEdit={onEdit}>
        <ol className="mb-8 grid gap-2">
          {reasons.map((r, i) => (
            <li key={i} className="flex gap-3 rounded-2xl bg-surface/30 px-4 py-2.5 text-sm text-ink">
              <span className="font-serif text-accent">{i + 1}</span>
              {r}
            </li>
          ))}
        </ol>
        <LetterPreview recipient={d.recipient} sender={d.sender} letter={d.letter} sealColor={d.sealColor} />
      </Section>

      <Section title="Voice message" step={4} onEdit={onEdit}>
        {d.voice ? (
          <AudioPlayer src={d.voice.src} durationHint={d.voice.durationSec} />
        ) : (
          <p className="text-sm text-soft">No voice message. The letter will open in silence.</p>
        )}
      </Section>

      <Section title="Promises" step={5} onEdit={onEdit}>
        <ul className="grid gap-2">
          {d.promises.map((p) => (
            <li key={p} className="flex items-center gap-3 rounded-2xl bg-surface/30 px-4 py-2.5 text-sm text-ink">
              <span className="h-5 w-5 shrink-0 rounded-md border-2 border-accent/60" aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
