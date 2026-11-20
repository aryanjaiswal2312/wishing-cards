import { TextArea, TextInput } from '@/components/ui/Field';
import { LIMITS } from '@/utils/constants';
import type { StepProps } from './stepTypes';

export function StepDetails({ draft, update, errors }: StepProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextInput
          label="Your name"
          placeholder="e.g. Aarav"
          autoComplete="given-name"
          maxLength={LIMITS.name}
          value={draft.sender}
          error={errors.sender}
          onChange={(e) => update({ sender: e.target.value })}
        />
        <TextInput
          label="Their name"
          placeholder="e.g. Meera"
          maxLength={LIMITS.name}
          value={draft.recipient}
          error={errors.recipient}
          onChange={(e) => update({ recipient: e.target.value })}
        />
      </div>
      <TextArea
        label="Opening message"
        hint="The first thing they read when they walk in."
        placeholder="I made something for you. Take your time, every room has a little piece of us in it."
        rows={5}
        maxLength={LIMITS.opening}
        value={draft.openingMessage}
        error={errors.openingMessage}
        onChange={(e) => update({ openingMessage: e.target.value })}
      />
    </div>
  );
}
