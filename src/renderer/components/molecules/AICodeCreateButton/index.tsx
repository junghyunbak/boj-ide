import { useEffect } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import {
  useStreamingAICode,
  useConfirmModalController,
  useAlertModalController,
  useEditorController,
} from '@/renderer/hooks';

import { AI_ERROR_MESSAGE, AI_EXECUTE_QUESTION_MESSAGE } from '@/renderer/constants';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

export function AICodeCreateButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const { fireAlertModal } = useAlertModalController();
  const { fireConfirmModal } = useConfirmModalController();
  const { updateEditorCode } = useEditorController();
  const { complete, completion, isLoading } = useStreamingAICode({
    onError() {
      fireAlertModal(
        '에러 발생',
        <div>
          <pre>{AI_ERROR_MESSAGE}</pre>
        </div>,
      );
    },
  });

  /**
   * 결과가 변경될 때 마다 에디터 갱신
   */
  useEffect(() => {
    updateEditorCode(completion);
  }, [completion, updateEditorCode]);

  const handleAICodeCreateButtonClick = () => {
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
  };

  return (
    <ActionButton onClick={handleAICodeCreateButtonClick} disabled={!problem}>
      {`AI 입력 생성${isLoading ? '중...' : ''}`}
    </ActionButton>
  );
}
