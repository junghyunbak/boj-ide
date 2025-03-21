import { useCallback, useRef } from 'react';

import { useModifyEditor, useModifyConfirmModal, useProblem, useLanguage } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

export function SubmitButton() {
  const tourRef = useRef<HTMLButtonElement>(null);

  const { problem } = useProblem();
  const { language } = useLanguage();

  const { fireConfirmModal } = useModifyConfirmModal();
  const { getEditorValue, saveCode } = useModifyEditor();

  const handleSubmitButtonClick = useCallback(() => {
    if (!problem) {
      return;
    }

    fireConfirmModal('제출하시겠습니까?', async () => {
      await saveCode(problem, language);

      window.electron.ipcRenderer.sendMessage('submit-code', {
        data: {
          code: getEditorValue(problem, language) || '',
          language,
          number: problem.number,
        },
      });
    });
  }, [fireConfirmModal, getEditorValue, saveCode, problem, language]);

  return (
    <>
      <ActionButton
        onClick={handleSubmitButtonClick}
        disabled={!problem}
        ref={tourRef}
        data-testid="submit-code-button"
      >
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
