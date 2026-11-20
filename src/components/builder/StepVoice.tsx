import { Mic, RotateCcw, Square, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { useToast } from '@/components/ui/Toast';
import { useRecorder } from '@/hooks/useRecorder';
import { LIMITS } from '@/utils/constants';
import { formatClock } from '@/utils/format';
import type { StepProps } from './stepTypes';

export function StepVoice({ draft, update }: StepProps) {
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { state, elapsed, error, supported, start, stop, cancel } = useRecorder(LIMITS.voiceSeconds, (voice) => {
    update({ voice });
    toast('Voice message saved.', 'success');
  });

  if (!supported) {
    return (
      <div className="glass rounded-2xl p-6 text-soft">
        This browser can’t record audio, so voice messages are unavailable. You can skip this step.
      </div>
    );
  }

  if (state !== 'idle') {
    const requesting = state === 'requesting';
    return (
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        <div className="relative grid h-28 w-28 place-items-center">
          {!requesting && (
            <>
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-500/30" />
              <span className="absolute inset-3 animate-pulse-ring rounded-full bg-red-500/20 [animation-delay:400ms]" />
            </>
          )}
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-red-500 text-white shadow-lg">
            <Mic className="h-8 w-8" aria-hidden="true" />
          </span>
        </div>
        <p className="font-serif text-4xl tabular-nums">
          {formatClock(elapsed)} <span className="text-lg text-soft">/ {formatClock(LIMITS.voiceSeconds)}</span>
        </p>
        <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-ink/10">
          <div className="h-full rounded-full bg-red-500 transition-[width] duration-200" style={{ width: `${(elapsed / LIMITS.voiceSeconds) * 100}%` }} />
        </div>
        <p className="text-sm text-soft" aria-live="polite">
          {requesting ? 'Waiting for microphone permission…' : `Recording. It stops on its own at ${LIMITS.voiceSeconds} seconds.`}
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={cancel}>
            Cancel
          </Button>
          <Button disabled={requesting} leftIcon={<Square className="h-4 w-4" aria-hidden="true" />} onClick={stop}>
            Stop and save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {error && (
        <p role="alert" className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </p>
      )}
      {draft.voice ? (
        <>
          <AudioPlayer
            key={draft.voice.src.length}
            src={draft.voice.src}
            durationHint={draft.voice.durationSec}
            actions={
              <>
                <Button size="sm" variant="secondary" leftIcon={<RotateCcw className="h-4 w-4" aria-hidden="true" />} onClick={() => void start()}>
                  Re-record
                </Button>
                <Button size="sm" variant="ghost" leftIcon={<Trash2 className="h-4 w-4" aria-hidden="true" />} onClick={() => setConfirmDelete(true)}>
                  Delete
                </Button>
              </>
            }
          />
          <ConfirmDialog
            open={confirmDelete}
            title="Delete this recording?"
            message="The voice message will be removed from your gift. You can record a new one any time."
            confirmLabel="Delete recording"
            destructive
            onCancel={() => setConfirmDelete(false)}
            onConfirm={() => {
              update({ voice: null });
              setConfirmDelete(false);
            }}
          />
        </>
      ) : (
        <div className="glass flex flex-col items-center gap-4 rounded-3xl px-6 py-10 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-accent/15 text-accent">
            <Mic className="h-7 w-7" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium text-ink">Record up to {LIMITS.voiceSeconds} seconds</p>
            <p className="mt-1 max-w-sm text-sm text-soft">It plays when they open the sealed letter. Your browser will ask for microphone access.</p>
          </div>
          <Button size="lg" leftIcon={<Mic className="h-5 w-5" aria-hidden="true" />} onClick={() => void start()}>
            Start recording
          </Button>
          <p className="text-sm text-soft">Not now? Just continue, this step is optional.</p>
        </div>
      )}
    </div>
  );
}
