import { useCallback, useEffect, useState } from 'react';
import type { Experience } from '@/types';
import { getExperience, isValidExperienceId } from '@/utils/storage';

export type ViewerState =
  | { status: 'loading' }
  | { status: 'invalid' }
  | { status: 'missing' }
  | { status: 'error' }
  | { status: 'ready'; experience: Experience };

/** Loads the experience for /view/:id from IndexedDB and classifies every failure mode. */
export function useViewerExperience(id: string | undefined) {
  const [state, setState] = useState<ViewerState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    if (!id || !isValidExperienceId(id)) {
      setState({ status: 'invalid' });
      return;
    }
    setState({ status: 'loading' });
    getExperience(id)
      .then((experience) => {
        if (!alive) return;
        if (!experience) setState({ status: 'missing' });
        // A saved record without its core content can't be shown as a museum.
        else if (!experience.recipient.trim() || !experience.sender.trim() || !experience.openingMessage.trim()) setState({ status: 'invalid' });
        else setState({ status: 'ready', experience });
      })
      .catch(() => {
        if (alive) setState({ status: 'error' });
      });
    return () => {
      alive = false;
    };
  }, [id, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, retry };
}
