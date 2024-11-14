import { css } from '@emotion/css';

import { memo, useEffect } from 'react';

import { useShallow } from 'zustand/shallow';

import { useStore } from '../../store';

type TestCase = {
  input: string;
  output: string;
};

export const Output = memo(() => {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const [isJudging, setIsJudging] = useStore(useShallow((s) => [s.isJudging, s.setIsJudging]));

  const [judgeResult, setJudgeResult] = useStore(useShallow((s) => [s.judgeResult, s.setJudgeResult]));

  const N = (() => {
    if (!problem) {
      return 0;
    }

    return problem.testCase.inputs.length;
  })();

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

  const testCases = ((): TestCase[] => {
    if (!problem) {
      return [];
    }

    const tmp: TestCase[] = [];

    for (let i = 0; i < N; i += 1) {
      tmp.push({
        input: problem.testCase.inputs[i],
        output: problem.testCase.outputs[i],
      });
    }

    return tmp;
  })();

  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        overflow: hidden;
      `}
    >
      <ul
        className={css`
          width: 100%;
          height: 100%;
          overflow-y: scroll;
          padding: 0;
          margin: 0;
        `}
      >
        {testCases.map(({ input, output }, i, arr) => {
          return (
            <div key={i}>
              <li
                className={css`
                  padding: 1rem;

                  p {
                    margin: 0;
                  }
                `}
              >
                <p className={css``}>예제 입력 {i + 1}</p>

                <div
                  className={css`
                    display: flex;
                    gap: 0.5rem;

                    pre {
                      background-color: #f7f7f9;

                      border: 1px solid lightgray;
                    }
                  `}
                >
                  <pre
                    style={{
                      width: '50%',
                      padding: '8px',
                    }}
                  >
                    {input}
                  </pre>
                  <pre
                    style={{
                      width: '50%',
                      padding: '8px',
                    }}
                  >
                    {output}
                  </pre>
                </div>

                {isJudging && !judgeResult[i] && <p>채점중...</p>}

                {judgeResult[i] && (
                  <table
                    className={css`
                      tr {
                        td:first-of-type {
                          white-space: nowrap;
                          text-align: right;
                          vertical-align: top;

                          color: gray;

                          &::after {
                            content: '>';
                            padding: 0 0.5rem;
                          }
                        }
                      }

                      pre {
                        margin: 0;
                        font-size: 1rem;
                        white-space: pre-wrap;
                      }
                    `}
                  >
                    <tbody>
                      <tr>
                        <td>결과</td>

                        <td
                          className={css`
                            color: ${judgeResult[i]?.result === '성공' ? 'green' : 'red'};
                          `}
                        >
                          {judgeResult[i]?.result}
                        </td>
                      </tr>

                      <tr>
                        <td>실행 시간</td>
                        <td>{`${judgeResult[i]?.elapsed}ms`}</td>
                      </tr>

                      <tr>
                        <td>출력</td>

                        <td>
                          <pre>{judgeResult[i]?.stdout}</pre>
                        </td>
                      </tr>

                      {judgeResult[i]?.stderr && (
                        <tr>
                          <td>에러</td>

                          <td>
                            <pre>{judgeResult[i].stderr}</pre>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </li>

              {i !== arr.length - 1 && (
                <div
                  className={css`
                    border-bottom: 1px solid lightgray;
                  `}
                />
              )}
            </div>
          );
        })}
      </ul>
    </div>
  );
});
