import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useToast() {
  const [toastContext] = useStore(useShallow((s) => [s.toastContext]));

  return {
    toastContext,
  };
}
