import { AnimatePresence, motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import { ImagePlus, Puzzle, Replace, Trash2 } from 'lucide-react';
import { useRef, useState, type DragEvent } from 'react';
import { IconButton } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/Field';
import { Tooltip } from '@/components/ui/Tooltip';
import { useToast } from '@/components/ui/Toast';
import type { Photo } from '@/types';
import { cn } from '@/utils/cn';
import { LIMITS } from '@/utils/constants';
import { compressImage } from '@/utils/image';
import type { StepProps } from './stepTypes';

export function StepGallery({ draft, update, errors }: StepProps) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const addInput = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const replaceTarget = useRef<string | null>(null);

  const count = draft.photos.length;
  const full = count >= LIMITS.photos;

  const addFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    const room = LIMITS.photos - count;
    if (list.length === 0) return;
    if (room <= 0) {
      toast(`You can add up to ${LIMITS.photos} photographs.`, 'info');
      return;
    }
    if (list.length > room) toast(`Only ${room} more photo${room === 1 ? '' : 's'} fit. Extra files were skipped.`, 'info');

    setBusy(true);
    const added: Photo[] = [];
    for (const file of list.slice(0, room)) {
      try {
        const img = await compressImage(file);
        added.push({ id: nanoid(8), src: img.src, caption: '', width: img.width, height: img.height });
      } catch (err) {
        toast(`${file.name}: ${err instanceof Error ? err.message : 'could not be added.'}`, 'error');
      }
    }
    if (added.length) {
      update((d) => ({
        photos: [...d.photos, ...added].slice(0, LIMITS.photos),
        puzzlePhotoId: d.puzzlePhotoId ?? added[0].id,
      }));
    }
    setBusy(false);
  };

  const replaceFile = async (file: File | undefined) => {
    const id = replaceTarget.current;
    replaceTarget.current = null;
    if (!file || !id) return;
    setBusy(true);
    try {
      const img = await compressImage(file);
      update((d) => ({
        photos: d.photos.map((p) => (p.id === id ? { ...p, src: img.src, width: img.width, height: img.height } : p)),
      }));
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not replace that photo.', 'error');
    }
    setBusy(false);
  };

  const remove = (id: string) =>
    update((d) => {
      const photos = d.photos.filter((p) => p.id !== id);
      return { photos, puzzlePhotoId: d.puzzlePhotoId === id ? (photos[0]?.id ?? null) : d.puzzlePhotoId };
    });

  const onDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragging(false);
    void addFiles(e.dataTransfer.files);
  };

  return (
    <div className="grid gap-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'rounded-3xl border-2 border-dashed p-8 text-center transition',
          dragging ? 'border-accent bg-accent/10' : 'border-line/30 bg-surface/20',
          full && 'opacity-60',
        )}
      >
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-accent/15 text-accent">
          <ImagePlus className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="font-medium text-ink">{busy ? 'Preparing your photos…' : 'Drag photos here'}</p>
        <p className="mt-1 text-sm text-soft">
          {count}/{LIMITS.photos} added · compressed on your device, never uploaded
        </p>
        <button
          type="button"
          disabled={full || busy}
          onClick={() => addInput.current?.click()}
          className="mt-4 rounded-full bg-gradient-to-br from-accent to-accent2 px-5 py-2.5 text-sm font-medium text-accent-ink shadow-lg shadow-accent/25 outline-none transition hover:shadow-xl focus-visible:ring-2 focus-visible:ring-accent/60 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Browse photos
        </button>
        <input
          ref={addInput}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void addFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <input
          ref={replaceInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            void replaceFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>

      {errors.photos && (
        <p role="alert" className="text-sm text-red-500">
          {errors.photos}
        </p>
      )}

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {draft.photos.map((p, i) => {
            const isPuzzle = draft.puzzlePhotoId === p.id;
            return (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[4/5] bg-ink/5">
                  <img src={p.src} alt={p.caption || `Photograph ${i + 1}`} className="h-full w-full object-cover" />
                  <div className="absolute right-2 top-2 flex gap-1.5">
                    <Tooltip label="Replace" side="bottom">
                      <IconButton
                        label={`Replace photograph ${i + 1}`}
                        variant="overlay"
                        size="sm"
                        onClick={() => {
                          replaceTarget.current = p.id;
                          replaceInput.current?.click();
                        }}
                      >
                        <Replace className="h-4 w-4" aria-hidden="true" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip label="Remove" side="bottom">
                      <IconButton label={`Remove photograph ${i + 1}`} variant="overlay" size="sm" onClick={() => remove(p.id)}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <button
                    type="button"
                    aria-pressed={isPuzzle}
                    onClick={() => update({ puzzlePhotoId: p.id })}
                    className={cn(
                      'absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium outline-none backdrop-blur focus-visible:ring-2 focus-visible:ring-accent/60',
                      isPuzzle ? 'bg-accent text-accent-ink' : 'bg-black/45 text-white hover:bg-black/65',
                    )}
                  >
                    <Puzzle className="h-3.5 w-3.5" aria-hidden="true" />
                    {isPuzzle ? 'Puzzle photo' : 'Use for puzzle'}
                  </button>
                </div>
                <div className="p-3">
                  <TextInput
                    hideLabel
                    label={`Caption for photograph ${i + 1}`}
                    placeholder="Add a caption"
                    maxLength={LIMITS.caption}
                    value={p.caption}
                    className="!rounded-xl !px-3 !py-2 text-sm"
                    onChange={(e) =>
                      update((d) => ({ photos: d.photos.map((x) => (x.id === p.id ? { ...x, caption: e.target.value } : x)) }))
                    }
                  />
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
