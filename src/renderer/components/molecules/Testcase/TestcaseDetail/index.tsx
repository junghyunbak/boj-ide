import { css } from '@emotion/react';

import { getElementFromChildren } from '@/renderer/utils';

import { TestcaseDetailResult } from './TestcaseDetailResult';
import { TestcaseDetailExampleInput, TestcaseDetailExampleOuptut } from './TestcaseDetailExample';

const TestcaseDetailExampleInputType = (<TestcaseDetailExampleInput initValue="" />).type;
const TestcaseDetailExampleOutputType = (<TestcaseDetailExampleOuptut initValue="" />).type;
const TestcaseDetailResultType = (<TestcaseDetailResult />).type;

export function TestcaseDetailImpl({ children }: React.PropsWithChildren) {
  const DetailResult = getElementFromChildren(children, TestcaseDetailResultType);
  const ExampleInput = getElementFromChildren(children, TestcaseDetailExampleInputType);
  const ExampleOutput = getElementFromChildren(children, TestcaseDetailExampleOutputType);

  return (
    <td colSpan={5}>
      <div
        css={(theme) => css`
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.5rem;
          border-top: 1px solid ${theme.colors.border};
        `}
      >
        <div
          css={css`
            width: 100%;
            display: flex;
            gap: 0.5rem;
          `}
        >
          {ExampleInput}
          {ExampleOutput}
        </div>

        {DetailResult}
      </div>
    </td>
  );
}

export const TestcaseDetail = Object.assign(TestcaseDetailImpl, {
  TestcaseDetailExampleInput,
  TestcaseDetailExampleOuptut,
  TestcaseDetailResult,
});
