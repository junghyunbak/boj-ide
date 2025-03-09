import { useEffect } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useTestcase } from '../useTestcase';
import { useJudgeController } from '../useJudgeController';
import { useEventIpc } from '../useEventIpc';

export function useJudgeEvent() {
  const [setJudgeResults] = useStore(useShallow((s) => [s.setJudgeResult]));
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const { customTestcases } = useTestcase();

  const { resetJudge, updateJudgeIdentifier } = useJudgeController();

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

  /**
   * 채점 결과 수신 이벤트 등록
   */
  useEventIpc(
    ({ data }) => {
      const { judgeId } = useStore.getState();

      if (data.id !== judgeId) {
        return;
      }

      setJudgeResults((prev) => {
        const next = [...prev];

        next[data.index] = data;

        return next;
      });
    },
    [setJudgeResults],
    'judge-result',
  );

  /**
   * 채점 결과 리셋 이벤트 등록
   */
  useEventIpc(
    () => {
      resetJudge();
    },
    [resetJudge],
    'judge-reset',
  );
}
