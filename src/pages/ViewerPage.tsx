import { Landmark } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { MuteButton } from '@/components/viewer/MuteButton';
import { RoomProgress } from '@/components/viewer/RoomProgress';
import { RoomTransition } from '@/components/viewer/RoomTransition';
import { ViewerLayout } from '@/components/viewer/ViewerLayout';
import { ViewerNavigation } from '@/components/viewer/ViewerNavigation';
import { ViewerStatusScreen } from '@/components/viewer/ViewerStatusScreen';
import { useDocumentTheme } from '@/hooks/useDocumentTheme';
import { useMuted } from '@/hooks/useMuted';
import { useRoomNavigation } from '@/hooks/useRoomNavigation';
import { useSound } from '@/hooks/useSound';
import { useViewerExperience } from '@/hooks/useViewerExperience';
import { ROOMS } from '@/rooms/registry';
import type { Experience } from '@/types';

function Museum({ experience }: { experience: Experience }) {
  const [muted, toggleMuted] = useMuted();
  const sound = useSound(muted);
  const nav = useRoomNavigation(ROOMS.length);
  const room = ROOMS[nav.index];
  const Room = room.component;

  return (
    <ViewerLayout
      onNext={nav.next}
      onPrev={nav.prev}
      topBar={
        <>
          <Landmark className="hidden h-5 w-5 shrink-0 text-accent sm:block" aria-hidden="true" />
          <RoomProgress rooms={ROOMS} index={nav.index} maxUnlocked={nav.maxUnlocked} />
          <MuteButton muted={muted} onToggle={toggleMuted} />
        </>
      }
      bottomBar={
        nav.maxUnlocked > 0 ? <ViewerNavigation canPrev={nav.canPrev} canNext={nav.canNext} onPrev={nav.prev} onNext={nav.next} /> : null
      }
    >
      <RoomTransition roomKey={room.id} direction={nav.direction}>
        <Room
          experience={experience}
          label={room.label}
          sound={sound}
          completed={nav.index < nav.maxUnlocked}
          onComplete={() => nav.complete(nav.index)}
        />
      </RoomTransition>
    </ViewerLayout>
  );
}

/** Route: /view/:id */
export default function ViewerPage() {
  const { id } = useParams();
  const { state, retry } = useViewerExperience(id);
  useDocumentTheme(state.status === 'ready' ? state.experience.theme : 'rose');

  if (state.status !== 'ready') return <ViewerStatusScreen status={state.status} onRetry={retry} />;
  // key resets the whole visit if the route changes to a different experience
  return <Museum key={state.experience.id} experience={state.experience} />;
}
