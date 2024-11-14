import { css } from '@emotion/css';
import { useEffect, useRef, useState } from 'react';

import { vim, Vim } from '@replit/codemirror-vim';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import ReactCodeMirror, { EditorView, type Extension } from '@uiw/react-codemirror';

import { useShallow } from 'zustand/shallow';

import { useStore } from '../../store';

export function Editor() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [ext] = useStore(useShallow((s) => [s.ext]));
  const [code, setCode] = useStore(useShallow((s) => [s.code, s.setCode]));
  const [mode] = useStore(useShallow((s) => [s.mode]));

  const [editorHeight, setEditorHeight] = useState(0);
  const [editorWidth, setEditorWidth] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

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

  /**
   * 레이아웃이 달라졌을경우, 에디터의 크기 갱신을 위한 이벤트 등록
   */
  useEffect(() => {
    const resizeEditorHeight = () => {
      if (!containerRef.current) {
        return;
      }

      setEditorHeight(containerRef.current.getBoundingClientRect().height);
    };

    const resizeEditorWidth = () => {
      if (!containerRef.current) {
        return;
      }

      setEditorWidth(containerRef.current.getBoundingClientRect().width);
    };

    useStore.subscribe((s, prev) => {
      if (s.topRatio !== prev.topRatio || s.leftRatio !== prev.leftRatio) {
        resizeEditorHeight();
        resizeEditorWidth();
      }
    });

    const handleResizeEditor = () => {
      resizeEditorHeight();
      resizeEditorWidth();
    };

    handleResizeEditor();

    window.addEventListener('resize', handleResizeEditor);

    return () => {
      window.removeEventListener('resize', handleResizeEditor);
    };
  }, []);

  /**
   * 현재 언어와 모드에 따른 에디터 확장 프로그램 계산
   */
  const extensions = (() => {
    const tmp: Extension[] = [];

    const FontTheme = EditorView.theme({
      '.cm-content': {
        fontSize: '16px',
        fontFamily: 'hack',
      },
      '.cm-gutters': {
        fontSize: '16px',
        fontFamily: 'hack',
      },
    });

    tmp.push(FontTheme);

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

  return (
    <div
      ref={containerRef}
      className={css`
        width: 100%;
        height: 100%;
      `}
    >
      {!problem ? (
        <div
          className={css`
            width: 100%;
            height: 100%;
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
            {'/<>'}
          </h1>
          <p>왼쪽 브라우저에서 문제 페이지로 이동하세요.</p>
        </div>
      ) : (
        <ReactCodeMirror
          extensions={extensions}
          value={code}
          width={`${editorWidth}px`}
          height={`${editorHeight}px`}
          basicSetup={{ autocompletion: false }}
          onChange={(v) => {
            setCode(v);
          }}
        />
      )}
    </div>
  );
}
