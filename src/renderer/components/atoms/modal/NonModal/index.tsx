import { type CSSProperties, forwardRef } from 'react';

import { css } from '@emotion/react';

import { zIndex } from '@/renderer/styles';

interface NonModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  inset: CSSProperties['inset'];
  border?: 'flat' | 'round';
}

export const NonModal = forwardRef<HTMLDivElement, NonModalProps>(
  ({ children, isOpen, inset, border = 'flat' }, ref) => {
    return (
      <div
        ref={ref}
        css={(theme) => css`
          position: absolute;
          z-index: ${zIndex.overlay.nonModal};

          overflow: hidden;

          background-color: ${theme.colors.bg};

          border: 1px solid ${theme.colors.border};
          ${border === 'round'
            ? css`
                border-radius: 4px;
              `
            : css``}

          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        `}
        style={{
          inset,
        }}
      >
        {isOpen && children}
      </div>
    );
  },
);
