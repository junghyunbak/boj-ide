import { css } from '@emotion/react';

export function ThreeLineHorizontalResizer() {
  return (
    <div
      css={(theme) => css`
        width: 100%;

        background-color: ${theme.colors.bg};

        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 0.1rem;

        padding: 0.2rem 0;

        cursor: row-resize;

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
  );
}
