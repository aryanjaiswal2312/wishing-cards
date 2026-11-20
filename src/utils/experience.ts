import { isThemeId } from '@/themes/themes';
import type { Experience, ExperienceDraft, Photo, SealColor, VoiceMessage } from '@/types';
import { LIMITS, OCCASIONS, RELATIONSHIPS, SEAL_COLOR_IDS } from './constants';

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isSealColor = (v: unknown): v is SealColor => SEAL_COLOR_IDS.some((id) => id === v);
const text = (v: unknown, max: number): string => (typeof v === 'string' ? v.slice(0, max) : '');
const textList = (v: unknown, max: number, count: number): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').map((x) => x.slice(0, max)).slice(0, count) : [];

export function emptyDraft(): ExperienceDraft {
  return {
    sender: '',
    recipient: '',
    openingMessage: '',
    occasion: null,
    relationship: null,
    theme: 'rose',
    startDate: '',
    photos: [],
    puzzlePhotoId: null,
    reasons: [''],
    letter: '',
    sealColor: 'crimson',
    voice: null,
    promises: [],
  };
}

function toPhoto(v: unknown): Photo | null {
  if (!isRecord(v)) return null;
  const { id, src, caption, width, height } = v;
  if (typeof id !== 'string' || typeof src !== 'string' || !src.startsWith('data:image/')) return null;
  return {
    id,
    src,
    caption: text(caption, LIMITS.caption),
    width: typeof width === 'number' ? width : 0,
    height: typeof height === 'number' ? height : 0,
  };
}

function toVoice(v: unknown): VoiceMessage | null {
  if (!isRecord(v)) return null;
  const { src, durationSec, mimeType } = v;
  if (typeof src !== 'string' || !src.startsWith('data:audio/')) return null;
  return {
    src,
    durationSec: typeof durationSec === 'number' ? Math.min(durationSec, LIMITS.voiceSeconds) : 0,
    mimeType: typeof mimeType === 'string' ? mimeType : 'audio/webm',
  };
}

/** Turns unknown data (from storage or, later, an import) into a safe draft. */
export function normalizeDraft(raw: unknown): ExperienceDraft {
  const base = emptyDraft();
  if (!isRecord(raw)) return base;
  const photos = Array.isArray(raw.photos)
    ? raw.photos.map(toPhoto).filter((p): p is Photo => p !== null).slice(0, LIMITS.photos)
    : [];
  const pid = raw.puzzlePhotoId;
  const puzzlePhotoId = typeof pid === 'string' && photos.some((p) => p.id === pid) ? pid : (photos[0]?.id ?? null);
  const reasons = textList(raw.reasons, LIMITS.reason, LIMITS.reasons);
  return {
    sender: text(raw.sender, LIMITS.name),
    recipient: text(raw.recipient, LIMITS.name),
    openingMessage: text(raw.openingMessage, LIMITS.opening),
    occasion: OCCASIONS.find((o) => o.id === raw.occasion)?.id ?? null,
    relationship: RELATIONSHIPS.find((r) => r.id === raw.relationship)?.id ?? null,
    theme: isThemeId(raw.theme) ? raw.theme : base.theme,
    startDate: typeof raw.startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.startDate) ? raw.startDate : '',
    photos,
    puzzlePhotoId,
    reasons: reasons.length ? reasons : [''],
    letter: text(raw.letter, LIMITS.letter),
    sealColor: isSealColor(raw.sealColor) ? raw.sealColor : base.sealColor,
    voice: toVoice(raw.voice),
    promises: textList(raw.promises, LIMITS.promise, LIMITS.promises).filter((p) => p.trim()),
  };
}

export function normalizeExperience(raw: unknown): Experience | null {
  if (!isRecord(raw) || typeof raw.id !== 'string') return null;
  const now = Date.now();
  return {
    ...normalizeDraft(raw),
    id: raw.id,
    version: 1,
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : now,
    updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : now,
  };
}

/** True when the draft has no user-entered content worth saving. */
export function isPristine(d: ExperienceDraft): boolean {
  return (
    !d.sender.trim() &&
    !d.recipient.trim() &&
    !d.openingMessage.trim() &&
    !d.occasion &&
    !d.relationship &&
    !d.startDate &&
    d.photos.length === 0 &&
    d.reasons.every((r) => !r.trim()) &&
    !d.letter.trim() &&
    !d.voice &&
    d.promises.length === 0
  );
}

/** Trims text and drops blank list rows. */
export function sanitizeDraft(d: ExperienceDraft): ExperienceDraft {
  const reasons = d.reasons.map((r) => r.trim()).filter(Boolean).slice(0, LIMITS.reasons);
  return {
    ...d,
    sender: d.sender.trim(),
    recipient: d.recipient.trim(),
    openingMessage: d.openingMessage.trim(),
    letter: d.letter.trim(),
    reasons: reasons.length ? reasons : [''],
    promises: d.promises.map((p) => p.trim()).filter(Boolean).slice(0, LIMITS.promises),
    photos: d.photos.map((p) => ({ ...p, caption: p.caption.trim() })),
  };
}
