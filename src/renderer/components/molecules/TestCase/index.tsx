import { useState } from 'react';

import { css } from '@emotion/react';

import { useJudge, useProblem, useTestcase } from '@/renderer/hooks';

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

import {
  ExampleContentLayout,
  ExampleContentTitleContentLayout,
  ExampleContentTitleLayout,
  ExampleLayout,
  ExecuteResultContentBox,
} from './index.style';

interface TestCaseProps extends TC {
  judgeResult?: JudgeResult;
  i: number;
}

// [v]: [type === 'problem'] 예제 컬럼의 값이 "예제 입력 [숫자]" 이어야 한다.
// [v]: [type === 'problem'] 삭제 버튼이 존재하지 않아야 한다.
// [v]: [type === 'custom'] 예제 컬럼의 값이 "사용자 예제 입력 [숫자]" 이어야 한다.
// [v]: [type === 'custom'] 삭제 버튼이 존재해야한다.
// [v]: [type === 'common'] 열기 버튼을 누르면 예제 입/출력이 나타난다.
// [v]: [type === 'common'] 열기 버튼을 누르고 채점 결과가 존재할 경우, 실행 결과를 표시하는 테이블이 렌더링 되어야한다.
// [v]: [type === 'common'] 결과 '컴파일 에러'인 경우 시간이 출력되지 않아야 한다.
export function TestCase({ input, output, judgeResult, type, i }: TestCaseProps) {
  const { problem } = useProblem();
  const { isJudging } = useJudge();
  const { removeCustomTestcase } = useTestcase();

  const [isOpen, setIsOpen] = useState(false);

  const handleFoldButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleRemoveButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!problem) {
      return;
    }

    removeCustomTestcase(i - problem.testCase.inputs.length);

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

  const exampleText = (() => {
    if (!problem) {
      return '';
    }

    const exampleNumber = i + 1 - (type === 'problem' ? 0 : problem.testCase.inputs.length);
    const examplePrefix = type === 'custom' ? '사용자 ' : '';

    return `${examplePrefix}테스트케이스 ${exampleNumber}`;
  })();

  const fontWeight: React.CSSProperties['fontWeight'] = (() => {
    switch (status) {
      case '맞았습니다!!':
        return 'bold';
      case '런타임 에러':
      case '시간 초과':
      case '출력 초과':
      case '틀렸습니다':
      case '채점 중':
      case '컴파일 에러':
      default:
        return 'normal';
    }
  })();

  const showElapsed: boolean = (() => {
    switch (status) {
      case '맞았습니다!!':
        return true;
      case '런타임 에러':
      case '시간 초과':
      case '출력 초과':
      case '틀렸습니다':
      case '채점 중':
      case '컴파일 에러':
      default:
        return false;
    }
  })();

  if (!problem) {
    return null;
  }

  return (
    <>
      <ExecuteResultRow>
        <ExecuteResultData>
          <Text>{exampleText}</Text>
        </ExecuteResultData>
        <ExecuteResultData>
          <Text type={status || '기본'} fontWeight={fontWeight}>
            {status}
          </Text>
        </ExecuteResultData>
        <ExecuteResultData>
          {judgeResult && showElapsed && (
            <Text>
              {judgeResult.elapsed} <Highlight>ms</Highlight>
            </Text>
          )}
        </ExecuteResultData>
        <ExecuteResultData>
          <TextButton onClick={handleFoldButtonClick}>{isOpen ? '접기' : '열기'}</TextButton>
        </ExecuteResultData>
        <ExecuteResultData>
          {type === 'custom' && (
            <TextButton onClick={handleRemoveButtonClick} testId="remove-testcase">
              삭제
            </TextButton>
          )}
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
            <ExecuteResultContentBox>
              <ExampleLayout>
                <ExampleContentLayout>
                  <ExampleContentTitleLayout>
                    <ExampleContentTitleContentLayout>
                      <Text fontSize="1.25rem">예제 입력</Text>
                      <TextButton onClick={() => navigator.clipboard.writeText(input)}>복사</TextButton>
                    </ExampleContentTitleContentLayout>
                  </ExampleContentTitleLayout>
                  <CodeBlock>{input}</CodeBlock>
                </ExampleContentLayout>

                <ExampleContentLayout>
                  <ExampleContentTitleLayout>
                    <ExampleContentTitleContentLayout>
                      <Text fontSize="1.25rem">예제 출력</Text>
                      <TextButton onClick={() => navigator.clipboard.writeText(output)}>복사</TextButton>
                    </ExampleContentTitleContentLayout>
                  </ExampleContentTitleLayout>
                  <CodeBlock>{output}</CodeBlock>
                </ExampleContentLayout>
              </ExampleLayout>

              {judgeResult && (
                <ProcessResultTable data-testid="result-table">
                  <ProcessResultTbody>
                    <ProcessResultRow>
                      <ProcessResultData>결과</ProcessResultData>
                      <ProcessResultData>
                        <Text type={judgeResult.result} fontWeight={fontWeight}>
                          {judgeResult.result}
                        </Text>
                      </ProcessResultData>
                    </ProcessResultRow>
                    <ProcessResultRow>
                      <ProcessResultData>실행 시간</ProcessResultData>
                      <ProcessResultData>
                        {showElapsed && (
                          <>
                            {judgeResult.elapsed} <Highlight>ms</Highlight>
                          </>
                        )}
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
            </ExecuteResultContentBox>
          </ExecuteResultData>
        )}
      </ExecuteResultRow>
    </>
  );
}
