import { useState } from 'react';
import { css } from '@emotion/react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { ExecuteResultRow, ExecuteResultData } from '@/renderer/components/atoms/tables/ExecuteResultTable';
import {
  ProcessResultTable,
  ProcessResultTbody,
  ProcessResultRow,
  ProcessResultData,
} from '@/renderer/components/atoms/tables/ProcessResultTable';
import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { CodeBlock } from '@/renderer/components/atoms/pres/CodeBlock';
import { TextButton } from '@/renderer/components/atoms/buttons/TextButton';
import { Highlight } from '@/renderer/components/atoms/spans/Highlight';
import { TransparentPreformatted } from '@/renderer/components/atoms/pres/TransparentPreformatted';

interface TestCaseProps extends TC {
  judgeResult?: JudgeResult;
  i: number;
}

// 테스트케이스
// [ ]: type === 'problem' 접기/열기 버튼을 누르면 예제 입력/출력이 나타난다.
// [ ]: type === 'problem' 삭제 버튼이 존재하지 않아야 한다.
// [ ]: type === 'custom' 삭제 버튼이 존재해야한다.
// [ ]: type === 'custom' 삭제 버튼을 누를 경우 테스트케이스 목록에서 사라져야한다.
// [ ]: judgeResult가 존재할 경우 실행 결과를 표시하는 테이블이 렌더링 되어야한다.
export function TestCase({ input, output, judgeResult, type, i }: TestCaseProps) {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [isJudging] = useStore(useShallow((s) => [s.isJudging]));
  const [removeCustomTestCase] = useStore(useShallow((s) => [s.removeCustomTestCase]));

  const [isOpen, setIsOpen] = useState(false);

  const handleFoldButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleRemoveButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!problem) {
      return;
    }

    removeCustomTestCase(problem.number, i - problem.testCase.inputs.length);

    e.stopPropagation();
  };

  const status = (() => {
    if (judgeResult) {
      return judgeResult.result;
    }

    if (isJudging) {
      return '채점 중';
    }

    return '';
  })();

  const testcaseNumber = (() => {
    if (!problem) {
      return -1;
    }

    const number = i + 1;

    if (type === 'problem') {
      return number;
    }

    return number - problem.testCase.inputs.length;
  })();

  if (!problem) {
    return null;
  }

  return (
    <>
      <ExecuteResultRow>
        <ExecuteResultData>
          <Text>{testcaseNumber}</Text>
        </ExecuteResultData>
        <ExecuteResultData>
          <Text type={status || '기본'} fontWeight="bold">
            {status}
          </Text>
        </ExecuteResultData>
        <ExecuteResultData>
          {judgeResult && (
            <Text>
              {judgeResult.elapsed} <Highlight>ms</Highlight>
            </Text>
          )}
        </ExecuteResultData>
        <ExecuteResultData>
          <TextButton data-testid="toggle-button" onClick={handleFoldButtonClick}>
            {isOpen ? '접기' : '열기'}
          </TextButton>
        </ExecuteResultData>
        <ExecuteResultData>
          {type === 'custom' && <TextButton onClick={handleRemoveButtonClick}>삭제</TextButton>}
        </ExecuteResultData>
      </ExecuteResultRow>

      <ExecuteResultRow>
        {isOpen && (
          <ExecuteResultData
            colSpan={5}
            css={css`
              padding: 0.5rem;
            `}
          >
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                padding: 0.5rem;
                border-top: 1px solid #ddd;
              `}
            >
              <div
                css={css`
                  width: 100%;
                  display: flex;
                  gap: 0.5rem;
                `}
              >
                <CodeBlock>{input}</CodeBlock>
                <CodeBlock>{output}</CodeBlock>
              </div>

              {judgeResult && (
                <ProcessResultTable data-testid="result-table">
                  <ProcessResultTbody>
                    <ProcessResultRow>
                      <ProcessResultData>결과</ProcessResultData>
                      <ProcessResultData>
                        <Text fontWeight="bold" type={judgeResult.result}>
                          {judgeResult.result}
                        </Text>
                      </ProcessResultData>
                    </ProcessResultRow>
                    <ProcessResultRow>
                      <ProcessResultData>실행 시간</ProcessResultData>
                      <ProcessResultData>
                        {judgeResult.elapsed} <Highlight>ms</Highlight>
                      </ProcessResultData>
                    </ProcessResultRow>
                    <ProcessResultRow>
                      <ProcessResultData>출력</ProcessResultData>
                      <ProcessResultData>
                        <TransparentPreformatted>{judgeResult.stdout}</TransparentPreformatted>
                      </ProcessResultData>
                    </ProcessResultRow>
                    {judgeResult.stderr && (
                      <ProcessResultRow>
                        <ProcessResultData>에러</ProcessResultData>
                        <ProcessResultData>
                          <TransparentPreformatted>{judgeResult.stderr}</TransparentPreformatted>
                        </ProcessResultData>
                      </ProcessResultRow>
                    )}
                  </ProcessResultTbody>
                </ProcessResultTable>
              )}
            </div>
          </ExecuteResultData>
        )}
      </ExecuteResultRow>
    </>
  );
}
