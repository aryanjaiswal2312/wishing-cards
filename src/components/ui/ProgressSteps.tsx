import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ProgressStepsProps {
  steps: ReadonlyArray<{ label: string }>;
  /** 0-based current step; equal to steps.length on the review screen. */
  current: number;
  onNavigate: (index: number) => void;
}

export function ProgressSteps({ steps, current, onNavigate }: ProgressStepsProps) {
  const total = steps.length;
  const reviewing = current >= total;
  const percent = ((reviewing ? total : current + 0.5) / total) * 100;
  const caption = reviewing ? 'Final review' : `Step ${current + 1} of ${total} · ${steps[current]?.label}`;

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between text-sm text-soft">
        <span>{caption}</span>
        <span className="tabular-nums">{Math.round(percent)}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.min(current, total)}
        aria-valuetext={caption}
        className="h-1.5 overflow-hidden rounded-full bg-ink/10"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent2"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <ol className="hidden justify-between md:flex">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={step.label}>
              <button
                type="button"
                disabled={!done}
                onClick={() => onNavigate(i)}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-full py-1 pr-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-accent/60',
                  active ? 'text-ink' : done ? 'text-soft hover:text-ink' : 'text-soft/50',
                )}
              >
                <span
                  className={cn(
                    'grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold',
                    done && 'border-transparent bg-accent text-accent-ink',
                    active && 'border-accent text-accent',
                    !done && !active && 'border-line/30',
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                </span>
                {step.label}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
