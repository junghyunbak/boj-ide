import { css } from '@emotion/react';

interface StaleBallProps extends React.HTMLAttributes<HTMLDivElement> {}

export function StaleBall(props: StaleBallProps) {
  return (
    <div
      css={(theme) => css`
        width: 8px;
        aspect-ratio: 1/1;
        border-radius: 9999px;
        background-color: ${theme.colors.fg};
      `}
      {...props}
    />
  );
}
