import { useCallback, useEffect, useState } from 'react';
import type { Experience } from '@/types';
import { deleteExperience, listExperiences } from '@/utils/storage';

export function useExperiences() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    listExperiences()
      .then((rows) => {
        if (alive) setItems(rows);
      })
      .catch(() => {
        if (alive) setError(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteExperience(id);
    setItems((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { items, loading, error, remove };
}
