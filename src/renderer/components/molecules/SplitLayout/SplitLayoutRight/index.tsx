import { css } from '@emotion/react';

type RightProps = {};

export function Right({ children }: React.PropsWithChildren<RightProps>) {
  return (
    <div
      css={css`
        flex: 1;
        overflow: hidden;
      `}
    >
      {children}
    </div>
  );
}
