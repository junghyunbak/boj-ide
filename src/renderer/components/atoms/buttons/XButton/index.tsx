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
        border-radius: 9999px;
        width: 15px;
        height: 15px;
        padding: 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover {
          background-color: lightgray;
          cursor: pointer;
        }
      `}
    >
      <X
        css={css`
          width: 100%;
          height: 100%;
          color: ${color.text};
        `}
      />
    </button>
  );
}
