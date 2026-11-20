import { useCallback, useState } from 'react';

const KEY = 'museum-of-us:muted';

function read(): boolean {
  try {
    return window.localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

/** Mute preference, remembered per browser. */
export function useMuted(): [boolean, () => void] {
  const [muted, setMuted] = useState(read);
  const toggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(KEY, next ? '1' : '0');
      } catch {
        // preference just won't persist
      }
      return next;
    });
  }, []);
  return [muted, toggle];
}
