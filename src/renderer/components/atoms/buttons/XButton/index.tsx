import { ReactComponent as X } from '@/renderer/assets/svgs/x.svg';
import { css } from '@emotion/react';
import { color } from '@/styles';

interface XButtonProps {
  onClick: React.DOMAttributes<HTMLButtonElement>['onClick'];
}

export function XButton({ onClick }: XButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
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
    >
      <X
        width="0.6rem"
        css={css`
          color: ${color.text};
        `}
      />
    </button>
  );
}
