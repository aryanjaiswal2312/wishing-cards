import { Hammer } from 'lucide-react';
import type { RoomProps } from './types';

/** Stand-in for rooms that arrive in later phases. It never completes, so nothing past it unlocks. */
export function PendingRoom({ experience, label }: RoomProps) {
  return (
    <div className="grid flex-1 place-items-center px-5 py-10">
      <div className="glass max-w-md rounded-[2rem] p-8 text-center">
        <Hammer className="mx-auto mb-4 h-9 w-9 text-accent" aria-hidden="true" />
        <h2 className="text-3xl">{label} isn’t ready yet</h2>
        <p className="mt-3 text-soft">{experience.sender} is still setting this room up. Use Back to revisit the rooms you’ve already seen.</p>
      </div>
    </div>
  );
}
