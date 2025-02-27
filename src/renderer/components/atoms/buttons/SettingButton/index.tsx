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
      css={(theme) => css`
        display: flex;
        justify-content: center;
        align-items: center;

        border: none;

        color: ${theme.colors.fg};

        background: none;

        padding: 0.5rem;

        cursor: pointer;
      `}
    >
      <Gear width="1rem" />
    </button>
  );
}
