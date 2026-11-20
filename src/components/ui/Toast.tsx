import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ToastKind = 'success' | 'error' | 'info';
type PushToast = (message: string, kind?: ToastKind) => void;
interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

const ToastContext = createContext<PushToast>(() => undefined);
export const useToast = (): PushToast => useContext(ToastContext);

const icons = { success: CheckCircle2, error: AlertCircle, info: Info } as const;
const tone = { success: 'text-accent', error: 'text-red-500', info: 'text-soft' } as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const push = useCallback<PushToast>((message, kind = 'info') => {
    const id = ++counter.current;
    setItems((prev) => [...prev.slice(-2), { id, message, kind }]);
    window.setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      {createPortal(
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6"
        >
          <AnimatePresence initial={false}>
            {items.map((t) => {
              const Icon = icons[t.kind];
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-solid pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-sm text-ink"
                >
                  <Icon className={`h-5 w-5 shrink-0 ${tone[t.kind]}`} aria-hidden="true" />
                  <span>{t.message}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
