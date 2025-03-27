import { css } from '@emotion/react';

import { size } from '@/common/constants';

import { ProblemHistory } from '@/renderer/components/molecules/ProblemHistory';

export function TitleBar() {
  return (
    <div
      css={(theme) => css`
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: ${size.TITLE_BAR_HEIGHT}px;
        background-color: ${theme.colors.tabBg};

        position: relative;

        -webkit-app-region: drag;
      `}
    >
      <ProblemHistory />
    </div>
  );
}
