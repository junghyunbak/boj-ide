import { useEffect } from 'react';

import { Vim, getCM } from '@replit/codemirror-vim';
import { EditorState } from '@uiw/react-codemirror';

import { useStore } from '@/renderer/store';

import { useModifyEditor } from '../useModifyEditor';
import { useEventIpc } from '../useEventIpc';
import { useEditor } from '../useEditor';
import { useEventElement } from '../useEventElement';

export function useEventEditor() {
  const { editorRef, editorView, editorState, setEditorState } = useEditor();

  const { saveFile, initialEditorCode, getEditorValue, updateEditorVimMode } = useModifyEditor();

  /**
   * Vim(:w) 코드 저장 이벤트 등록
   */
  useEffect(() => {
    const handleVimWriteCommand = () => {
      saveFile();
    };

    Vim.defineEx('write', 'w', handleVimWriteCommand);
  }, [saveFile, getEditorValue]);

  /**
   * vim 모드 상태 전역 상태 동기화
   */
  useEffect(() => {
    if (!editorView) {
      return () => {};
    }

    /**
     * 의존성 타입 꼬임으로 인해 타입 에러 발생
     * codemirror/state 타입 에러 : Two different types with this name exist, but they are unrelated.
     */
    // @ts-ignore
    const cm = getCM(editorView);

    if (!cm) {
      return () => {};
    }

    const handleVimModeChange = (data: any) => {
      if ('mode' in data && typeof data.mode === 'string') {
        updateEditorVimMode(data.mode);
      }
    };

    cm.on('vim-mode-change', handleVimModeChange);

    return () => {
      cm.off('vim-mode-change', handleVimModeChange);
    };
  }, [updateEditorVimMode, editorView]);

  /**
   * Ctrl + R 단축키를 누르면 코드를 실행하는 이벤트 등록
   *
   * mac의 경우 기존 ctrl+r 에 cmd+r까지 redo가 동작하게 됨.
   * */
  useEventIpc(
    () => {
      window.electron.ipcRenderer.on('ctrl-or-cmd-r-pressed', () => {
        const { mode, vimMode } = useStore.getState();

        if (editorView && mode === 'vim' && /normal/i.test(vimMode)) {
          /**
           * 의존성 타입 꼬임으로 인해 타입 에러 발생
           * codemirror/state 타입 에러 : Two different types with this name exist, but they are unrelated.
           */
          // @ts-ignore
          redo(editorView);
        }
      });
    },
    [editorView],
    'ctrl-or-cmd-r-pressed',
  );

  /**
   * autoComplete 모달이 있을 경우에도 esc키 입력 시 Vim 일반 모드로 진입되게끔 이벤트 등록
   */
  useEventElement(
    (e) => {
      if (e.key === 'Escape' && editorView) {
        /**
         * 의존성 타입 꼬임으로 인해 타입 에러 발생
         * codemirror/view 타입 에러 : Two different types with this name exist, but they are unrelated.
         */
        // @ts-ignore
        const cm = getCM(editorView);

        if (cm) {
          Vim.exitInsertMode(cm);
        }
      }
    },
    [editorView],
    'keydown',
    editorRef.current,
  );

  /**
   * codemirror -> webview -> App
   *                       ^
   *                        여기서 포커스가 올바르게 복구되지 않는 문제 존재.
   *
   * codemirror -> webview -> App
   *            ^
   *            여기서 실행되는 blur 이벤트에서 포커스를 초기화 함.
   */
  useEventElement(
    (e) => {
      if (e.target instanceof HTMLElement) {
        e.target.blur();
      }
    },
    [],
    'blur',
    editorView?.contentDOM,
  );

  /**
   * 코드 초기화 이벤트 등록
   *
   * 코드 초기화 시 codemirror state가 사용되기 때문에,
   * useEffect에서 invoke의 응답값으로 상태를 초기화 할 경우 순환 실행이 발생하여
   * on 이벤트로 초기화 하도록 구현
   */
  useEventIpc(
    ({ data: { code } }) => {
      initialEditorCode(code);

      if (setEditorState) {
        setEditorState(EditorState.create({ ...editorState }));
      }
    },
    [editorState, initialEditorCode, setEditorState],
    'load-code-result',
  );
}
