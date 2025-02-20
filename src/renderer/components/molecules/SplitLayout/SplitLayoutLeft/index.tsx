import { css } from '@emotion/react';

import { useEffect } from 'react';

import { useSplitLayoutStoreContext } from '../SplitLayoutContext';

type LeftProps = {
  initialRatio?: number;
  onRatioChange?(ratio: number): void;
};

export function Left({ children, initialRatio = 50, onRatioChange }: React.PropsWithChildren<LeftProps>) {
  const { splitLayoutStore } = useSplitLayoutStoreContext();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
      const ratio = Math.min(((leftWidth + deltaX) / (vertical ? height : width)) * 100, 100);

      if (vertical) {
        left.style.height = `${ratio}%`;
      } else {
        left.style.width = `${ratio}%`;
      }

      if (onRatioChange) {
        onRatioChange(ratio);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return function cleanup() {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [splitLayoutStore, onRatioChange]);

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
