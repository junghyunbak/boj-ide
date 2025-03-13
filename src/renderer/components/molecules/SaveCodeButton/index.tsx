import { useEditor, useModifyEditor, useProblem } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useCallback } from 'react';

export function SaveCodeButton() {
  const { problem } = useProblem();
  const { isCodeStale } = useEditor();

  const { saveFile } = useModifyEditor();

  const handleSaveCodeButtonClick = useCallback(() => {
    saveFile();
  }, [saveFile]);

  return (
    <ActionButton onClick={handleSaveCodeButtonClick} disabled={!problem || !isCodeStale}>
      저장
    </ActionButton>
  );
}
