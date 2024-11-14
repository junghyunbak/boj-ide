import { css } from '@emotion/css';
import { useEffect } from 'react';

import { vim, Vim } from '@replit/codemirror-vim';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import ReactCodeMirror, { type Extension } from '@uiw/react-codemirror';

import { useShallow } from 'zustand/shallow';

import { useStore } from '../../store';

interface EditorProps {
  height: number;
}

export function Editor({ height }: EditorProps) {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const [ext] = useStore(useShallow((s) => [s.ext]));

  const [code, setCode] = useStore(useShallow((s) => [s.code, s.setCode]));

  const [mode] = useStore(useShallow((s) => [s.mode]));

  const [leftRatio] = useStore(useShallow((s) => [s.leftRatio]));

  /**
   * 문제, 확장자가 변경되면 소스코드를 로딩
   */
  useEffect(() => {
    if (!problem) {
      return;
    }

    window.electron.ipcRenderer.sendMessage('load-code', { data: { number: problem.number, ext } });
  }, [problem, ext]);

  /**
   * 로딩 된 소스코드를 반영하는 ipc 이벤트 초기화
   */
  useEffect(() => {
    window.electron.ipcRenderer.on('load-code-result', ({ data }) => {
      setCode(data.code);
    });
  }, [setCode]);

  /**
   * 저장 이벤트 등록
   */
  useEffect(() => {
    const saveCode = () => {
      if (!problem) {
        return;
      }

      window.electron.ipcRenderer.sendMessage('save-code', { data: { number: problem.number, ext, code } });
    };

    Vim.defineEx('write', 'w', saveCode);

    const handleSaveCode = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();

        saveCode();
      }
    };

    window.addEventListener('keydown', handleSaveCode);

    return () => {
      window.removeEventListener('keydown', handleSaveCode);
    };
  }, [code, ext, problem]);

  const extensions = (() => {
    const tmp: Extension[] = [];

    if (ext === 'js') {
      tmp.push(javascript());
    } else if (ext === 'cpp') {
      tmp.push(cpp());
    } else if (ext === 'py') {
      tmp.push(python());
    }

    if (mode === 'vim') {
      tmp.push(vim());
    }

    return tmp;
  })();

  if (!problem) {
    return (
      <div
        className={css`
          height: ${height}px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        `}
      >
        <h1
          className={css`
            color: #428bca;
          `}
        >
          {'</>'}
        </h1>
        <p>왼쪽 브라우저에서 문제 페이지로 이동하세요.</p>
      </div>
    );
  }

  return (
    <ReactCodeMirror
      extensions={extensions}
      value={code}
      width={`${(window.innerWidth * (100 - leftRatio)) / 100 - 15}px`}
      height={`${height || 500}px`}
      basicSetup={{ autocompletion: false }}
      onChange={(v) => {
        setCode(v);
      }}
    />
  );
}
