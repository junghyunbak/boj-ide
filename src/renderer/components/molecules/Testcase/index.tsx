import { useState } from 'react';

import { getElementFromChildren } from '@/renderer/utils';

import { TestcaseDelete } from './TestcaseDelete';
import { TestcaseData, TestcaseRow } from './index.style';
import { TextButton } from '../../atoms/buttons/TextButton';
import { TestcaseTitle } from './TestcaseTitle';
import { TestcaseContextProvider } from './TestcaseContext';
import { TestcaseElapsed } from './TestcaseElapsed';
import { TestcaseResult } from './TestcaseResult';
import { TestcaseDetail } from './TestcaseDetail';

const TestcaseDeleteType = (<TestcaseDelete idx={-1} />).type;
const TestcaseTitleType = (<TestcaseTitle num={-1} />).type;
const TestcaseElapsedType = (<TestcaseElapsed />).type;
const TestcaseResultType = (<TestcaseResult />).type;
const TestcaseDetailType = (<TestcaseDetail />).type;

interface TestcaseProps {
  judgeResult?: JudgeResult;
}

function TestcaseImpl({ children, judgeResult }: React.PropsWithChildren<TestcaseProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const DeleteButton = getElementFromChildren(children, TestcaseDeleteType);
  const Title = getElementFromChildren(children, TestcaseTitleType);
  const Elapsed = getElementFromChildren(children, TestcaseElapsedType);
  const Result = getElementFromChildren(children, TestcaseResultType);
  const Detail = getElementFromChildren(children, TestcaseDetailType);

  return (
    <TestcaseContextProvider value={{ judgeResult }}>
      <TestcaseRow>
        <TestcaseData>{Title}</TestcaseData>
        <TestcaseData>{Result}</TestcaseData>
        <TestcaseData>{Elapsed}</TestcaseData>
        <TestcaseData>
          <TextButton onClick={() => setIsOpen(!isOpen)}>{isOpen ? '닫기' : '열기'}</TextButton>
        </TestcaseData>
        <TestcaseData>{DeleteButton}</TestcaseData>
      </TestcaseRow>

      <TestcaseRow>{isOpen && Detail}</TestcaseRow>
    </TestcaseContextProvider>
  );
}

export const Testcase = Object.assign(TestcaseImpl, {
  TestcaseDelete,
  TestcaseTitle,
  TestcaseElapsed,
  TestcaseResult,
  TestcaseDetail,
});
