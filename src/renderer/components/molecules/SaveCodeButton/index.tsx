import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

// 테스트코드 작성
// [v]: 저장 버튼을 누를 경우 "저장이 완료되었습니다" 메세지가 출력된다.
// [v]: 저장 버튼을 누를 경우 저장 버튼이 비활성화처리된다.
export function SaveCodeButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [language] = useStore(useShallow((s) => [s.lang]));
  const [isCodeStale, setIsCodeStale] = useStore(useShallow((s) => [s.isCodeStale, s.setIsCodeStale]));
  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  useEffect(() => {
    window.electron.ipcRenderer.on('save-code-result', ({ data: { isSaved } }) => {
      setMessage(isSaved ? '저장이 완료되었습니다.' : '저장에 실패하였습니다.');
      setIsCodeStale(false);
    });
  }, [setMessage, setIsCodeStale]);

  const handleSaveCodeButtonClick = () => {
    if (!problem) {
      return;
    }

    const { number } = problem;
    const { code } = useStore.getState();

    window.electron.ipcRenderer.sendMessage('save-code', { data: { number, language, code } });
  };

  return (
    <ActionButton onClick={handleSaveCodeButtonClick} disabled={!problem || !isCodeStale}>
      저장
    </ActionButton>
  );
}
