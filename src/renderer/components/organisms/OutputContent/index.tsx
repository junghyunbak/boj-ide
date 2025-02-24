import { css } from '@emotion/react';

import { useJudge, useJudgeEvent } from '@/renderer/hooks';

import {
  ExecuteResultTable,
  ExecuteResultThead,
  ExecuteResultTheadRow,
  ExecuteResultHead,
  ExecuteResultTbody,
} from '@/renderer/components/atoms/tables/ExecuteResultTable';
import { TestCase } from '@/renderer/components/molecules/TestCase';
import { TestCaseMaker } from '@/renderer/components/molecules/TestCaseMaker';

// <통합 테스트>
// [ ]: [채점중이 아닐 때] 사용자 테스트케이스를 추가하면 기존 채점 결과를 삭제한다.
// [ ]: [채점중이 아닐 때] 사용자 테스트케이스를 삭제하면 기존 채점 결과를 삭제한다.
// [ ]: [채점중이 아닐 때] 선택된 문제가 변경되면 기존 채점 결과를 삭제한다.
// [ ]: [채점중이 아닐 때] 결과 컬럼에 아무 텍스트도 없어야 한다.
// [ ]: [채점중일 때] 사용자 테스트케이스를 추가하면 기존 채점 결과를 삭제하고, 진행중인 채점 결과를 무시한다.
// [ ]: [채점중일 때] 사용자 테스트케이스를 삭제하면 기존 채점 결과를 삭제하고, 진행중인 채점 결과를 무시한다.
// [ ]: [채점중일 때] 선택된 문제를 변경하면 기존 채점 결과를 삭제하고, 진행중인 채점 결과를 무시한다.
// [ ]: [채점중일 때] '결과' 컬럼에 '채점중' 텍스트가 나타나야 한다.
export function OutputContent() {
  const { judgeResults, allTestcase } = useJudge();

  useJudgeEvent();

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
          {allTestcase.map((testcase, i) => (
            <TestCase key={i} judgeResult={judgeResults[i]} {...testcase} i={i} />
          ))}
        </ExecuteResultTbody>
      </ExecuteResultTable>
      <TestCaseMaker />
    </div>
  );
}
