import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { EditorState, useCodeMirror, EditorView, type Extension } from '@uiw/react-codemirror';

import { css } from '@emotion/react';

import { vim, Vim, getCM } from '@replit/codemirror-vim';

import { acceptCompletion } from '@codemirror/autocomplete';
import { indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useResponsiveLayout } from '@/renderer/hooks';

import { zIndex } from '@/renderer/styles';

// [ ]: 컴포넌트가 언마운트되면 코드를 저장한다.
// [ ]: 새롭게 코드를 로딩하면 히스토리가 존재하지 않아야 한다.
// [ ]: `ctrl + s` 단축키를 클릭하면 "저장되었습니다." 메세지가 출력되어야한다.
// [ ]: 코드가 stale하지 않은 상태라면 `ctrl + s` 단축키를 클릭하여도 "저장되었습니다." 메세지가 출력되지 않아야 한다.
export function EditorCodemirror() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [editorMode] = useStore(useShallow((s) => [s.mode]));
  const [editorCode, setEditorCode] = useStore(useShallow((s) => [s.code, s.setCode]));
  const [editorLanguage] = useStore(useShallow((s) => [s.lang]));
  const [editorFontSize] = useStore(useShallow((s) => [s.fontSize]));
  const [editorIndentSpace] = useStore(useShallow((s) => [s.indentSpace]));
  const [isCodeStale, setIsCodeStale] = useStore(useShallow((s) => [s.isCodeStale, s.setIsCodeStale]));

  const [editorHeight, setEditorHeight] = useState(0);
  const [editorWidth, setEditorWidth] = useState(0);

  const editorRef = useRef<HTMLDivElement | null>(null);

  const resizeEditorLayout = useCallback((width: number, height: number) => {
    setEditorWidth(width);
    setEditorHeight(height);
  }, []);

  const { containerRef } = useResponsiveLayout(resizeEditorLayout);

  const saveCode = useCallback(() => {
    if (!problem || !isCodeStale) {
      return;
    }

    const { code } = useStore.getState();

    window.electron.ipcRenderer.sendMessage('save-code', {
      data: { number: problem.number, language: editorLanguage, code },
    });

    setIsCodeStale(false);
  }, [editorLanguage, isCodeStale, problem, setIsCodeStale]);

  const extensions = useMemo(() => {
    const tmp: Extension[] = [];

    tmp.push(keymap.of([{ key: 'Tab', run: acceptCompletion }, indentWithTab]));
    tmp.push(
      keymap.of([
        {
          key: 'Ctrl-s',
          run: () => {
            saveCode();
            return false;
          },
        },
      ]),
    );
    tmp.push(
      keymap.of([
        {
          key: 'Meta-s',
          run: () => {
            saveCode();
            return false;
          },
        },
      ]),
    );

    const FontTheme = EditorView.theme({
      '.cm-content': {
        fontSize: `${editorFontSize}px`,
        fontFamily: 'hack',
      },
      '.cm-gutters': {
        fontSize: `${editorFontSize}px`,
        fontFamily: 'hack',
      },
    });

    tmp.push(FontTheme);

    switch (editorLanguage) {
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

    if (editorMode === 'vim') {
      tmp.push(vim());
    }

    return tmp;
  }, [editorFontSize, editorLanguage, editorMode, saveCode]);

  const { setContainer, setState, state, view } = useCodeMirror({
    extensions,
    value: editorCode,
    width: `${editorWidth}px`,
    height: `${editorHeight}px`,
    indentWithTab: false,
    basicSetup: {
      tabSize: editorIndentSpace,
    },
    onChange: (code) => {
      setEditorCode(code);
    },
  });

  /**
   * CodeMirror 초기화
   */
  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current);
    }
  }, [setContainer]);

  /**
   * 로딩 된 소스코드를 반영하는 ipc 이벤트 초기화
   */
  useEffect(() => {
    window.electron.ipcRenderer.on('load-code-result', ({ data: { code } }) => {
      setEditorCode(code);

      if (editorRef.current) {
        /**
         * 이전 히스토리를 삭제하기 위해, 현재 상태를 기반으로 새로운 상태 객체를 생성
         */
        setState(
          EditorState.create({
            ...state,
          }),
        );
      }
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('load-code-result');
    };
  }, [setEditorCode, setState, state]);

  /**
   * 코드가 변경 될 경우, 코드 저장 관련 기능을 활성화
   */
  useEffect(() => {
    setIsCodeStale(true);
  }, [editorCode, setIsCodeStale]);

  /**
   * 문제, 확장자가 변경되면 소스코드를 로딩, 기존의 코드를 저장
   */
  useEffect(() => {
    if (!problem) {
      return () => {};
    }

    window.electron.ipcRenderer.sendMessage('load-code', {
      data: { number: problem.number, language: editorLanguage },
    });

    return () => {
      const { code } = useStore.getState();

      window.electron.ipcRenderer.sendMessage('save-code', {
        data: { number: problem.number, language: editorLanguage, code, silence: true },
      });
    };
  }, [problem, editorLanguage]);

  /**
   * Vim(:w) 코드 저장 이벤트 등록
   */
  useEffect(() => {
    Vim.defineEx('write', 'w', saveCode);
  }, [saveCode]);

  useEffect(() => {
    if (!view) {
      return () => {};
    }

    // TODO: react-codemirror와 타입 다른 이슈 수정
    // @ts-ignore
    const cm = getCM(view);

    if (!cm) {
      return () => {};
    }

    const handleVimModeChange = (data: any) => {
      if ('mode' in data && typeof data.mode === 'string') {
        useStore.getState().setVimMode(data.mode);
      }
    };

    cm.on('vim-mode-change', handleVimModeChange);

    return () => {
      cm.off('vim-mode-change', handleVimModeChange);
    };
  }, [view]);

  /**
   * autoComplete 모달이 있을 경우에도 esc키 입력 시 Vim 일반 모드로 진입되게끔 이벤트 등록
   */
  useEffect(() => {
    const editor = editorRef.current;

    if (!editor) {
      return () => {};
    }

    const editorKeyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && view) {
        // TODO: react-codemirror와 타입 다른 이슈 수정
        // @ts-ignore
        const cm = getCM(view);

        if (cm) {
          Vim.exitInsertMode(cm);
        }
      }
    };

    editor.addEventListener('keydown', editorKeyDownHandler);

    return () => {
      editor.removeEventListener('keydown', editorKeyDownHandler);
    };
  }, [saveCode, view]);

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;

        .cm-tooltip {
          z-index: ${zIndex.editor.tooltip} !important;
        }
      `}
      ref={containerRef}
    >
      <div ref={editorRef} />
    </div>
  );
}
