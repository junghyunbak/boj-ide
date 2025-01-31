import { useEffect } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useStreamingAICode, useConfirmModalController, useAlertModalController } from '@/renderer/hooks';

import { AI_ERROR_MESSAGE, AI_EXECUTE_QUESTION_MESSAGE } from '@/renderer/constants';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

export function AICodeCreateButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [setEditorCode] = useStore(useShallow((s) => [s.setCode]));

  const { fireAlertModal } = useAlertModalController();
  const { fireConfirmModal } = useConfirmModalController();

  const { complete, completion, isLoading } = useStreamingAICode({
    onError() {
      fireAlertModal('에러 발생', AI_ERROR_MESSAGE);
    },
  });

  useEffect(() => {
    setEditorCode(completion);
  }, [completion, setEditorCode]);

  const handleAICodeCreateButtonClick = () => {
    fireConfirmModal(AI_EXECUTE_QUESTION_MESSAGE, async () => {
      if (!problem) {
        return;
      }

      window.electron.ipcRenderer.sendMessage('log-execute-ai-create');

      complete('', {
        body: {
          inputs: problem.testCase.inputs,
          inputDesc: problem.inputDesc,
          language: useStore.getState().lang,
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
