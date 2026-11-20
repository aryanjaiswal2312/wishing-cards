import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ViewerNavigationProps {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function ViewerNavigation({ canPrev, canNext, onPrev, onNext }: ViewerNavigationProps) {
  return (
    <nav aria-label="Room navigation" className="mx-auto flex w-full max-w-md items-center justify-between gap-3">
      <Button variant="secondary" disabled={!canPrev} leftIcon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />} onClick={onPrev}>
        Back
      </Button>
      <Button variant={canNext ? 'primary' : 'secondary'} disabled={!canNext} rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />} onClick={onNext}>
        Next
      </Button>
    </nav>
  );
}
