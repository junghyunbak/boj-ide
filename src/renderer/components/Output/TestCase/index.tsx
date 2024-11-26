import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '../../../store';
import { color } from '../../../../styles';
import {
  TestCaseButton,
  TestCaseData,
  TestCaseElapsedParagraph,
  TestCaseRow,
  TestCaseStatusParagraph,
} from './index.styles';
import { TestCaseDetail } from './TestCaseDetail';

interface TestCaseProps {
  problem: ProblemInfo;
  index: number;
  input: string;
  output: string;
  isJudging: boolean;
  judgeResult?: JudgeResult;
  type: TC['type'];
}

export function TestCase({ problem, isJudging, index, input, output, judgeResult, type }: TestCaseProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [removeCustomTestCase] = useStore(useShallow((s) => [s.removeCustomTestCase]));

  const handleFoldButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleRemoveButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    removeCustomTestCase(problem.number, index - problem.testCase.inputs.length);

    e.stopPropagation();
  };

  const resultColor = (() => {
    if (judgeResult) {
      switch (judgeResult.result) {
        case '런타임 에러':
          return color.error;
        case '맞았습니다!!':
          return color.correct;
        case '시간 초과':
        case '출력 초과':
          return color.over;
        case '틀렸습니다':
          return color.wrong;
        default:
          return color.text;
      }
    }

    if (isJudging) {
      return color.judging;
    }

    return color.text;
  })();

  const status = (() => {
    if (judgeResult) {
      return judgeResult.result;
    }

    if (isJudging) {
      return '채점 중';
    }

    return '';
  })();

  return (
    <>
      <TestCaseRow>
        <TestCaseData>
          {`${type === 'custom' ? '사용자' : ''} 예제 입력 ${index + 1 - (type === 'custom' ? problem.testCase.inputs.length : 0)}`}
        </TestCaseData>

        <TestCaseData>
          <TestCaseStatusParagraph resultColor={resultColor}>{status}</TestCaseStatusParagraph>
        </TestCaseData>

        <TestCaseData>
          {judgeResult && (
            <TestCaseElapsedParagraph>
              {judgeResult.elapsed} <span>ms</span>
            </TestCaseElapsedParagraph>
          )}
        </TestCaseData>

        <TestCaseData>
          <TestCaseButton type="button" onClick={handleFoldButtonClick}>
            {isOpen ? '접기' : '열기'}
          </TestCaseButton>
        </TestCaseData>

        <TestCaseData>
          {type === 'custom' && (
            <TestCaseButton type="button" onClick={handleRemoveButtonClick}>
              삭제
            </TestCaseButton>
          )}
        </TestCaseData>
      </TestCaseRow>

      <TestCaseRow>
        <TestCaseData colSpan={5}>
          <TestCaseDetail
            input={input}
            output={output}
            resultColor={resultColor}
            isOpen={isOpen}
            judgeResult={judgeResult}
          />
        </TestCaseData>
      </TestCaseRow>
    </>
  );
}
