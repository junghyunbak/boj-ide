import { useEffect } from 'react';

import { vim, Vim } from '@replit/codemirror-vim';
import { javascript } from '@codemirror/lang-javascript';
import ReactCodeMirror, { type Extension } from '@uiw/react-codemirror';

import { useShallow } from 'zustand/shallow';

import { useStore } from '../../store';

export function Editor() {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const [ext] = useStore(useShallow((s) => [s.ext]));

  const [code, setCode] = useStore(useShallow((s) => [s.code, s.setCode]));

  const [mode] = useStore(useShallow((s) => [s.mode]));

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
    }

    if (mode === 'vim') {
      tmp.push(vim());
    }

    return tmp;
  })();

  return (
    <ReactCodeMirror
      extensions={extensions}
      value={code}
      height="200px"
      onChange={(v) => {
        setCode(v);
      }}
    />
  );
}
