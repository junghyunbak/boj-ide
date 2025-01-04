import { color } from '@/renderer/styles';
import { css } from '@emotion/react';

export function Exclamation() {
  return (
    <div
      css={css`
        width: 15px;
        height: 15px;
        background-color: ${color.wrong};
        border-radius: 9999px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      !
    </div>
  );
}
