import { css } from '@emotion/react';

import { HorizontalResizer } from '@/renderer/components/atoms/lines/HorizontalResizer';
import { VerticalResizer } from '@/renderer/components/atoms/lines/VerticalResizer';

import { useWindowEvent } from '@/renderer/hooks';

import { useSplitLayoutStoreContext } from '../SplitLayoutContext';

type ResizerProps = {
  onDragStart?(): void;
  onDragEnd?(): void;
  zIndex?: number;
};

export function Resizer({ children, onDragStart, onDragEnd, zIndex }: React.PropsWithChildren<ResizerProps>) {
  const { splitLayoutStore } = useSplitLayoutStoreContext();

  const { resizerRef, vertical } = splitLayoutStore.getState();

  const DefaultResizer = vertical ? HorizontalResizer : VerticalResizer;

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const { leftRef } = splitLayoutStore.getState();

    const left = leftRef.current;

    if (!left) {
      return;
    }

    if (onDragStart) {
      onDragStart();
    }

    splitLayoutStore.getState().isDrag = true;

    const { clientX, clientY } = e;
    const { width, height } = left.getBoundingClientRect();

    splitLayoutStore.getState().startX = vertical ? clientY : clientX;
    splitLayoutStore.getState().leftWidth = vertical ? height : width;
  };

  /**
   * 요소가 아닌 전역에 이벤트를 붙인 이유
   *
   * : 앱 밖으로 마우스 커서가 이동한 경우에도 mouseup이 동작되도록 하기 위해서
   */
  useWindowEvent(
    () => {
      if (splitLayoutStore.getState().isDrag) {
        splitLayoutStore.getState().isDrag = false;

        if (onDragEnd) {
          onDragEnd();
        }
      }
    },
    [onDragEnd, splitLayoutStore],
    'mouseup',
  );

  return (
    <div
      ref={resizerRef}
      onMouseDown={handleMouseDown}
      css={css`
        user-select: none;
      `}
    >
      {children || <DefaultResizer zIndex={zIndex} />}
    </div>
  );
}
