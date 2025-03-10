import { useEffect } from 'react';

import { useModifyJudge } from '../useModifyJudge';
import { useProblem } from '../useProblem';
import { useTestcase } from '../useTestcase';

export function useSetupJudge() {
  const { customTestcases } = useTestcase();
  const { problem } = useProblem();

  const { resetJudge, updateJudgeIdentifier } = useModifyJudge();

  /**
   * - problem
   * - custom testcase
   *
   * 가 변경되면
   *
   * - 채점 결과 초기화
   * - 채점 식별자 업데이트
   */
  useEffect(() => {
    updateJudgeIdentifier();
    resetJudge();
  }, [problem, customTestcases, updateJudgeIdentifier, resetJudge]);
}
