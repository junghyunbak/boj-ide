import { css } from '@emotion/react';
import { OutputHeader } from '@/renderer/components/organisms/OutputHeader';
import { RowLine } from '@/renderer/components/atoms/lines/RowLIne';
import { OutputContent } from '@/renderer/components/organisms/OutputContent';

export function Output() {
  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: white;
      `}
    >
      <OutputHeader />
      <RowLine />
      <div
        css={css`
          flex: 1;
          overflow-y: scroll;
        `}
      >
        <OutputContent />
      </div>
    </div>
  );
}
