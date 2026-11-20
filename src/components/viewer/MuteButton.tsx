import { Volume2, VolumeX } from 'lucide-react';
import { IconButton } from '@/components/ui/Button';

export function MuteButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <IconButton label={muted ? 'Unmute sound' : 'Mute sound'} variant="secondary" aria-pressed={muted} onClick={onToggle}>
      {muted ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Volume2 className="h-5 w-5" aria-hidden="true" />}
    </IconButton>
  );
}
