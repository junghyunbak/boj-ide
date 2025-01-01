import { ReactComponent as ExternalLink } from '@/renderer/assets/svgs/external-link.svg';
import { css } from '@emotion/react';

interface ExternalLinkButtonProps {
  onClick: () => void;
}

export function ExternalLinkButton({ onClick }: ExternalLinkButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        border: none;
        background: none;
        cursor: pointer;
        color: gray;
      `}
    >
      <ExternalLink width="1rem" />
    </button>
  );
}
