import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { css } from '@emotion/react';
import { zIndex } from '@/renderer/styles';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

export function TabAfterImage({ children }: React.PropsWithChildren) {
  const [isTabDrag] = useStore(useShallow((s) => [s.isTabDrag]));

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

  return ReactDOM.createPortal(
    <div
      ref={containerRef}
      css={css`
        position: fixed;
        pointer-events: none;
        z-index: ${zIndex.overlay.afterImage};
        opacity: 0.8;
        box-shadow: 0 3px 5px rgb(0 0 0 / 30%);
      `}
    >
      {children}
    </div>,
    document.querySelector('#after-image')!,
  );
}
