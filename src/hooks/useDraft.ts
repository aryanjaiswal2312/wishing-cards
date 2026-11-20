import { useCallback, useEffect, useRef, useState } from 'react';
import type { ExperienceDraft, UpdateDraft } from '@/types';
import { emptyDraft, isPristine } from '@/utils/experience';
import { clearDraft, loadDraft, saveDraft } from '@/utils/storage';

const SAVE_DELAY_MS = 500;
const persist = (d: ExperienceDraft) => (isPristine(d) ? clearDraft() : saveDraft(d));

/** Builder state that restores itself from IndexedDB and auto-saves as you type. */
export function useDraft() {
  const [draft, setDraft] = useState<ExperienceDraft>(emptyDraft);
  const [ready, setReady] = useState(false);
  const [restored, setRestored] = useState(false);
  const [persistError, setPersistError] = useState(false);
  const draftRef = useRef(draft);
  const readyRef = useRef(false);
  draftRef.current = draft;
  readyRef.current = ready;

  useEffect(() => {
    let alive = true;
    loadDraft()
      .then((saved) => {
        if (alive && saved && !isPristine(saved)) {
          setDraft(saved);
          setRestored(true);
        }
      })
      .catch(() => {
        if (alive) setPersistError(true);
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => {
      persist(draft).catch(() => setPersistError(true));
    }, SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [draft, ready]);

  // Flush pending edits if the user leaves quickly.
  useEffect(
    () => () => {
      if (readyRef.current) void persist(draftRef.current).catch(() => undefined);
    },
    [],
  );

  const update = useCallback<UpdateDraft>((patch) => {
    setDraft((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  const reset = useCallback(async () => {
    setDraft(emptyDraft());
    try {
      await clearDraft();
    } catch {
      // nothing to clear if storage is unavailable
    }
  }, []);

  return { draft, update, reset, ready, restored, persistError };
}
