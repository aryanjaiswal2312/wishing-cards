import type { SealColor } from '@/types';
import { cn } from '@/utils/cn';
import { WaxSeal } from './WaxSeal';

interface LetterPreviewProps {
  recipient: string;
  sender: string;
  letter: string;
  sealColor: SealColor;
  className?: string;
}

/** Paper stays cream in every theme so the letter feels like a real object. */
export function LetterPreview({ recipient, sender, letter, sealColor, className }: LetterPreviewProps) {
  return (
    <div
      className={cn('relative rounded-2xl bg-[#fffaf0] p-6 pb-10 text-[#3d2b25] shadow-xl', className)}
      style={{ backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(120,90,60,0.12) 27px 28px)' }}
    >
      <p className="font-serif text-xl italic">Dear {recipient || 'you'},</p>
      <p className="mt-3 whitespace-pre-wrap break-words font-serif text-lg leading-7">
        {letter || 'Your letter will appear here as you write it.'}
      </p>
      <p className="mt-5 text-right font-serif italic">With love, {sender || 'me'}</p>
      <div className="absolute -bottom-5 left-6 drop-shadow-lg">
        <WaxSeal color={sealColor} size={56} />
      </div>
    </div>
  );
}
