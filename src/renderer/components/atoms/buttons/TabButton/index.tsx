import { color } from '@/renderer/styles';
import { css } from '@emotion/react';
import { forwardRef } from 'react';

interface TabButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isSelect?: boolean;
}

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ onClick, children, isSelect = false }, ref) => {
    return (
      <button
        type="button"
        css={css`
          display: flex;
          padding: 0.5rem 0.8rem;
          border: none;
          background: ${isSelect ? 'white' : 'transparent'};
          border-top: 1px solid ${isSelect ? color.primaryBg : 'transparent'};
          border-left: 1px solid ${isSelect ? 'lightgray' : 'transparent'};
          border-right: 1px solid ${isSelect ? 'lightgray' : 'transparent'};
          outline: none;
          cursor: pointer;
        `}
        onClick={onClick}
        ref={ref}
      >
        {children}
      </button>
    );
  },
);
