import { css } from '@emotion/react';
import { OutputHeader } from '@/renderer/components/organisms/OutputHeader';
import { ExecuteResultBoard } from '@/renderer/components/molecules/ExecuteResultBoard';
import { TestCaseMaker } from '@/renderer/components/molecules/TestCaseMaker';
import { RowLine } from '@/renderer/components/atoms/lines/RowLIne';

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
          padding: 1rem;
          flex: 1;
          overflow-y: scroll;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `}
      >
        <ExecuteResultBoard />
        <TestCaseMaker />
      </div>
    </div>
  );
}
