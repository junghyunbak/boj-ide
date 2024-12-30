import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { useEffect } from 'react';
import {
  ExecuteResultTable,
  ExecuteResultThead,
  ExecuteResultTheadRow,
  ExecuteResultHead,
  ExecuteResultTbody,
} from '@/renderer/components/atoms/tables/ExecuteResultTable';
import { TestCase } from '@/renderer/components/molecules/TestCase';

// 테스트 코드 작성
// [ ]: 채점 중 테스트케이스가 추가되면 '채점 중' 상태를 false로 설정한다.
// [ ]: 존재하는 테스트케이스가 모두 채점이 완료되면 '채점 중' 상태를 false로 설정한다.
export function OutputContent() {
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
    /**
     * 에러는 해결되었지만, 채점 중에 추가된 테스트케이스의 결과는 나타나지 않는 문제가 있다.
     */
    setIsJudging(false);
  }, [problem, customTestCase, setJudgeResults, setIsJudging]);

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
        {testCases.map((testCase, i) => (
          <TestCase key={i} judgeResult={judgeResults[i]} {...testCase} i={i} />
        ))}
      </ExecuteResultTbody>
    </ExecuteResultTable>
  );
}
