import { useEffect } from 'react';

import { useJudge, useProblem } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

// [ ]: 채점중일 경우 버튼이 비활성화되어야 한다.
// [ ]: 문제가 선택되어있지 않을 경우 버튼이 비활성화되어야 한다.
export function ExecuteCodeButton() {
  const { problem } = useProblem();
  const { isJudging, startJudge } = useJudge();

  useEffect(() => {
    window.electron.ipcRenderer.on('judge-request', () => {
      if (!isJudging) {
        startJudge();
      }
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('judge-request');
    };
  }, [isJudging, startJudge]);

  const handleExecuteButtonClick = () => {
    startJudge();
  };

  return (
    <ActionButton onClick={handleExecuteButtonClick} disabled={!problem || isJudging}>
      코드 실행
    </ActionButton>
  );
}
