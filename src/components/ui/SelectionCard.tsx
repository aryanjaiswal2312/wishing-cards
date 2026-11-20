import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface SelectionCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function SelectionCard({ selected, onSelect, title, description, icon, children, className }: SelectionCardProps) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'glass relative flex w-full flex-col items-start gap-1.5 rounded-2xl p-4 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-accent/60',
        selected && 'bg-accent/10 ring-2 ring-accent',
        className,
      )}
    >
      {icon && <span className="mb-1 text-accent">{icon}</span>}
      <span className="font-medium text-ink">{title}</span>
      {description && <span className="text-sm text-soft">{description}</span>}
      {children}
      {selected && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-accent text-accent-ink"
        >
          <Check className="h-3 w-3" aria-hidden="true" />
        </motion.span>
      )}
    </motion.button>
  );
}
