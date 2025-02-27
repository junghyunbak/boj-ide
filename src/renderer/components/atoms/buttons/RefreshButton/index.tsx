import { ReactComponent as Refresh } from '@/renderer/assets/svgs/refresh.svg';
import { css } from '@emotion/react';

interface RefreshButtonProps {
  onClick: React.DOMAttributes<HTMLButtonElement>['onClick'];
}

export function RefreshButton({ onClick }: RefreshButtonProps) {
  return (
    <button
      type="button"
      css={(theme) => css`
        background: none;
        border: none;
        padding: 0.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${theme.colors.fg};
        cursor: pointer;
      `}
      onClick={onClick}
    >
      <Refresh width="1rem" />
    </button>
  );
}
