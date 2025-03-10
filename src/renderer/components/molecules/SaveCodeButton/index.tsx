import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyEditor } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

export function SaveCodeButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [isCodeStale] = useStore(useShallow((s) => [s.isCodeStale]));

  const { saveEditorCode } = useModifyEditor();

  const handleSaveCodeButtonClick = () => {
    saveEditorCode();
  };

  return (
    <ActionButton onClick={handleSaveCodeButtonClick} disabled={!problem || !isCodeStale}>
      저장
    </ActionButton>
  );
}
