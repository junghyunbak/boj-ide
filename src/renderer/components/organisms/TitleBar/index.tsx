import { css } from '@emotion/react';

import { size } from '@/common/constants';

import { ProblemHistory } from '@/renderer/components/molecules/ProblemHistory';

import { ReactComponent as Logo } from '@/renderer/assets/svgs/logo.svg';

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
      {window.electron.platform === 'win32' && (
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: space-between;

            width: 100%;
          `}
        >
          <div
            css={(theme) => css`
              display: flex;
              justify-content: center;
              align-items: center;
              color: ${theme.colors.fg};
              gap: 5px;

              padding-left: 10px;
            `}
          >
            <Logo width="12px" />
            <p
              css={css`
                font-size: 12px;
                font-family: menlo;
              `}
            >
              BOJ IDE
            </p>
          </div>
        </div>
      )}

      <ProblemHistory />
    </div>
  );
}
