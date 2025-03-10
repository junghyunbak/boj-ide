import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyEditor, useProblem } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useCallback } from 'react';

export function SaveCodeButton() {
  const { problem } = useProblem();
  const [isCodeStale] = useStore(useShallow((s) => [s.isCodeStale]));

  const { saveEditorCode } = useModifyEditor();

  const handleSaveCodeButtonClick = useCallback(() => {
    saveEditorCode();
  }, [saveEditorCode]);

  return (
    <ActionButton onClick={handleSaveCodeButtonClick} disabled={!problem || !isCodeStale}>
      저장
    </ActionButton>
  );
}
