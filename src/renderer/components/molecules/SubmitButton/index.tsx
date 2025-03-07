import { useRef } from 'react';

import { useConfirmModalController, useEditorController } from '@/renderer/hooks';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

export function SubmitButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const { fireConfirmModal } = useConfirmModalController();
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
        <p>작성한 코드를 백준에 자동으로 제출합니다.</p>
      </TourOverlay>
    </>
  );
}
