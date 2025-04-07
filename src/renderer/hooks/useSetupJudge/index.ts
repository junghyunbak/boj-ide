import { useEffect } from 'react';

import { useModifyJudge } from '../useModifyJudge';
import { useProblem } from '../useProblem';
import { useTestcase } from '../useTestcase';
import { useLanguage } from '../useLanguage';

export function useSetupJudge() {
  const { customTestcases } = useTestcase();
  const { problem } = useProblem();
  const { language } = useLanguage();

  const { resetJudge, updateJudgeIdentifier } = useModifyJudge();

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('stop-judge', { data: undefined });
    updateJudgeIdentifier();
    resetJudge();
  }, [problem, customTestcases, language, updateJudgeIdentifier, resetJudge]);
}
