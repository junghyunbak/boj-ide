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

  const [editorHeight, setEditorHeight] = useState(0);
  const [editorWidth, setEditorWidth] = useState(0);

  const [isCodeStale, setIsCodeStale] = useState(false);

  const editorRef = useRef<HTMLDivElement | null>(null);

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
  }, [containerRef]);

  /**
   * 로딩 된 소스코드를 반영하는 ipc 이벤트 초기화
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
  }, [code]);

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
  }, [code, lang, problem, isCodeStale]);

  return <div ref={editorRef} />;
}
