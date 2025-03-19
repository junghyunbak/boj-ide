import { useCallback, useRef } from 'react';

import { useModifyEditor, useModifyConfirmModal, useProblem, useEditor } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

export function SubmitButton() {
  const tourRef = useRef<HTMLButtonElement>(null);

  const { problem } = useProblem();
  const { editorLanguage } = useEditor();

  const { fireConfirmModal } = useModifyConfirmModal();
  const { getEditorValue, saveCode, updateProblemToStale } = useModifyEditor();

  const handleSubmitButtonClick = useCallback(() => {
    if (!problem) {
      return;
    }

    fireConfirmModal('제출하시겠습니까?', () => {
      saveCode(problem, editorLanguage);
      updateProblemToStale(problem, editorLanguage, false);

      window.electron.ipcRenderer.sendMessage('submit-code', {
        data: {
          code: getEditorValue(problem, editorLanguage) || '',
          language: editorLanguage,
          number: problem.number,
        },
      });
    });
  }, [fireConfirmModal, getEditorValue, saveCode, updateProblemToStale, problem, editorLanguage]);

  return (
    <>
      <ActionButton onClick={handleSubmitButtonClick} disabled={!problem} ref={tourRef}>
        제출
      </ActionButton>

      <TourOverlay title="백준 웹 사이트 제출" myTourStep={7} tourRef={tourRef} guideLoc="bottomRight">
        <p>코드를 백준에 자동으로 제출합니다.</p>
        <br />
        <h5>* 코드 제출을 위해서는 좌측 웹 뷰에서 백준에 로그인 해야합니다.</h5>
      </TourOverlay>
    </>
  );
}
