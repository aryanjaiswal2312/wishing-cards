import { useCallback, useEffect, useMemo, useRef } from 'react';

export interface SoundEffects {
  knock: () => void;
  creak: () => void;
  chime: () => void;
}

type AudioCtor = typeof AudioContext;
type Synth = (ctx: AudioContext, t: number, out: GainNode) => void;

/**
 * Synthesised sound effects (Web Audio), so the app needs no audio files.
 * The AudioContext is created on the first effect, which always follows a tap.
 */
export function useSound(muted: boolean): SoundEffects {
  const ctxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const play = useCallback((synth: Synth) => {
    if (mutedRef.current) return;
    try {
      if (!ctxRef.current) {
        const Ctor: AudioCtor | undefined =
          window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
        if (!Ctor) return;
        ctxRef.current = new Ctor();
      }
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') void ctx.resume();
      const out = ctx.createGain();
      out.connect(ctx.destination);
      synth(ctx, ctx.currentTime, out);
    } catch {
      // audio is a nice-to-have; never break the experience
    }
  }, []);

  useEffect(
    () => () => {
      void ctxRef.current?.close().catch(() => undefined);
      ctxRef.current = null;
    },
    [],
  );

  return useMemo<SoundEffects>(
    () => ({
      // A wooden thud: a quick low sine drop plus a short filtered noise click.
      knock: () =>
        play((ctx, t, out) => {
          out.gain.setValueAtTime(0.9, t);
          const osc = ctx.createOscillator();
          const body = ctx.createGain();
          osc.frequency.setValueAtTime(160, t);
          osc.frequency.exponentialRampToValueAtTime(52, t + 0.14);
          body.gain.setValueAtTime(1, t);
          body.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
          osc.connect(body).connect(out);
          osc.start(t);
          osc.stop(t + 0.25);

          const len = Math.floor(ctx.sampleRate * 0.04);
          const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
          const noise = ctx.createBufferSource();
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 900;
          noise.buffer = buffer;
          noise.connect(filter).connect(out);
          noise.start(t);
        }),
      // Slow, low hinge creak.
      creak: () =>
        play((ctx, t, out) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const env = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(70, t);
          osc.frequency.linearRampToValueAtTime(118, t + 0.6);
          osc.frequency.linearRampToValueAtTime(76, t + 1.3);
          filter.type = 'lowpass';
          filter.frequency.value = 420;
          env.gain.setValueAtTime(0.0001, t);
          env.gain.linearRampToValueAtTime(0.16, t + 0.3);
          env.gain.linearRampToValueAtTime(0.0001, t + 1.4);
          osc.connect(filter).connect(env).connect(out);
          osc.start(t);
          osc.stop(t + 1.5);
        }),
      // Two soft bell notes.
      chime: () =>
        play((ctx, t, out) => {
          out.gain.setValueAtTime(0.3, t);
          [659.25, 987.77].forEach((freq, i) => {
            const start = t + i * 0.14;
            const osc = ctx.createOscillator();
            const env = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            env.gain.setValueAtTime(0.0001, start);
            env.gain.exponentialRampToValueAtTime(1, start + 0.02);
            env.gain.exponentialRampToValueAtTime(0.0001, start + 1.3);
            osc.connect(env).connect(out);
            osc.start(start);
            osc.stop(start + 1.4);
          });
        }),
    }),
    [play],
  );
}
