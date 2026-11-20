import { Pause, Play } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { formatClock } from '@/utils/format';

const BARS = Array.from({ length: 36 }, (_, i) => 26 + Math.round(Math.abs(Math.sin(i * 1.7) + Math.cos(i * 0.6)) * 28));

interface AudioPlayerProps {
  src: string;
  /** MediaRecorder files often lack duration metadata, so pass the known length. */
  durationHint?: number;
  title?: string;
  actions?: ReactNode;
}

export function AudioPlayer({ src, durationHint = 0, title = 'Voice message', actions }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [metaDuration, setMetaDuration] = useState(0);

  const total = Number.isFinite(metaDuration) && metaDuration > 0 ? metaDuration : durationHint;
  const progress = total > 0 ? Math.min(1, time / total) : 0;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) el.pause();
    else el.play().catch(() => setPlaying(false));
  };

  return (
    <div className="glass rounded-2xl p-4">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setTime(0);
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setMetaDuration(e.currentTarget.duration)}
      />
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause voice message' : 'Play voice message'}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-accent to-accent2 text-accent-ink shadow-lg shadow-accent/25 outline-none transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          {playing ? <Pause className="h-5 w-5" aria-hidden="true" /> : <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="mb-1 truncate text-sm font-medium text-ink">{title}</p>
          <div className="relative h-10">
            <div className="flex h-full items-center gap-[3px]" aria-hidden="true">
              {BARS.map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className={cn('w-full rounded-full transition-colors', i / BARS.length < progress ? 'bg-accent' : 'bg-ink/20')}
                />
              ))}
            </div>
            <input
              type="range"
              min={0}
              max={total || 1}
              step={0.1}
              value={time}
              disabled={total <= 0}
              aria-label="Seek"
              onChange={(e) => {
                const next = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = next;
                setTime(next);
              }}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
        </div>
        <span className="shrink-0 text-xs tabular-nums text-soft">
          {formatClock(time)} / {formatClock(total)}
        </span>
      </div>
      {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
