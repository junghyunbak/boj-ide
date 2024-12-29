import { color } from '@/styles';
import { css } from '@emotion/react';

interface TabButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isSelect?: boolean;
}

export function TabButton({ onClick, children, isSelect = false }: TabButtonProps) {
  return (
    <button
      type="button"
      css={css`
        display: flex;
        padding: 0.4rem 0.8rem;
        border: none;
        background: ${isSelect ? 'white' : 'transparent'};
        border-top: 1px solid ${isSelect ? color.primaryBg : 'transparent'};
        border-left: 1px solid ${isSelect ? 'lightgray' : 'transparent'};
        border-right: 1px solid ${isSelect ? 'lightgray' : 'transparent'};
        border-bottom: 1px solid ${isSelect ? 'transparent' : 'lightgray'};
        margin-right: -1px;
        cursor: pointer;
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
