import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function useSetting() {
  const [isSetting] = useStore(useShallow((s) => [s.isSetting]));

  return {
    isSetting,
  };
}
