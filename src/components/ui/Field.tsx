import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface ShellProps {
  id: string;
  label: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  counter?: ReactNode;
  children: ReactNode;
}

function Shell({ id, label, hideLabel, hint, error, counter, children }: ShellProps) {
  return (
    <div className="grid gap-1.5">
      <div className={cn('flex items-baseline justify-between gap-3', hideLabel && 'sr-only')}>
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {counter}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-500">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-sm text-soft">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
}

export function TextInput({ label, hideLabel, hint, error, className, id, ...rest }: TextInputProps) {
  const uid = useId();
  const fieldId = id ?? uid;
  return (
    <Shell id={fieldId} label={label} hideLabel={hideLabel} hint={hint} error={error}>
      <input
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={describedBy(fieldId, error, hint)}
        className={cn('input-base', error && 'input-error', className)}
        {...rest}
      />
    </Shell>
  );
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  value: string;
  maxLength: number;
  hint?: string;
  error?: string;
}

export function TextArea({ label, hint, error, className, id, value, maxLength, ...rest }: TextAreaProps) {
  const uid = useId();
  const fieldId = id ?? uid;
  const nearLimit = value.length >= maxLength * 0.9;
  return (
    <Shell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      counter={
        <span aria-live="polite" className={cn('text-xs tabular-nums', nearLimit ? 'font-semibold text-accent' : 'text-soft')}>
          {value.length}/{maxLength}
        </span>
      }
    >
      <textarea
        id={fieldId}
        value={value}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={describedBy(fieldId, error, hint)}
        className={cn('input-base resize-none leading-relaxed', error && 'input-error', className)}
        {...rest}
      />
    </Shell>
  );
}

interface FieldGroupProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function FieldGroup({ label, hint, error, children }: FieldGroupProps) {
  return (
    <fieldset className="grid gap-3 border-0 p-0">
      <legend className="mb-1 p-0 text-sm font-medium text-ink">
        {label}
        {hint && <span className="ml-2 font-normal text-soft">{hint}</span>}
      </legend>
      {children}
      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </fieldset>
  );
}
