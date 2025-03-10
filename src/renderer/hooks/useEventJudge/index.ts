import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyJudge } from '../useModifyJudge';
import { useEventIpc } from '../useEventIpc';

export function useEventJudge() {
  const [setJudgeResults] = useStore(useShallow((s) => [s.setJudgeResult]));

  const { resetJudge } = useModifyJudge();

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
