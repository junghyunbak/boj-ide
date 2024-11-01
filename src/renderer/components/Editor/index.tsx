import { useEffect } from 'react';

import { vim } from '@replit/codemirror-vim';
import { javascript } from '@codemirror/lang-javascript';
import ReactCodeMirror from '@uiw/react-codemirror';

import { useShallow } from 'zustand/shallow';

import { useStore } from '../../store';

export function Editor() {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const [ext] = useStore(useShallow((s) => [s.ext]));

  const [code, setCode] = useStore(useShallow((s) => [s.code, s.setCode]));

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

  return (
    <ReactCodeMirror
      extensions={[javascript(), vim()]}
      value={code}
      height="200px"
      onChange={(v) => {
        setCode(v);
      }}
    />
  );
}
