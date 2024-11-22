import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '../../../store';
import { SubmitButton } from '../../core/button/SubmitButton';

export function SaveCodeButton() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [code] = useStore(useShallow((s) => [s.code]));
  const [lang] = useStore(useShallow((s) => [s.lang]));

  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    setIsStale(true);
  }, [code]);

  useEffect(() => {
    window.electron.ipcRenderer.on('save-code-result', ({ data: { isSaved } }) => {
      setMessage(isSaved ? '저장이 완료되었습니다.' : '저장에 실패하였습니다.');

      setIsStale(false);
    });
  }, [setMessage]);

  const handleSaveButtonClick = () => {
    if (!problem) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('save-code', { data: { number: problem.number, language: lang, code } });
  };

  return (
    <SubmitButton onClick={handleSaveButtonClick} disabled={!problem || !isStale}>
      저장
    </SubmitButton>
  );
}
