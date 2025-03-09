import { useRef } from 'react';
import ReactDOM from 'react-dom';

import { css } from '@emotion/react';

import { zIndex } from '@/renderer/styles';

import { useWindowEvent } from '@/renderer/hooks';

export function TabAfterImage({ children }: React.PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useWindowEvent(
    (e) => {
      if (!containerRef.current) {
        return;
      }

      containerRef.current.style.top = `${e.clientY}px`;
      containerRef.current.style.left = `${e.clientX}px`;
    },
    [],
    'mousemove',
  );

  return ReactDOM.createPortal(
    <div
      ref={containerRef}
      css={css`
        position: fixed;
        top: ${window.innerHeight}px;
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
