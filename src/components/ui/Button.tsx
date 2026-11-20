import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'relative inline-flex select-none items-center justify-center gap-2 rounded-full font-medium outline-none transition-[background,box-shadow,opacity,border-color] duration-200 focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-br from-accent to-accent2 text-accent-ink shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35',
  secondary: 'glass text-ink hover:bg-surface/25',
  ghost: 'text-soft hover:bg-surface/20 hover:text-ink',
  danger: 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
};

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const inactive = disabled || loading;
  return (
    <motion.button
      type={type}
      disabled={inactive}
      whileTap={inactive ? undefined : { scale: 0.97 }}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </motion.button>
  );
}

interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  label: string;
  children: ReactNode;
  variant?: 'ghost' | 'secondary' | 'danger' | 'overlay';
  size?: 'sm' | 'md';
}

const iconVariants = {
  ghost: 'text-soft hover:bg-surface/25 hover:text-ink',
  secondary: 'glass text-ink hover:bg-surface/25',
  danger: 'text-red-500 hover:bg-red-500/10',
  overlay: 'bg-black/45 text-white backdrop-blur hover:bg-black/65',
} as const;

export function IconButton({ label, children, variant = 'ghost', size = 'md', className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <motion.button
      type={type}
      aria-label={label}
      whileTap={{ scale: 0.92 }}
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-accent/60 disabled:opacity-50',
        size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
        iconVariants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
