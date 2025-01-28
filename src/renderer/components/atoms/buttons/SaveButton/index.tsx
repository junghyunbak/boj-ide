import { HTMLAttributes } from 'react';

import { css } from '@emotion/react';

import { ReactComponent as Save } from '@/renderer/assets/svgs/save.svg';

import { color } from '@/renderer/styles';

interface SaveButtonProps extends HTMLAttributes<HTMLButtonElement> {}

export function SaveButton({ ...props }: SaveButtonProps) {
  return (
    <button
      type="button"
      css={css`
        padding: 0.5rem;
        border: 1px solid ${color.primaryBg};
        background: none;
        border-radius: 4px;
        display: flex;
        opacity: 0.5;
        cursor: pointer;

        &:hover {
          opacity: 1;
        }

        svg {
          width: 1.5rem;
          color: ${color.primaryBg};
        }
      `}
      {...props}
    >
      <Save />
    </button>
  );
}
