import { useEffect, useRef } from 'react';

import { useJudge, useJudgeController, useProblem } from '@/renderer/hooks';

import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

// [ ]: 채점중일 경우 버튼이 비활성화되어야 한다.
// [ ]: 문제가 선택되어있지 않을 경우 버튼이 비활성화되어야 한다.
export function ExecuteCodeButton() {
  const { problem } = useProblem();
  const { isJudging } = useJudge();
  const { startJudge } = useJudgeController();

  const tourRef = useRef<HTMLButtonElement>(null);

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
    <>
      <ActionButton onClick={handleExecuteButtonClick} disabled={!problem || isJudging} ref={tourRef}>
        코드 실행
      </ActionButton>

      <TourOverlay title="알고리즘 실행" tourRef={tourRef} myTourStep={4} guideLoc="leftTop">
        <p>코드를 컴파일하고 실행합니다.</p>
        <br />
        <p>문제의 테스트케이스와 사용자가 추가한 테스트케이스가 모두 실행됩니다.</p>
        <br />
        <p>
          💡 <code>F5</code> 키로 실행이 가능합니다.
        </p>
      </TourOverlay>
    </>
  );
}
