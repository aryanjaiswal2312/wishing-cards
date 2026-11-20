import type { SoundEffects } from '@/hooks/useSound';
import type { Experience } from '@/types';

export interface RoomProps {
  experience: Experience;
  label: string;
  sound: SoundEffects;
  /** True when the visitor has already passed through this room once. */
  completed: boolean;
  /** Call when the visitor has finished the room; moves on to the next one. */
  onComplete: () => void;
}
