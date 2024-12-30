import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { useEffect } from 'react';
import { css } from '@emotion/react';
import {
  ExecuteResultTable,
  ExecuteResultThead,
  ExecuteResultTheadRow,
  ExecuteResultHead,
  ExecuteResultTbody,
} from '@/renderer/components/atoms/tables/ExecuteResultTable';
import { TestCase } from '@/renderer/components/molecules/TestCase';
import { TestCaseMaker } from '@/renderer/components/molecules/TestCaseMaker';
import { useJudge } from '@/renderer/hooks/judge';

// <통합 테스트코드>

// 해당 컴포넌트의 역할: 채점 데이터를 상황에 맞게 가공하는 것.

// [ ]: [채점중이 아닐 때] 사용자 테스트케이스를 삭제
// [ ]: [채점중일 때] 사용자 테스트케이스를 삭제

// [ ]: [채점중이 아닐 때] 사용자 테스트케이스를 추가
// [ ]: [채점중일 때] 사용자 테스트케이스를 추가

// [ ]: [채점중이 아닐 때] 선택된 문제가 변경되면 기존 채점 결과를 삭제한다.
// [ ]: [채점중일 때] 선택된 문제가 변경되면 이전 문제의 채점 결과를 무시한다. (다시 돌아간다면?)

// [ ]: [채점중이 아닐 때] 결과 컬럼에 아무 텍스트도 없어야 한다.
// [ ]: [채점중일 때] 결과 컬럼에 '채점중' 텍스트가 나타나야 한다.
export function OutputContent() {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const { resetJudge, judgeResults, setJudgeResults, customTestCase } = useJudge();

  useEffect(() => {
    window.electron.ipcRenderer.on('judge-reset', () => {
      resetJudge();
    });
  }, [resetJudge]);

  useEffect(() => {
    resetJudge();
  }, [problem, customTestCase, resetJudge]);

  useEffect(() => {
    window.electron.ipcRenderer.on('judge-result', ({ data }) => {
      setJudgeResults((prev) => {
        const next = [...prev];

        next[data.index] = data;

        return next;
      });
    });
  }, [setJudgeResults]);

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
    <div
      css={css`
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        gap: 1rem;
      `}
    >
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
          {testCases.map((testCase, i) => (
            <TestCase key={i} judgeResult={judgeResults[i]} {...testCase} i={i} />
          ))}
        </ExecuteResultTbody>
      </ExecuteResultTable>
      <TestCaseMaker />
    </div>
  );
}
