import { css } from '@emotion/react';

export function ThreeLineHorizontalResizer() {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        cursor: row-resize;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          padding: 0.2rem 0;
          gap: 0.1rem;

          & > div {
            width: 40px;
            height: 2px;
            background: lightgray;
          }

          &:hover {
            & > div {
              background: gray;
            }
          }
        `}
      >
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
