import { useCallback, useRef } from 'react';

import {
  useEditor,
  useJudge,
  useModifyEditor,
  useModifyJudge,
  useModifyStale,
  useProblem,
  useTestcase,
} from '@/renderer/hooks';

import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

export function ExecuteCodeButton() {
  const tourRef = useRef<HTMLButtonElement>(null);

  const { problem } = useProblem();
  const { isJudging, judgeId } = useJudge();
  const { editorLanguage } = useEditor();
  const { allTestcase } = useTestcase();

  const { startJudge } = useModifyJudge();
  const { saveCode } = useModifyEditor();
  const { updateProblemToStale } = useModifyStale();

  const handleExecuteButtonClick = useCallback(() => {
    saveCode(problem, editorLanguage);
    updateProblemToStale(problem, editorLanguage, false);
    startJudge(problem, editorLanguage, allTestcase, judgeId);
  }, [saveCode, updateProblemToStale, startJudge, allTestcase, judgeId, problem, editorLanguage]);

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

      <TourOverlay title="알고리즘 실행" tourRef={tourRef} myTourStep={4} guideLoc="leftTop">
        <p>코드를 컴파일하고 문제와 사용자의 테스트케이스를 넣어 실행합니다.</p>
        <br />
        <p>
          💡 <code>F5</code> 키로 실행이 가능합니다.
        </p>
      </TourOverlay>
    </>
  );
}
