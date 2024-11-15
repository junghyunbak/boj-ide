import { css } from '@emotion/css';

import { useEffect, useState } from 'react';

import { useShallow } from 'zustand/shallow';

import { useStore } from '../../store';

const EXTS: CodeInfo['ext'][] = ['cpp', 'js', 'py', 'java'];

const extToLang = (ext: CodeInfo['ext']) => {
  switch (ext) {
    case 'cpp':
      return 'C++14';
    case 'js':
      return 'node.js';
    case 'py':
      return 'python3';
    case 'java':
      return 'java11';
    default:
      return '';
  }
};

export function Header() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [code] = useStore(useShallow((s) => [s.code]));
  const [ext, setExt] = useStore(useShallow((s) => [s.ext, s.setExt]));
  const [mode, setMode] = useStore(useShallow((s) => [s.mode, s.setMode]));

  const [isJudging, setIsJudging] = useStore(useShallow((s) => [s.isJudging, s.setIsJudging]));
  const [setJudgeResult] = useStore(useShallow((s) => [s.setJudgeResult]));

  const [setMessage] = useStore(useShallow((s) => [s.setMessage]));

  const [isStale, setIsStale] = useState(false);
  const [langMenuIsOpen, setLangMenuIsOpen] = useState(false);

  useEffect(() => {
    setIsStale(true);
  }, [code]);

  useEffect(() => {
    const handleLangMenuClose = () => {
      setLangMenuIsOpen(false);
    };

    window.addEventListener('click', handleLangMenuClose);

    return () => {
      window.removeEventListener('click', handleLangMenuClose);
    };
  }, []);

  /**
   * 코드 저장 시 완료 여부를 전달받는 ipc 이벤트 초기화
   */
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

    window.electron.ipcRenderer.sendMessage('save-code', { data: { number: problem.number, ext, code } });
  };

  const handleSubmitButtonClick = () => {
    if (!problem) {
      return;
    }

    setIsJudging(true);

    setJudgeResult(() => []);

    window.electron.ipcRenderer.sendMessage('judge-start', {
      data: {
        code,
        ext,
        ...problem,
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
          font-size: 0.875rem;
        `}
      >
        {problem && `${problem.number}.${ext}`}
      </p>

      <div
        className={css`
          display: flex;
        `}
      >
        <div
          className={css`
            display: flex;
            position: relative;
            z-index: 10;
            margin-right: 0.5rem;
          `}
        >
          <button
            type="button"
            onClick={(e) => {
              setLangMenuIsOpen(!langMenuIsOpen);

              e.stopPropagation();
            }}
            className={css`
              border: none;
              background: lightgray;
              border-radius: 4px;
              color: black;
              padding: 0.4rem 0.8rem;
              cursor: pointer;
              white-space: nowrap;
              font-weight: 500;

              &::after {
                content: '';
                display: inline-block;
                margin-left: 0.255em;
                vertical-align: 0.255em;
                border-top: 0.3em solid;
                border-right: 0.3em solid transparent;
                border-left: 0.3em solid transparent;
              }
            `}
          >
            {extToLang(ext)}
          </button>

          {langMenuIsOpen && (
            <div
              className={css`
                position: absolute;
                top: 100%;
                right: 0;
                background-color: white;
                border-radius: 4px;
                overflow: hidden;
                box-shadow: 1px 1px 1px 1px rgb(0, 0, 0, 0.2);

                > div {
                  padding: 0.5rem;
                  margin: 0;

                  button {
                    text-align: left;
                    font-size: 0.8rem;
                    padding: 0.2rem 0.4rem;
                    cursor: pointer;
                    border: none;
                    background-color: transparent;
                  }
                }
              `}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div>
                {EXTS.map((_ext) => {
                  return (
                    <button
                      key={_ext}
                      type="button"
                      onClick={(e) => {
                        setLangMenuIsOpen(false);

                        setExt(_ext);

                        e.stopPropagation();
                      }}
                    >
                      {extToLang(_ext)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

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
              font-weight: 500;

              &:hover {
                background-color: lightgray;
                color: black;
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
              color: ${mode === 'normal' ? 'black' : 'lightgray'};
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
              color: ${mode === 'vim' ? 'black' : 'lightgray'};
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
              white-space: nowrap;

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
          <button type="button" onClick={handleSaveButtonClick} disabled={!problem || !isStale}>
            저장
          </button>

          <button type="button" onClick={handleSubmitButtonClick} disabled={!problem || isJudging}>
            코드 실행
          </button>
        </div>
      </div>
    </div>
  );
}
