import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useEditorController } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

// [v]: 저장 버튼을 누를 경우 "저장이 완료되었습니다" 메세지가 출력된다.
// [v]: 저장 버튼을 누를 경우 저장 버튼이 비활성화처리된다.
export function SaveCodeButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [isCodeStale] = useStore(useShallow((s) => [s.isCodeStale]));

  const { saveEditorCode } = useEditorController();

  const handleSaveCodeButtonClick = () => {
    saveEditorCode();
  };

  return (
    <ActionButton onClick={handleSaveCodeButtonClick} disabled={!problem || !isCodeStale}>
      저장
    </ActionButton>
  );
}
