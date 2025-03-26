import { css } from '@emotion/react';

import { ProblemHistory } from '@/renderer/components/molecules/ProblemHistory';

export function TitleBar() {
  return (
    <div
      css={(theme) => css`
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: 28px;
        background-color: ${theme.colors.tabBg};

        -webkit-app-region: drag;
      `}
    >
      <ProblemHistory />
    </div>
  );
}
