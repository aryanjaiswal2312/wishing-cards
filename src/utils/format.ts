export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function parseIsoDate(iso: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]), d: Number(match[3]) };
}

/** Whole days between the start date and today (null when no valid date). */
export function daysTogether(startDate: string, now: Date = new Date()): number | null {
  const start = parseIsoDate(startDate);
  if (!start) return null;
  const from = Date.UTC(start.y, start.m - 1, start.d);
  const to = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((to - from) / 86_400_000));
}

export function formatLongDate(iso: string): string {
  const parts = parseIsoDate(iso);
  if (!parts) return '';
  return new Date(parts.y, parts.m - 1, parts.d).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function todayIso(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}
