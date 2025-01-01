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
        padding: 0;
      `}
    >
      <Gear width="1.5rem" />
    </button>
  );
}
