import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <main className="relative z-10 grid min-h-dvh place-items-center px-4 text-center">
      <div className="glass max-w-md rounded-[2rem] p-10">
        <h1 className="text-4xl">Wrong turn</h1>
        <p className="mt-3 text-soft">There’s no room at this address.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Back to home</Button>
        </Link>
      </div>
    </main>
  );
}
