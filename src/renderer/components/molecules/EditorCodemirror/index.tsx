import { vim, Vim } from '@replit/codemirror-vim';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { useState, useEffect, useRef } from 'react';
import { EditorState, useCodeMirror, EditorView, type Extension } from '@uiw/react-codemirror';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

interface EditorCodemirrorProps {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export function EditorCodemirror({ containerRef }: EditorCodemirrorProps) {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [lang] = useStore(useShallow((s) => [s.lang]));
  const [code, setCode] = useStore(useShallow((s) => [s.code, s.setCode]));
  const [mode] = useStore(useShallow((s) => [s.mode]));
  const [fontSize] = useStore(useShallow((s) => [s.fontSize]));
  const [isCodeStale, setIsCodeStale] = useStore(useShallow((s) => [s.isCodeStale, s.setIsCodeStale]));

  const [editorHeight, setEditorHeight] = useState(0);
  const [editorWidth, setEditorWidth] = useState(0);

  const editorRef = useRef<HTMLDivElement | null>(null);

  const extensions = (() => {
    const tmp: Extension[] = [];

    const FontTheme = EditorView.theme({
      '.cm-content': {
        fontSize: `${fontSize}px`,
        fontFamily: 'hack',
      },
      '.cm-gutters': {
        fontSize: `${fontSize}px`,
        fontFamily: 'hack',
      },
    });

    tmp.push(FontTheme);

    switch (lang) {
      case 'node.js':
        tmp.push(javascript());
        break;
      case 'C++14':
      case 'C++17':
        tmp.push(cpp());
        break;
      case 'Java11':
        tmp.push(java());
        break;
      case 'Python3':
        tmp.push(python());
        break;
      default:
        break;
    }

    if (mode === 'vim') {
      tmp.push(vim());
    }

    return tmp;
  })();

  const { setContainer, setState, state } = useCodeMirror({
    extensions,
    value: code,
    width: `${editorWidth}px`,
    height: `${editorHeight}px`,
    basicSetup: { autocompletion: false },
    onChange: (v) => {
      setCode(v);
    },
  });

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    setContainer(editorRef.current);
  }, [setContainer]);

  /**
   * 레이아웃이 달라졌을경우, 에디터의 크기 갱신을 위한 이벤트 등록
   */
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      setEditorWidth(width);
      setEditorHeight(height);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
  }, [containerRef]);

  /**
   * 로딩 된 소스코드를 반영하는 ipc 이벤트 초기화
   * // TODO: memory leak 존재
   */
  useEffect(() => {
    window.electron.ipcRenderer.on('load-code-result', ({ data }) => {
      setCode(data.code);

      if (editorRef.current) {
        const newState = EditorState.create({
          ...state,
        });

        setState(newState);
      }
    });
  }, [setCode, setState, state]);

  /**
   * 코드가 변경 될 경우, 코드 저장 관련 기능을 활성화
   */
  useEffect(() => {
    setIsCodeStale(true);
  }, [code, setIsCodeStale]);

  /**
   * 문제, 확장자가 변경되면 소스코드를 로딩, 기존의 코드를 저장
   */
  useEffect(() => {
    if (!problem) {
      return () => {};
    }

    window.electron.ipcRenderer.sendMessage('load-code', { data: { number: problem.number, language: lang } });

    return () => {
      window.electron.ipcRenderer.sendMessage('save-code', {
        data: { number: problem.number, language: lang, code: useStore.getState().code, silence: true },
      });
    };
  }, [problem, lang]);

  /**
   * 저장 이벤트 등록
   */
  useEffect(() => {
    const saveCode = () => {
      if (!problem || !isCodeStale) {
        return;
      }

      window.electron.ipcRenderer.sendMessage('save-code', { data: { number: problem.number, language: lang, code } });

      setIsCodeStale(false);
    };

    Vim.defineEx('write', 'w', saveCode);

    const handleSaveCode = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();

        saveCode();
      }
    };

    window.addEventListener('keydown', handleSaveCode);

    return () => {
      window.removeEventListener('keydown', handleSaveCode);
    };
  }, [code, lang, problem, isCodeStale, setIsCodeStale]);

  return <div ref={editorRef} />;
}
