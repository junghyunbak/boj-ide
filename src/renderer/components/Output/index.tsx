import { useContext, useEffect, useState } from 'react';

import { codeContext, judgeContext, problemContext } from '../../App';

type Example = {
  input: string;
  output: string;
};

type Result = {
  result: string;
  error: string;
  elapsed: number;
  output: string;
};

interface OutputProps {}

export function Output({}: OutputProps) {
  const problemData = useContext(problemContext);

  const codeData = useContext(codeContext);

  const n = (() => {
    if (!problemData) {
      return 0;
    }

    return problemData.inputs.length;
  })();

  const { isJudging, setIsJudging } = useContext(judgeContext) || {};

  const [judgeResult, setJudgeResult] = useState<(Result | null)[]>(
    Array(n).fill(null),
  );

  console.log(judgeResult);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'judge-result',
      (i, result, error, output, elapsed) => {
        setJudgeResult((prev) => {
          const next = [...prev];

          next[i] = { result, error, output, elapsed };

          return next;
        });
      },
    );
  }, []);

  useEffect(() => {
    if (isJudging) {
      // [ ]: judge result가 빈 배열로 초기화도기 전에 judge-result가 돌아오는 경우에 대한 대비 필요 (동기화 작업)
      setJudgeResult(Array(n).fill(null));

      window.electron.ipcRenderer.sendMessage(
        'judge-start',
        codeData?.code || '',
        'js',
      );
    }
  }, [isJudging, setJudgeResult, n]);

  useEffect(() => {
    // [ ]: 초기값 null이 아니도록 하여 제거할 로직
    if (!setIsJudging) {
      return;
    }

    if (judgeResult.every((v) => v !== null)) {
      setIsJudging(false);
    }
  }, [judgeResult, setIsJudging]);

  const examples = ((): Example[] => {
    const ret: Example[] = [];

    if (!problemData) {
      return ret;
    }

    for (let i = 0; i < n; i += 1) {
      ret.push({
        input: problemData.inputs[i],
        output: problemData.outputs[i],
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
      {examples.map(({ input, output }, i) => {
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
                  <pre>{judgeResult[i].output}</pre>
                </div>
              )}
              {judgeResult[i] && (
                <div>
                  <p>에러</p>
                  <pre>{judgeResult[i].error}</pre>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
