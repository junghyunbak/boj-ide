import { useCallback, useRef } from 'react';

import { useJudge, useLanguage, useModifyEditor, useModifyJudge, useProblem, useTestcase } from '@/renderer/hooks';

import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

export function ExecuteCodeButton() {
  const tourRef = useRef<HTMLButtonElement>(null);

  const { problem } = useProblem();
  const { isJudging, judgeId } = useJudge();
  const { language } = useLanguage();
  const { allTestcase } = useTestcase();

  const { startJudge } = useModifyJudge();
  const { saveCode } = useModifyEditor();

  const handleExecuteButtonClick = useCallback(() => {
    (async () => {
      await saveCode(problem, language);
      startJudge(problem, language, allTestcase, judgeId);
    })();
  }, [saveCode, startJudge, allTestcase, judgeId, problem, language]);

  return (
    <>
      <ActionButton
        onClick={handleExecuteButtonClick}
        disabled={!problem || isJudging}
        ref={tourRef}
        data-testid="execute-code-button"
      >
        코드 실행
      </ActionButton>

      <TourOverlay title="알고리즘 실행" tourRef={tourRef} myTourStep={5} guideLoc="leftTop">
        <p>코드를 컴파일하고 문제와 사용자의 테스트케이스를 넣어 실행합니다.</p>
        <br />
        <p>
          💡 <code>F5</code> 키로 실행이 가능합니다.
        </p>
      </TourOverlay>
    </>
  );
}
