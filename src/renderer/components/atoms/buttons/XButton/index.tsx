import { ReactComponent as X } from '@/renderer/assets/svgs/x.svg';
import { css } from '@emotion/react';
import { color } from '@/styles';
import { forwardRef } from 'react';

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
        css={css`
          color: ${color.text};
        `}
      />
    </button>
  );
});
