import { cn } from '@/utils/cn';

interface RoomProgressProps {
  rooms: ReadonlyArray<{ label: string }>;
  index: number;
  maxUnlocked: number;
}

export function RoomProgress({ rooms, index, maxUnlocked }: RoomProgressProps) {
  const text = `Room ${index + 1} of ${rooms.length}: ${rooms[index]?.label}`;
  return (
    <div role="progressbar" aria-valuemin={1} aria-valuemax={rooms.length} aria-valuenow={index + 1} aria-valuetext={text} className="min-w-0 flex-1">
      <div className="flex gap-1.5" aria-hidden="true">
        {rooms.map((room, i) => (
          <span
            key={room.label}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-500',
              i === index ? 'bg-accent' : i <= maxUnlocked ? 'bg-accent/45' : 'bg-ink/15',
            )}
          />
        ))}
      </div>
      <p className="mt-2 truncate text-xs text-soft">{text}</p>
    </div>
  );
}
