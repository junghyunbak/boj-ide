import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useLanguage() {
  const [language] = useStore(useShallow((s) => [s.lang]));

  return { language };
}
