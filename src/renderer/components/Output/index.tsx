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
    <ul
      style={{
        flex: 1,
        overflowY: 'scroll',
        overflowX: 'hidden',
        margin: 0,
      }}
    >
      {testCases.map(({ input, output }, i) => {
        return (
          <li key={i} style={{ color: 'black' }}>
            <p>예제{i + 1}</p>
            <div style={{ display: 'flex' }}>
              <pre
                style={{
                  border: '1px solid black',
                  width: '50%',
                  padding: '8px',
                }}
              >
                {input}
              </pre>
              <pre
                style={{
                  border: '1px solid black',
                  width: '50%',
                  padding: '8px',
                }}
              >
                {output}
              </pre>
            </div>

            <div>
              <p>
                결과:{' '}
                {!judgeResult[i] && !isJudging
                  ? ''
                  : !judgeResult[i]
                    ? '채점중...'
                    : `${judgeResult[i].result} (${judgeResult[i].elapsed}ms)`}
              </p>
              {judgeResult[i] && (
                <div>
                  <p>표준 출력</p>
                  <pre>{judgeResult[i].stdout}</pre>
                </div>
              )}
              {judgeResult[i] && (
                <div>
                  <p>에러</p>
                  <pre>{judgeResult[i].stderr}</pre>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
});
