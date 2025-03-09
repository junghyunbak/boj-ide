import { useRef } from 'react';

import { useEditorController, useModifyConfirmModal, useProblem } from '@/renderer/hooks';

import { useStore } from '@/renderer/store';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

export function SubmitButton() {
  const { problem } = useProblem();

  const { fireConfirmModal } = useModifyConfirmModal();

  const { getProblemCode } = useEditorController();

  const tourRef = useRef<HTMLButtonElement>(null);

  const handleSubmitButtonClick = () => {
    if (!problem) {
      return;
    }

    fireConfirmModal('제출하시겠습니까?', () => {
      const { lang } = useStore.getState();
      const code = getProblemCode();

      window.electron.ipcRenderer.sendMessage('submit-code', {
        data: {
          code,
          language: lang,
          number: problem.number,
        },
      });
    });
  };

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
