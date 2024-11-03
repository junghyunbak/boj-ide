import { css } from '@emotion/css';

import { useEffect, useState } from 'react';

import { useShallow } from 'zustand/shallow';

import { useStore } from '../../store';

export function Header() {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const [code] = useStore(useShallow((s) => [s.code]));

  const [ext] = useStore(useShallow((s) => [s.ext]));

  const [mode, setMode] = useStore(useShallow((s) => [s.mode, s.setMode]));

  const [isJudging, setIsJudging] = useStore(useShallow((s) => [s.isJudging, s.setIsJudging]));

  const [setJudgeResult] = useStore(useShallow((s) => [s.setJudgeResult]));

  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    setIsStale(true);
  }, [code]);

  /**
   * 코드 저장 시 완료 여부를 전달받는 ipc 이벤트 초기화
   */
  useEffect(() => {
    window.electron.ipcRenderer.on('save-code-result', ({ data: { isSaved } }) => {
      console.log(isSaved ? '저장이 완료되었습니다.' : '저장에 실패하였습니다.');

      setIsStale(false);
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
    <div
      className={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 1rem;
        border-bottom: 1px solid lightgray;
      `}
    >
      <p
        className={css`
          margin: 0;
        `}
      >
        {problem === null ? '문제 페이지로 이동하세요.' : `${problem.number}.${ext}`}
      </p>

      <div
        className={css`
          display: flex;
        `}
      >
        <div
          className={css`
            display: flex;
            border: 1px solid lightgray;
            border-radius: 4px;
            overflow: hidden;
            margin-right: 0.5rem;

            button {
              transition: all ease 0.2s;
              padding: 0.4rem 0.8rem;
              cursor: pointer;

              &:hover {
                background-color: lightgray;
                color: white;
              }

              p {
                margin: 0;
              }
            }
          `}
        >
          <button
            className={css`
              border: none;
              background-color: ${mode === 'normal' ? 'lightgray' : 'transparent'};
              color: ${mode === 'normal' ? 'white' : 'black'};
            `}
            type="button"
            onClick={() => {
              setMode('normal');
            }}
          >
            normal
          </button>

          <button
            className={css`
              border: none;
              background-color: ${mode === 'vim' ? 'lightgray' : 'transparent'};
              color: ${mode === 'vim' ? 'white' : 'black'};
            `}
            type="button"
            onClick={() => {
              setMode('vim');
            }}
          >
            vim
          </button>
        </div>

        <div
          className={css`
            display: flex;
            gap: 0.5rem;

            button {
              border: none;
              border-radius: 4px;
              color: white;
              padding: 0.4rem 0.8rem;
              cursor: pointer;
              background-color: #428bca;

              &:disabled {
                background-color: gray;
                cursor: auto;
                color: lightgray;

                &:hover {
                  background-color: gray;
                }
              }

              &:hover {
                background-color: #2980b9;
              }
            }
          `}
        >
          <button type="button" onClick={handleSaveButtonClick} disabled={!isStale}>
            저장하기
          </button>

          <button type="button" onClick={handleSubmitButtonClick} disabled={isJudging}>
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
}
