import { useCallback, useEffect, useRef, useState } from 'react';
import type { VoiceMessage } from '@/types';
import { blobToDataUrl } from '@/utils/blob';

export type RecorderState = 'idle' | 'requesting' | 'recording';

const MIME_CANDIDATES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];

function describeMicError(err: unknown): string {
  if (err instanceof DOMException) {
    if (err.name === 'NotAllowedError') return 'Microphone access is blocked. Allow it in your browser settings, then try again.';
    if (err.name === 'NotFoundError') return 'No microphone was found on this device.';
  }
  return 'We couldn’t start the microphone. Please try again.';
}

/** MediaRecorder wrapper with a hard time limit. Audio never leaves the device. */
export function useRecorder(maxSeconds: number, onComplete: (voice: VoiceMessage) => void) {
  const [state, setState] = useState<RecorderState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const discardRef = useRef(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const supported =
    typeof window !== 'undefined' && typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

  const release = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }, []);

  const stop = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state === 'recording') rec.stop();
  }, []);

  const cancel = useCallback(() => {
    discardRef.current = true;
    stop();
  }, [stop]);

  const start = useCallback(async () => {
    if (!supported || state !== 'idle') return;
    setError(null);
    setElapsed(0);
    discardRef.current = false;
    setState('requesting');

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      setState('idle');
      setError(describeMicError(err));
      return;
    }
    streamRef.current = stream;

    try {
      const mimeType = MIME_CANDIDATES.find((m) => MediaRecorder.isTypeSupported(m));
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onerror = () => {
        release();
        setState('idle');
        setError('Recording failed. Please try again.');
      };
      rec.onstop = () => {
        const seconds = Math.min(maxSeconds, Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000)));
        const type = rec.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type });
        const discard = discardRef.current;
        release();
        setState('idle');
        setElapsed(0);
        if (discard || blob.size === 0) return;
        blobToDataUrl(blob)
          .then((src) => completeRef.current({ src, durationSec: seconds, mimeType: type }))
          .catch(() => setError('We couldn’t process that recording. Please try again.'));
      };
      rec.start();
      recorderRef.current = rec;
      startedAtRef.current = Date.now();
      setState('recording');
      timerRef.current = window.setInterval(() => {
        const s = (Date.now() - startedAtRef.current) / 1000;
        setElapsed(Math.min(s, maxSeconds));
        if (s >= maxSeconds) stop();
      }, 200);
    } catch {
      release();
      setState('idle');
      setError('This browser can’t record audio.');
    }
  }, [maxSeconds, release, state, stop, supported]);

  // Stop the microphone if the component unmounts mid-recording.
  useEffect(
    () => () => {
      discardRef.current = true;
      const rec = recorderRef.current;
      if (rec && rec.state === 'recording') rec.stop();
      else release();
    },
    [release],
  );

  return { state, elapsed, error, supported, start, stop, cancel };
}
