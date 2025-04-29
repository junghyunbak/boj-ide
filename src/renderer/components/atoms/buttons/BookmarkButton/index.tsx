import { ReactComponent as Bookmark } from '@/renderer/assets/svgs/bookmark.svg';
import { css } from '@emotion/react';

interface BookmarkButtonProps {
  onClick: React.DOMAttributes<HTMLButtonElement>['onClick'];
}

export function BookmarkButton({ onClick }: BookmarkButtonProps) {
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
      <Bookmark height="1rem" />
    </button>
  );
}
