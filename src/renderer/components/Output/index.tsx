import { useContext, useEffect, useState } from 'react';

import { codeContext, judgeContext, problemContext } from '../../App';

type TestCase = {
  input: string;
  output: string;
};

export function Output() {
  const problemData = useContext(problemContext);

  const codeData = useContext(codeContext);

  const { isJudging, setIsJudging } = useContext(judgeContext) || {};

  const n = (() => {
    if (!problemData) {
      return 0;
    }

    return problemData.testCase.inputs.length;
  })();

  const [judgeResult, setJudgeResult] = useState<(Omit<JudgeResult, 'index'> | null)[]>(Array(n).fill(null));

  useEffect(() => {
    window.electron.ipcRenderer.on('judge-result', ({ data }) => {
      const { index, ...other } = data;

      setJudgeResult((prev) => {
        const next = [...prev];

        next[index] = other;

        return next;
      });
    });
  }, []);

  /**
   * 채점이 시작될 때(isJudging === true) electron으로 채점 시작 메세지를 보내도록 함
   */
  useEffect(() => {
    if (isJudging) {
      // [ ]: judge result가 빈 배열로 초기화도기 전에 judge-result가 돌아오는 경우에 대한 대비 필요 (동기화 작업)
      setJudgeResult(Array(n).fill(null));

      // [ ]: undefind값 갖지 않도록 할 것
      window.electron.ipcRenderer.sendMessage('judge-start', {
        data: {
          code: codeData?.code || '',
          ext: codeData?.ext || 'js',
        },
      });
    }
  }, [isJudging, setJudgeResult, n, codeData?.code, codeData?.ext]);

  /**
   * 채점 결과가 도착할 때 마다, 채점 결과 배열을 검사하여 채점이 종료되었는지를 판단
   */
  useEffect(() => {
    // [ ]: judge result가 빈 배열로 초기화도기 전에 judge-result가 돌아오는 경우에 대한 대비 필요 (동기화 작업)
    if (!setIsJudging) {
      return;
    }

    if (judgeResult.every((v) => v !== null)) {
      setIsJudging(false);
    }
  }, [judgeResult, setIsJudging]);

  const testCases = ((): TestCase[] => {
    const ret: TestCase[] = [];

    if (!problemData) {
      return ret;
    }

    for (let i = 0; i < n; i += 1) {
      ret.push({
        input: problemData.testCase.inputs[i],
        output: problemData.testCase.outputs[i],
      });
    }

    return ret;
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
}
