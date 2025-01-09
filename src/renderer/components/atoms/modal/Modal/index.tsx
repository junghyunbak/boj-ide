import { forwardRef } from 'react';

import { css } from '@emotion/react';

import { zIndex } from '@/renderer/styles';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onCloseButtonClick: () => void;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(({ children, isOpen, onCloseButtonClick }, ref) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={ref}
      css={css`
        position: fixed;
        inset: 0;
        z-index: ${zIndex.overlay.modal};
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <div
        css={css`
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.3);
        `}
        onClick={onCloseButtonClick}
      />
      <div
        css={css`
          position: absolute;
        `}
      >
        {children}
      </div>
    </div>
  );
});
