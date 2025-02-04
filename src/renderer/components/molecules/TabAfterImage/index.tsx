import { useEffect, useRef } from 'react';
import { css } from '@emotion/react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { zIndex } from '@/renderer/styles';

export function TabAfterImage() {
  const [isTabDrag] = useStore(useShallow((s) => [s.isTabDrag]));
  const [currentAfterImageUrl] = useStore(useShallow((s) => [s.currentAfterImageUrl]));

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      containerRef.current.style.top = `${e.clientY}px`;
      containerRef.current.style.left = `${e.clientX}px`;
    };

    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      css={css`
        position: fixed;
        pointer-events: none;
        z-index: ${zIndex.overlay.afterImage};
        opacity: 0.8;
      `}
    >
      {isTabDrag && currentAfterImageUrl && <img src={currentAfterImageUrl} />}
    </div>
  );
}
