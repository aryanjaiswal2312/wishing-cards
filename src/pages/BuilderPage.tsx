import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Landmark, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { ReviewStep } from '@/components/builder/ReviewStep';
import { StepAppearance } from '@/components/builder/StepAppearance';
import { StepDetails } from '@/components/builder/StepDetails';
import { StepGallery } from '@/components/builder/StepGallery';
import { StepLetter } from '@/components/builder/StepLetter';
import { StepPromises } from '@/components/builder/StepPromises';
import { StepVoice } from '@/components/builder/StepVoice';
import { SuccessScreen } from '@/components/builder/SuccessScreen';
import type { StepProps } from '@/components/builder/stepTypes';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { useToast } from '@/components/ui/Toast';
import { useDocumentTheme } from '@/hooks/useDocumentTheme';
import { useDraft } from '@/hooks/useDraft';
import type { Experience } from '@/types';
import { STEPS } from '@/utils/constants';
import { sanitizeDraft } from '@/utils/experience';
import { saveExperience } from '@/utils/storage';
import { firstError, validateStep } from '@/utils/validation';

const STEP_COMPONENTS: ComponentType<StepProps>[] = [StepDetails, StepAppearance, StepGallery, StepLetter, StepVoice, StepPromises];

const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 32 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -32 }),
};

export default function BuilderPage() {
  const toast = useToast();
  const { draft, update, reset, ready, restored, persistError } = useDraft();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState<Experience | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useDocumentTheme(created?.theme ?? draft.theme);

  useEffect(() => {
    if (restored) toast('Welcome back. Your unfinished draft was restored.', 'success');
  }, [restored, toast]);

  useEffect(() => {
    if (persistError) toast('Auto-save isn’t available in this browser, so finish in one sitting.', 'error');
  }, [persistError, toast]);

  const reviewing = step === STEPS.length;
  const errors = useMemo(() => (showErrors && !reviewing ? validateStep(step, draft) : {}), [showErrors, reviewing, step, draft]);

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > step ? 1 : -1);
      setStep(next);
      setShowErrors(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [step],
  );

  const handleNext = () => {
    const message = firstError(validateStep(step, draft));
    if (message) {
      setShowErrors(true);
      toast(message, 'error');
      return;
    }
    update((d) => sanitizeDraft(d));
    goTo(step + 1);
  };

  const handleConfirm = async () => {
    const clean = sanitizeDraft(draft);
    for (let i = 0; i < STEPS.length; i += 1) {
      const message = firstError(validateStep(i, clean));
      if (message) {
        goTo(i);
        setShowErrors(true);
        toast(message, 'error');
        return;
      }
    }
    setSaving(true);
    try {
      const experience = await saveExperience(clean);
      await reset();
      setCreated(experience);
    } catch {
      toast('We couldn’t save on this device. Check that browser storage isn’t blocked.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const startOver = async () => {
    setConfirmReset(false);
    await reset();
    setCreated(null);
    setStep(0);
    setShowErrors(false);
    window.scrollTo({ top: 0 });
  };

  const Current = reviewing ? null : STEP_COMPONENTS[step];
  const meta = reviewing
    ? { title: 'Walk through your museum', subtitle: 'This is exactly what they will find. Edit anything, then confirm.' }
    : STEPS[step];

  return (
    <div className="relative z-10 flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 rounded-lg font-serif text-xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-accent/60">
          <Landmark className="h-5 w-5 text-accent" aria-hidden="true" />
          Museum of Us
        </Link>
        {!created && (
          <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="h-4 w-4" aria-hidden="true" />} onClick={() => setConfirmReset(true)}>
            Start over
          </Button>
        )}
      </header>

      {created ? (
        <SuccessScreen experience={created} onCreateAnother={() => void startOver()} />
      ) : !ready ? (
        <div className="grid flex-1 place-items-center text-soft" role="status">
          Loading your draft…
        </div>
      ) : (
        <>
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-36 sm:px-6">
            <ProgressSteps steps={STEPS} current={step} onNavigate={goTo} />
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.section
                key={step}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="glass mt-6 rounded-[2rem] p-5 sm:p-8"
              >
                <h1 className="text-3xl sm:text-4xl">{meta.title}</h1>
                <p className="mb-8 mt-2 max-w-xl text-soft">{meta.subtitle}</p>
                {Current ? <Current draft={draft} update={update} errors={errors} /> : <ReviewStep draft={draft} onEdit={goTo} />}
              </motion.section>
            </AnimatePresence>
          </main>

          <nav
            aria-label="Builder navigation"
            className="glass fixed inset-x-0 bottom-0 z-20 rounded-none border-x-0 border-b-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 pt-3 sm:px-6">
              <Button variant="secondary" disabled={step === 0} leftIcon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />} onClick={() => goTo(step - 1)}>
                Back
              </Button>
              {reviewing ? (
                <Button size="lg" loading={saving} leftIcon={<Check className="h-5 w-5" aria-hidden="true" />} onClick={() => void handleConfirm()}>
                  Confirm and create
                </Button>
              ) : (
                <Button rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />} onClick={handleNext}>
                  {step === STEPS.length - 1 ? 'Review' : 'Continue'}
                </Button>
              )}
            </div>
          </nav>
        </>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Start over?"
        message="This clears everything you’ve entered so far, including photos and your recording."
        confirmLabel="Clear everything"
        cancelLabel="Keep editing"
        destructive
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => void startOver()}
      />
    </div>
  );
}
