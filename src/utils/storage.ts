import { createStore, del, get, getMany, keys, set } from 'idb-keyval';
import { nanoid } from 'nanoid';
import type { Experience, ExperienceDraft } from '@/types';
import { normalizeDraft, normalizeExperience } from './experience';

// All IndexedDB access lives in this file.
const store = createStore('museum-of-us', 'keyval');
const DRAFT_KEY = 'draft:current';
const EXPERIENCE_PREFIX = 'experience:';
const experienceKey = (id: string) => `${EXPERIENCE_PREFIX}${id}`;

export const isValidExperienceId = (id: string): boolean => /^[A-Za-z0-9_-]{6,40}$/.test(id);

export async function loadDraft(): Promise<ExperienceDraft | null> {
  const raw = await get<unknown>(DRAFT_KEY, store);
  return raw === undefined ? null : normalizeDraft(raw);
}

export const saveDraft = (draft: ExperienceDraft): Promise<void> => set(DRAFT_KEY, draft, store);
export const clearDraft = (): Promise<void> => del(DRAFT_KEY, store);

export async function saveExperience(draft: ExperienceDraft): Promise<Experience> {
  const now = Date.now();
  const experience: Experience = { ...draft, id: nanoid(10), version: 1, createdAt: now, updatedAt: now };
  await set(experienceKey(experience.id), experience, store);
  return experience;
}

export async function getExperience(id: string): Promise<Experience | null> {
  if (!isValidExperienceId(id)) return null;
  const raw = await get<unknown>(experienceKey(id), store);
  return raw === undefined ? null : normalizeExperience(raw);
}

export async function listExperiences(): Promise<Experience[]> {
  const allKeys = await keys(store);
  const ids = allKeys.filter((k): k is string => typeof k === 'string' && k.startsWith(EXPERIENCE_PREFIX));
  const rows = await getMany<unknown>(ids, store);
  return rows
    .map(normalizeExperience)
    .filter((e): e is Experience => e !== null)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export const deleteExperience = (id: string): Promise<void> => del(experienceKey(id), store);
