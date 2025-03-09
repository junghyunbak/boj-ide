import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useMovableTabContext } from '../MovableTabContext';

import { LineBox, LineLayout } from './index.style';

export function MovableTabLeftLine() {
  const { tabIndex } = useMovableTabContext();

  const [isTabDrag] = useStore(useShallow((s) => [s.isTabDrag]));
  const [destTabIndex] = useStore(useShallow((s) => [s.destTabIndex]));

  const isHidden = !isTabDrag || destTabIndex !== tabIndex;

  if (tabIndex !== 0) {
    return null;
  }

  return (
    <LineLayout dir="left">
      <LineBox isHidden={isHidden} />
    </LineLayout>
  );
}

export function MovableTabRightLine() {
  const { tabIndex } = useMovableTabContext();

  const [isTabDrag] = useStore(useShallow((s) => [s.isTabDrag]));
  const [destTabIndex] = useStore(useShallow((s) => [s.destTabIndex]));

  const isHidden = !isTabDrag || destTabIndex !== tabIndex + 1;

  return (
    <LineLayout dir="right">
      <LineBox isHidden={isHidden} />
    </LineLayout>
  );
}
