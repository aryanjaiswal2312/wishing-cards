export type ThemeId = 'rose' | 'midnight' | 'sunset' | 'mint';
export type SealColor = 'crimson' | 'gold' | 'navy' | 'emerald' | 'plum';
export type OccasionId = 'birthday' | 'anniversary' | 'valentine' | 'apology' | 'thank-you' | 'just-because';
export type RelationshipId = 'partner' | 'spouse' | 'best-friend' | 'family' | 'crush' | 'other';

export interface Photo {
  id: string;
  /** Compressed JPEG as a data URL (stored locally in IndexedDB). */
  src: string;
  caption: string;
  width: number;
  height: number;
}

export interface VoiceMessage {
  /** Recorded audio as a data URL. */
  src: string;
  durationSec: number;
  mimeType: string;
}

/** Everything the builder collects. */
export interface ExperienceDraft {
  sender: string;
  recipient: string;
  openingMessage: string;
  occasion: OccasionId | null;
  relationship: RelationshipId | null;
  theme: ThemeId;
  /** ISO date (YYYY-MM-DD) or empty string when not set. */
  startDate: string;
  photos: Photo[];
  puzzlePhotoId: string | null;
  reasons: string[];
  letter: string;
  sealColor: SealColor;
  voice: VoiceMessage | null;
  promises: string[];
}

/** A saved, shareable experience. */
export interface Experience extends ExperienceDraft {
  id: string;
  version: 1;
  createdAt: number;
  updatedAt: number;
}

export type DraftPatch = Partial<ExperienceDraft> | ((draft: ExperienceDraft) => Partial<ExperienceDraft>);
export type UpdateDraft = (patch: DraftPatch) => void;
