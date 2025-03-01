import { forwardRef } from 'react';

import { css } from '@emotion/react';

import { ReactComponent as X } from '@/renderer/assets/svgs/x.svg';

interface XButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const XButton = forwardRef<HTMLButtonElement, XButtonProps>(({ onClick, onMouseDown }, ref) => {
  return (
    <button
      type="button"
      css={css`
        border: none;
        background-color: transparent;
        border-radius: 0.25rem;
        padding: 0.25rem;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
      `}
      onClick={onClick}
      onMouseDown={onMouseDown}
      ref={ref}
    >
      <X
        width="0.6rem"
        css={(theme) => css`
          color: ${theme.colors.fg};
        `}
      />
    </button>
  );
});
