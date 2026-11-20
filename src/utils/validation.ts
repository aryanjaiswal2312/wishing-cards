import type { ExperienceDraft } from '@/types';

export type StepErrors = Partial<Record<'sender' | 'recipient' | 'openingMessage' | 'occasion' | 'relationship' | 'startDate' | 'photos' | 'reasons' | 'letter' | 'promises', string>>;

export function validateStep(step: number, d: ExperienceDraft): StepErrors {
  const e: StepErrors = {};
  switch (step) {
    case 0:
      if (!d.sender.trim()) e.sender = 'Add your name so they know who this is from.';
      if (!d.recipient.trim()) e.recipient = 'Add the name of the person this is for.';
      if (!d.openingMessage.trim()) e.openingMessage = 'Write a short opening message.';
      break;
    case 1:
      if (!d.occasion) e.occasion = 'Choose an occasion.';
      if (!d.relationship) e.relationship = 'Choose your relationship.';
      if (d.startDate) {
        const t = Date.parse(d.startDate);
        if (Number.isNaN(t)) e.startDate = 'Enter a valid date.';
        else if (t > Date.now()) e.startDate = 'The start date can’t be in the future.';
      }
      break;
    case 2:
      if (d.photos.length === 0) e.photos = 'Add at least one photograph.';
      else if (!d.puzzlePhotoId || !d.photos.some((p) => p.id === d.puzzlePhotoId)) e.photos = 'Pick one photograph for the puzzle.';
      break;
    case 3:
      if (!d.reasons.some((r) => r.trim())) e.reasons = 'Add at least one reason.';
      if (!d.letter.trim()) e.letter = 'Write your letter before continuing.';
      break;
    case 5:
      if (d.promises.length === 0) e.promises = 'Choose or write at least one promise.';
      break;
    default:
      break;
  }
  return e;
}

export const firstError = (errors: StepErrors): string | undefined => Object.values(errors)[0];
