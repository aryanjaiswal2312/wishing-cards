import { DoorClosed, Landmark, LinkIcon, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import type { ViewerState } from '@/hooks/useViewerExperience';

type Problem = Exclude<ViewerState['status'], 'ready'>;

const COPY: Record<Exclude<Problem, 'loading'>, { title: string; text: string }> = {
  missing: {
    title: 'We couldn’t find this museum',
    text: 'Museums are saved on the device that created them, so this link may only open there. It may also have been deleted.',
  },
  invalid: {
    title: 'This link doesn’t look right',
    text: 'Check that the whole link was copied, or ask the sender to share it again.',
  },
  error: {
    title: 'The museum won’t open',
    text: 'Your browser’s storage isn’t responding. Check that private browsing or storage blocking is off, then try again.',
  },
};

export function ViewerStatusScreen({ status, onRetry }: { status: Problem; onRetry: () => void }) {
  if (status === 'loading') {
    return (
      <main className="relative z-10 grid min-h-dvh place-items-center px-4">
        <div role="status" className="flex flex-col items-center gap-4 text-soft">
          <Landmark className="h-10 w-10 animate-pulse text-accent" aria-hidden="true" />
          <p className="font-serif text-2xl italic text-ink">Opening the museum…</p>
        </div>
      </main>
    );
  }

  const { title, text } = COPY[status];
  const Icon = status === 'invalid' ? LinkIcon : DoorClosed;
  return (
    <main className="relative z-10 grid min-h-dvh place-items-center px-4 py-10">
      <div className="glass w-full max-w-md rounded-[2rem] p-8 text-center sm:p-10">
        <Icon className="mx-auto mb-4 h-10 w-10 text-accent" aria-hidden="true" />
        <h1 className="text-3xl">{title}</h1>
        <p className="mt-3 text-soft">{text}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {status === 'error' && (
            <Button leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />} onClick={onRetry}>
              Try again
            </Button>
          )}
          <Link to="/create">
            <Button variant={status === 'error' ? 'secondary' : 'primary'}>Make your own museum</Button>
          </Link>
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
