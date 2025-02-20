import { useEffect } from 'react';

import { HorizontalResizer } from '@/renderer/components/atoms/lines/HorizontalResizer';
import { VerticalResizer } from '@/renderer/components/atoms/lines/VerticalResizer';

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

  useEffect(() => {
    const handleMouseUp = () => {
      splitLayoutStore.getState().isDrag = false;

      if (onDragEnd) {
        onDragEnd();
      }
    };

    window.addEventListener('mouseup', handleMouseUp);

    return function cleanup() {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [splitLayoutStore, onDragEnd]);

  return (
    <div ref={resizerRef} onMouseDown={handleMouseDown}>
      {children || <DefaultResizer zIndex={zIndex} />}
    </div>
  );
}
