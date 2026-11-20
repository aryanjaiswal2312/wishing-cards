import type { ComponentType } from 'react';
import { DoorRoom } from './DoorRoom';
import { IntroRoom } from './IntroRoom';
import { PendingRoom } from './PendingRoom';
import type { RoomProps } from './types';

export interface RoomDefinition {
  id: string;
  label: string;
  component: ComponentType<RoomProps>;
}

/** The full museum, in order. Later phases swap PendingRoom for the real room. */
export const ROOMS: readonly RoomDefinition[] = [
  { id: 'intro', label: 'Welcome', component: IntroRoom },
  { id: 'door', label: 'The door', component: DoorRoom },
  { id: 'gallery', label: 'Memories', component: PendingRoom },
  { id: 'puzzle', label: 'Puzzle', component: PendingRoom },
  { id: 'reasons', label: 'Reasons', component: PendingRoom },
  { id: 'letter', label: 'Letter', component: PendingRoom },
  { id: 'promises', label: 'Promises', component: PendingRoom },
  { id: 'finale', label: 'Finale', component: PendingRoom },
];
