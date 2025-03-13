/* eslint-disable react-hooks/rules-of-hooks */
import { useDrag } from '@/renderer/hooks';

import { useMovableTabContext } from '../MovableTabContext';

import { LineBox, LineLayout } from './index.style';

const MovableTabLineImpl = (dir: 'left' | 'right') =>
  function () {
    const { tabIndex } = useMovableTabContext();
    const { isTabDrag, destTabIndex } = useDrag();

    const isHidden = !isTabDrag || destTabIndex !== (dir === 'left' ? tabIndex : tabIndex + 1);

    return (
      <LineLayout dir={dir}>
        <LineBox isHidden={isHidden} />
      </LineLayout>
    );
  };

export const MovableTabLeftLine = MovableTabLineImpl('left');
export const MovableTabRightLine = MovableTabLineImpl('right');
