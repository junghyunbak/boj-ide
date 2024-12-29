import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { ExecuteResultText } from '@/renderer/components/molecules/ExecuteResultText';
import {
  ExecuteResultTable,
  ExecuteResultThead,
  ExecuteResultTheadRow,
  ExecuteResultHead,
  ExecuteResultTbody,
  ExecuteResultRow,
  ExecuteResultData,
} from '@/renderer/components/atoms/tables/ExecuteResultTable';
import {
  ProcessResultTable,
  ProcessResultTbody,
  ProcessResultRow,
  ProcessResultData,
} from '@/renderer/components/atoms/tables/ProcessResultTable';
import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { CodeBlock } from '@/renderer/components/atoms/pres/CodeBlock';
import { TextButton } from '@/renderer/components/atoms/buttons/TextButton';

export function ExecuteResultBoard() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [setIsJudging] = useStore(useShallow((s) => [s.setIsJudging]));
  const [judgeResults, setJudgeResults] = useStore(useShallow((s) => [s.judgeResult, s.setJudgeResult])); // [ ]: persist 때문에 참조 변수명만 변경
  const [customTestCase] = useStore(useShallow((s) => [s.customTestCase]));

  const N = !problem ? 0 : problem.testCase.inputs.length + (customTestCase[problem.number] || []).length;

  /**
   * 1. 문제 변경
   * 2. 테스트케이스 추가
   *
   * 의 경우 채점 결과를 초기화
   */
  useEffect(() => {
    setJudgeResults(() => []);
  }, [problem, customTestCase, setJudgeResults]);

  /**
   * 채점 결과를 수신하는 코드
   */
  useEffect(() => {
    window.electron.ipcRenderer.on('judge-result', ({ data }) => {
      setJudgeResults((prev) => {
        const next = [...prev];

        next[data.index] = data;

        return next;
      });
    });
  }, [setJudgeResults]);

  /**
   * 채점 결과가 도착할 때 마다,
   * 채점 결과 배열을 검사하여 채점이 종료되었는지를 판단
   */
  useEffect(() => {
    const isEnd = (() => {
      for (let i = 0; i < N; i += 1) {
        if (judgeResults[i] === undefined) {
          return false;
        }
      }

      return true;
    })();

    if (!isEnd) {
      return;
    }

    setIsJudging(false);
  }, [judgeResults, setIsJudging, N]);

  const testCases = ((): TC[] => {
    if (!problem) {
      return [];
    }

    const tmp: TC[] = [];

    for (let i = 0; i < problem.testCase.inputs.length; i += 1) {
      tmp.push({
        input: problem.testCase.inputs[i],
        output: problem.testCase.outputs[i],
        type: 'problem',
      });
    }

    tmp.push(...(customTestCase[problem.number] || []));

    return tmp;
  })();

  return (
    <ExecuteResultTable>
      <ExecuteResultThead>
        <ExecuteResultTheadRow>
          <ExecuteResultHead style={{ width: '25%' }}>예제</ExecuteResultHead>
          <ExecuteResultHead style={{ width: '25%' }}>결과</ExecuteResultHead>
          <ExecuteResultHead style={{ width: '17.3%' }}>시간</ExecuteResultHead>
          <ExecuteResultHead style={{ width: '17.3%' }}>상세</ExecuteResultHead>
          <ExecuteResultHead style={{ width: '17.3%' }}>삭제</ExecuteResultHead>
        </ExecuteResultTheadRow>
      </ExecuteResultThead>
      <ExecuteResultTbody>
        {testCases.map((testCase, i) => {
          const judgeResult = judgeResults[i];

          return <TestCase key={i} judgeResult={judgeResult} {...testCase} i={i} />;
        })}
      </ExecuteResultTbody>
    </ExecuteResultTable>
  );
}

interface TestCaseProps extends TC {
  judgeResult?: JudgeResult;
  i: number;
}

function TestCase({ input, output, judgeResult, type, i }: TestCaseProps) {
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

  if (!problem) {
    return null;
  }

  return (
    <>
      <ExecuteResultRow>
        <ExecuteResultData>
          <Text>
            {`${type === 'custom' ? '사용자' : ''} 예제 입력 ${i + 1 - (type === 'custom' ? problem.testCase.inputs.length : 0)}`}
          </Text>
        </ExecuteResultData>
        <ExecuteResultData>
          <Text type={status || '기본'} fontWeight="bold">
            {status}
          </Text>
        </ExecuteResultData>
        <ExecuteResultData>
          {judgeResult && (
            <Text>
              {judgeResult.elapsed}{' '}
              <span
                css={css`
                  color: #e74c3c;
                `}
              >
                ms
              </span>
            </Text>
          )}
        </ExecuteResultData>
        <ExecuteResultData>
          <TextButton onClick={handleFoldButtonClick}>{isOpen ? '접기' : '열기'}</TextButton>
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
                <ProcessResultTable>
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
                        {judgeResult.elapsed}{' '}
                        <span
                          css={css`
                            color: #e74c3c;
                          `}
                        >
                          ms
                        </span>
                      </ProcessResultData>
                    </ProcessResultRow>
                    <ProcessResultRow>
                      <ProcessResultData>출력</ProcessResultData>
                      <ProcessResultData>{judgeResult.stdout}</ProcessResultData>
                    </ProcessResultRow>
                    {judgeResult.stderr && (
                      <ProcessResultRow>
                        <ProcessResultData>에러</ProcessResultData>
                        <ProcessResultData>
                          <pre
                            css={css`
                              white-space: pre-wrap;
                              margin: 0;
                              font-size: 1rem;
                            `}
                          >
                            {judgeResult.stderr}
                          </pre>
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
