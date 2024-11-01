import { useEffect } from 'react';

import { useShallow } from 'zustand/shallow';

import { useStore } from '../../store';

export function Header() {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const [code] = useStore(useShallow((s) => [s.code]));

  const [ext] = useStore(useShallow((s) => [s.ext]));

  const [isJudging, setIsJudging] = useStore(useShallow((s) => [s.isJudging, s.setIsJudging]));

  const [setJudgeResult] = useStore(useShallow((s) => [s.setJudgeResult]));

  /**
   * 코드 저장 시 완료 여부를 전달받는 ipc 이벤트 초기화
   */
  useEffect(() => {
    window.electron.ipcRenderer.on('save-code-result', ({ data: { isSaved } }) => {
      alert(isSaved ? '저장이 완료되었습니다.' : '저장에 실패하였습니다.');
    });
  }, []);

  const handleSaveButtonClick = () => {
    if (!problem) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('save-code', { data: { number: problem.number, ext, code } });
  };

  const handleSubmitButtonClick = () => {
    setIsJudging(true);

    setJudgeResult(() => []);

    window.electron.ipcRenderer.sendMessage('judge-start', {
      data: {
        code,
        ext,
      },
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <p>{problem === null ? '문제 페이지로 이동하세요.' : problem.number}</p>

      <button type="button" onClick={handleSaveButtonClick}>
        저장하기
      </button>

      <button type="button" onClick={handleSubmitButtonClick} disabled={isJudging}>
        제출하기
      </button>
    </div>
  );
}
