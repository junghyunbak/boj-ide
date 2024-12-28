import { css } from '@emotion/react';
import { type CSSProperties, forwardRef } from 'react';

interface NonModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  inset: CSSProperties['inset'];
}

export const NonModal = forwardRef<HTMLDivElement, NonModalProps>(({ children, isOpen, inset }, ref) => {
  return (
    <div
      ref={ref}
      css={css`
        display: ${isOpen ? 'block' : 'none'};
        position: absolute;
        z-index: 200;
        background-color: white;
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, 0.15);
        margin: 2px 0 0;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
      `}
      style={{
        inset,
      }}
    >
      {children}
    </div>
  );
});
