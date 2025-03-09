import { css } from '@emotion/react';

import { useEventWindow } from '@/renderer/hooks';

import { useSplitLayoutStoreContext } from '../SplitLayoutContext';

type LeftProps = {
  initialRatio?: number;
  onRatioChange?(ratio: number): void;

  px?: {
    min: number;
  };
};

export function Left({ children, initialRatio = 50, onRatioChange, px }: React.PropsWithChildren<LeftProps>) {
  const { splitLayoutStore } = useSplitLayoutStoreContext();

  useEventWindow(
    (e) => {
      const { isDrag, containerRef, leftRef, vertical, startX, leftWidth } = splitLayoutStore.getState();

      if (!isDrag) {
        return;
      }

      const container = containerRef.current;
      const left = leftRef.current;

      if (!container || !left) {
        return;
      }

      const { clientX, clientY } = e;
      const { width, height } = container.getBoundingClientRect();

      const deltaX = (vertical ? clientY : clientX) - startX;

      if (px) {
        if (vertical) {
          left.style.height = `${Math.max(px.min, leftWidth + deltaX)}px`;
        } else {
          left.style.width = `${Math.max(px.min, leftWidth + deltaX)}px`;
        }
      } else {
        const ratio = Math.min(((leftWidth + deltaX) / (vertical ? height : width)) * 100, 100);

        if (vertical) {
          left.style.height = `${ratio}%`;
        } else {
          left.style.width = `${ratio}%`;
        }

        if (onRatioChange) {
          onRatioChange(ratio);
        }
      }
    },
    [onRatioChange, px, splitLayoutStore],
    'mousemove',
  );

  return (
    <div
      ref={splitLayoutStore.getState().leftRef}
      css={
        splitLayoutStore.getState().vertical
          ? css`
              width: 100%;
              height: ${initialRatio}%;
            `
          : css`
              width: ${initialRatio}%;
              height: 100%;
            `
      }
    >
      {children}
    </div>
  );
}
