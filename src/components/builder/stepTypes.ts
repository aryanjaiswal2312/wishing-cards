import type { ExperienceDraft, UpdateDraft } from '@/types';
import type { StepErrors } from '@/utils/validation';

export interface StepProps {
  draft: ExperienceDraft;
  update: UpdateDraft;
  errors: StepErrors;
}
