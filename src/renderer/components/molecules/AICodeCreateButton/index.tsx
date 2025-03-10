import { useCallback, useEffect, useRef } from 'react';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';

import aiCreateImageSrc from '@/renderer/assets/gifs/ai-create.gif';

import {
  useFetchAICode,
  useModifyAlertModal,
  useModifyEditor,
  useModifyConfirmModal,
  useProblem,
} from '@/renderer/hooks';

import { AI_ERROR_MESSAGE, AI_EXECUTE_QUESTION_MESSAGE } from '@/renderer/constants';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

export function AICodeCreateButton() {
  const tourRef = useRef<HTMLButtonElement>(null);

  const { problem } = useProblem();

  const { fireAlertModal } = useModifyAlertModal();
  const { fireConfirmModal } = useModifyConfirmModal();
  const { updateEditorCode } = useModifyEditor();

  const { complete, completion, isLoading } = useFetchAICode({
    onError() {
      fireAlertModal('에러 발생', AI_ERROR_MESSAGE);
    },
  });

  /**
   * 결과가 변경될 때 마다 에디터 갱신
   */
  useEffect(() => {
    updateEditorCode(completion);
  }, [completion, updateEditorCode]);

  const handleAICodeCreateButtonClick = useCallback(() => {
    fireConfirmModal(AI_EXECUTE_QUESTION_MESSAGE, async () => {
      if (!problem) {
        return;
      }

      const { lang } = useStore.getState();

      window.electron.ipcRenderer.sendMessage('log-execute-ai-create', {
        data: {
          number: problem.number,
          language: lang,
        },
      });

      complete('', {
        body: {
          inputs: problem.testCase.inputs,
          inputDesc: problem.inputDesc,
          language: useStore.getState().lang,
          indentSpace: useStore.getState().indentSpace,
        },
      });
    });
  }, [complete, fireConfirmModal, problem]);

  return (
    <>
      <ActionButton onClick={handleAICodeCreateButtonClick} disabled={!problem} ref={tourRef}>
        {`AI 입력 생성${isLoading ? '중...' : ''}`}
      </ActionButton>

      <TourOverlay tourRef={tourRef} title="인공지능 표준 입력 생성" myTourStep={3} guideLoc="bottomRight">
        <img
          src={aiCreateImageSrc}
          width="300px"
          /**
           * height값이 없으면 위치가 잘못 계산될 수 있음.
           */
          height="150px"
          css={css`
            object-fit: contain;
          `}
        />
        <br />
        <p>AI가 문제의 지문을 읽고 표준 입력 코드를 작성해줍니다.</p>
        <br />
        <p>사용 시 핵심 알고리즘 작성 단계로 바로 넘어갈 수 있습니다.</p>
        <br />
        <h5>* 첫 생성 결과가 좋지 못하였더라도 재시도하여 올바른 결과를 얻을 수 있습니다.</h5>
        <h5>* 지문의 설명이 부실할 경우 결과가 나쁠 수 있습니다.</h5>
      </TourOverlay>
    </>
  );
}
