import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

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
      `}
    >
      <FontAwesomeIcon icon={faGear} size="xl" />
    </button>
  );
}
