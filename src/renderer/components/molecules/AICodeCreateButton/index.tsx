import { useCallback, useEffect, useRef } from 'react';

import { css } from '@emotion/react';

import aiCreateImageSrc from '@/renderer/assets/gifs/ai-create.gif';

import { type UseCompletionOptions } from '@ai-sdk/react';

import {
  useFetchAICode,
  useModifyAlertModal,
  useModifyConfirmModal,
  useProblem,
  useEditor,
  useLanguage,
} from '@/renderer/hooks';

import { AI_ERROR_MESSAGE, AI_EXECUTE_QUESTION_MESSAGE } from '@/renderer/constants';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { TourOverlay } from '@/renderer/components/molecules/TourOverlay';

export function AICodeCreateButton() {
  const tourRef = useRef<HTMLButtonElement>(null);

  const { problem } = useProblem();
  const { language } = useLanguage();
  const { editorIndentSpace, editorView } = useEditor();

  const { fireAlertModal } = useModifyAlertModal();
  const { fireConfirmModal } = useModifyConfirmModal();

  const updateView = useCallback(
    (code: string) => {
      if (!editorView) {
        return;
      }

      const currentValue = editorView.state.doc.toString();

      editorView.dispatch({
        changes: { from: 0, to: currentValue.length, insert: code },
      });
    },
    [editorView],
  );

  const onError = useCallback<Exclude<UseCompletionOptions['onError'], undefined>>(() => {
    fireAlertModal('에러 발생', AI_ERROR_MESSAGE);
  }, [fireAlertModal]);

  const onFinish = useCallback<Exclude<UseCompletionOptions['onFinish'], undefined>>(
    (prompt, completion) => {
      updateView(completion);
    },
    [updateView],
  );

  const { complete, completion, isLoading } = useFetchAICode({
    onError,
    onFinish,
  });

  /**
   * [결과가 생성될 때 마다 에디터 갱신]
   *
   * AI 결과 초기값(completion)으로 인한 뷰 상태변경을 막기 위해 isLoading사용.
   *
   * -> isLoading으로 인한 최종 결과값 유실 문제를 해결하기 위해 onFinish 에서 한번 더 뷰 업데이트
   */
  useEffect(() => {
    if (!isLoading) {
      return;
    }

    updateView(completion);
  }, [completion, isLoading, updateView]);

  const handleAICodeCreateButtonClick = useCallback(() => {
    fireConfirmModal(AI_EXECUTE_QUESTION_MESSAGE, async () => {
      if (!problem) {
        return;
      }

      window.electron.ipcRenderer.sendMessage('log-execute-ai-create', {
        data: {
          number: problem.number,
          language,
        },
      });

      complete('', {
        body: {
          inputs: problem.testCase.inputs,
          inputDesc: problem.inputDesc,
          indentSpace: editorIndentSpace,
          language,
        },
      });
    });
  }, [complete, editorIndentSpace, language, fireConfirmModal, problem]);

  return (
    <>
      <ActionButton onClick={handleAICodeCreateButtonClick} disabled={!problem} ref={tourRef}>
        {`AI 입력 생성${isLoading ? ' 중...' : ''}`}
      </ActionButton>

      <TourOverlay tourRef={tourRef} title="인공지능 표준 입력 생성" myTourStep={3} guideLoc="leftTop">
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
