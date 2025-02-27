import { css } from '@emotion/react';

import { RowLine } from '@/renderer/components/atoms/lines/RowLIne';
import { OutputHeader } from '@/renderer/components/organisms/OutputHeader';
import { OutputContent } from '@/renderer/components/organisms/OutputContent';

export function Output() {
  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <OutputHeader />
      <RowLine />
      <div
        css={(theme) => css`
          flex: 1;
          overflow-y: scroll;

          &::-webkit-scrollbar {
            width: 7px;
          }

          &::-webkit-scrollbar-thumb {
            background: ${theme.colors.scrollbar};
          }
        `}
      >
        <OutputContent />
      </div>
    </div>
  );
}
