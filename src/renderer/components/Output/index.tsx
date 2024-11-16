import { css } from '@emotion/css';

import { memo, useEffect } from 'react';

import { useShallow } from 'zustand/shallow';
import { useStore } from '../../store';

import { TestCase } from './TestCase';
import { TestCaseCreator } from './TestCaseCreater';

export const Output = memo(() => {
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
  }, [customTestCase]);

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

    for (let i = 0; i < problem.testCase.inputs.length; i++) {
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
    .reduce((a, c) => a + (c.result === '성공' ? 1 : 0), 0);

  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding: 0;
        margin: 0;
      `}
    >
      {problem &&
        testCases.map(({ input, output, type }, i) => {
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

      {isJudgeComplete && (
        <div className={css``}>
          <p
            className={css`
              margin: 1rem;
              color: ${judgeResult.length === correctCount ? 'green' : 'red'};
            `}
          >
            {`${judgeResult.length}개 중 ${correctCount}개 성공`}
          </p>
        </div>
      )}

      {problem && <TestCaseCreator problemNumber={problem.number} />}
    </div>
  );
});
