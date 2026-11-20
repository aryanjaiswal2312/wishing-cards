import { Cake, Flower2, Gift, Heart, Sparkles, Star, type LucideIcon } from 'lucide-react';
import { FieldGroup, TextInput } from '@/components/ui/Field';
import { SelectionCard } from '@/components/ui/SelectionCard';
import { ThemePreview } from '@/components/ThemePreview';
import { THEME_LIST } from '@/themes/themes';
import type { OccasionId } from '@/types';
import { cn } from '@/utils/cn';
import { OCCASIONS, RELATIONSHIPS } from '@/utils/constants';
import { todayIso } from '@/utils/format';
import type { StepProps } from './stepTypes';

const OCCASION_ICONS: Record<OccasionId, LucideIcon> = {
  birthday: Cake,
  anniversary: Star,
  valentine: Heart,
  apology: Flower2,
  'thank-you': Gift,
  'just-because': Sparkles,
};

export function StepAppearance({ draft, update, errors }: StepProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="grid content-start gap-8">
        <FieldGroup label="Occasion" error={errors.occasion}>
          <div role="radiogroup" aria-label="Occasion" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {OCCASIONS.map((o) => {
              const Icon = OCCASION_ICONS[o.id];
              return (
                <SelectionCard
                  key={o.id}
                  title={o.label}
                  description={o.blurb}
                  icon={<Icon className="h-5 w-5" aria-hidden="true" />}
                  selected={draft.occasion === o.id}
                  onSelect={() => update({ occasion: o.id })}
                />
              );
            })}
          </div>
        </FieldGroup>

        <FieldGroup label="They are my" error={errors.relationship}>
          <div role="radiogroup" aria-label="Relationship" className="flex flex-wrap gap-2">
            {RELATIONSHIPS.map((r) => {
              const selected = draft.relationship === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => update({ relationship: r.id })}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-accent/60',
                    selected ? 'border-transparent bg-accent text-accent-ink' : 'glass text-ink hover:bg-surface/25',
                  )}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </FieldGroup>

        <FieldGroup label="Theme" hint="The preview updates as you choose.">
          <div role="radiogroup" aria-label="Theme" className="grid grid-cols-2 gap-3">
            {THEME_LIST.map((t) => (
              <SelectionCard
                key={t.id}
                title={t.label}
                description={t.tagline}
                selected={draft.theme === t.id}
                onSelect={() => update({ theme: t.id })}
              >
                <span className="mt-1 flex gap-1.5">
                  {t.swatch.map((c) => (
                    <span key={c} className="h-4 w-4 rounded-full border border-black/10" style={{ background: c }} />
                  ))}
                </span>
              </SelectionCard>
            ))}
          </div>
        </FieldGroup>

        <TextInput
          label="Together since (optional)"
          hint="Used for the days-together counter at the end."
          type="date"
          max={todayIso()}
          value={draft.startDate}
          error={errors.startDate}
          onChange={(e) => update({ startDate: e.target.value })}
        />
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start" aria-label="Live theme preview">
        <p className="mb-3 text-sm font-medium text-ink">Live preview</p>
        <ThemePreview theme={draft.theme} recipient={draft.recipient} message={draft.openingMessage} />
      </aside>
    </div>
  );
}
