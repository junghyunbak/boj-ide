import { css } from '@emotion/react';
import { ReactComponent as Gear } from '@/renderer/assets/svgs/gear.svg';

interface SettingButtonProps {
  onClick: () => void;
}

export function SettingButton({ onClick }: SettingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      css={css`
        border: none;
        background: none;
        color: gray;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
      `}
    >
      <Gear width="1rem" />
    </button>
  );
}
