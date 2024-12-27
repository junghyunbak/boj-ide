import { css } from '@emotion/react';
import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { color } from '@/styles';
import { TestCase } from './TestCase';
import { TestCaseCreator } from './TestCaseCreater';
import { ExecuteCodeButton } from '../Header/ExecuteCodeButton';

export function Output() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [isJudging, setIsJudging] = useStore(useShallow((s) => [s.isJudging, s.setIsJudging]));
  const [judgeResult, setJudgeResult] = useStore(useShallow((s) => [s.judgeResult, s.setJudgeResult]));
  const [customTestCase] = useStore(useShallow((s) => [s.customTestCase]));

  const N = (() => {
    if (!problem) {
      return 0;
    }

    return problem.testCase.inputs.length + (customTestCase[problem.number] || []).length;
  })();

  useEffect(() => {
    setJudgeResult(() => []);
  }, [problem, customTestCase, setJudgeResult]);

  /**
   * 채점 결과가 도착하는 ipc 이벤트 리스너 초기화
   */
  useEffect(() => {
    window.electron.ipcRenderer.on('judge-result', ({ data }) => {
      setJudgeResult((prev) => {
        const next = [...prev];

        next[data.index] = data;

        return next;
      });
    });
  }, [setJudgeResult]);

  /**
   * 채점 결과가 도착할 때 마다, 채점 결과 배열을 검사하여 채점이 종료되었는지를 판단
   */
  useEffect(() => {
    const isEnd = (() => {
      for (let i = 0; i < N; i += 1) {
        if (judgeResult[i] === undefined) {
          return false;
        }
      }

      return true;
    })();

    if (!isEnd) {
      return;
    }

    setIsJudging(false);
  }, [judgeResult, setIsJudging, N]);

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

  const isJudgeComplete = !isJudging && judgeResult.length > 0 && judgeResult.every((v) => v !== undefined);

  const correctCount = judgeResult
    .filter((v) => v !== undefined)
    .reduce((a, c) => a + (c.result === '맞았습니다!!' ? 1 : 0), 0);

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          width: 100%;
          border-bottom: 1px solid lightgray;
          padding: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <div
          css={css`
            padding-left: 0.5rem;
            display: flex;
            gap: 0.5rem;
          `}
        >
          <p
            css={css`
              margin: 0;
              font-size: 0.875rem;
              color: #333;
            `}
          >
            실행 결과
          </p>
          {isJudgeComplete && (
            <p
              css={css`
                margin: 0;
                color: ${judgeResult.length === correctCount ? color.correct : color.wrong};
                font-weight: bold;
                font-size: 0.875rem;
              `}
            >
              {`${judgeResult.length}개 중 ${correctCount}개 성공`}
            </p>
          )}
        </div>
        <ExecuteCodeButton />
      </div>

      <div
        css={css`
          flex: 1;
          overflow-y: scroll;
          padding: 0;
          margin: 0;
        `}
      >
        <div
          css={css`
            padding: 1rem;
            padding-bottom: 0;
            width: 100%;
          `}
        >
          {problem && (
            <table
              css={css`
                width: 100%;
                border: 1px solid #ddd;
                border-collapse: collapse;
                font-size: 0.875rem;
                color: ${color.text};
                table-layout: fixed;

                th {
                  text-align: start;
                  border-left: 1px solid #ddd;
                  border-right: 1px solid #ddd;
                  padding: 0.5rem;
                }
              `}
            >
              <thead>
                <tr>
                  <th style={{ width: '25%' }}>예제</th>
                  <th style={{ width: '25%' }}>결과</th>
                  <th style={{ width: '17.3%' }}>시간</th>
                  <th style={{ width: '17.3%' }}>상세</th>
                  <th style={{ width: '17.3%' }}>삭제</th>
                </tr>
              </thead>
              <tbody>
                {testCases.map(({ input, output, type }, i) => {
                  return (
                    <TestCase
                      key={i}
                      index={i}
                      input={input}
                      output={output}
                      isJudging={isJudging}
                      judgeResult={judgeResult[i]}
                      type={type}
                      problem={problem}
                    />
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {problem && <TestCaseCreator problemNumber={problem.number} />}
      </div>
    </div>
  );
}
