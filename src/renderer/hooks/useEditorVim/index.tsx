import { useEffect } from 'react';

import { redo } from '@codemirror/commands';
import { type EditorView } from '@codemirror/view';
import { Vim, getCM } from '@replit/codemirror-vim';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useEditorCodeSave } from '@/renderer/hooks/useEditorCodeSave';

export function useEditorVim({
  editorRef,
  view,
}: {
  editorRef: React.MutableRefObject<HTMLDivElement | null>;
  view: EditorView | undefined;
}) {
  const [setVimMode] = useStore(useShallow((s) => [s.setVimMode]));

  const { saveEditorCode } = useEditorCodeSave();

  /**
   * Vim(:w) 코드 저장 이벤트 등록
   */
  useEffect(() => {
    Vim.defineEx('write', 'w', saveEditorCode);
  }, [saveEditorCode]);

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
  }, [editorRef, view]);

  /**
   * vim 모드 상태 전역 상태 동기화
   */
  useEffect(() => {
    if (!view) {
      return () => {};
    }

    const cm = getCM(view);

    if (!cm) {
      return () => {};
    }

    const handleVimModeChange = (data: any) => {
      if ('mode' in data && typeof data.mode === 'string') {
        setVimMode(data.mode);
      }
    };

    cm.on('vim-mode-change', handleVimModeChange);

    return () => {
      cm.off('vim-mode-change', handleVimModeChange);
    };
  }, [setVimMode, view]);

  /**
   * Ctrl + R 단축키를 누르면 코드를 실행하는 이벤트 등록
   *
   * mac의 경우 기존 ctrl+r 에 cmd+r까지 redo가 동작하게 됨.
   * */
  useEffect(() => {
    window.electron.ipcRenderer.on('ctrl-or-cmd-r-pressed', () => {
      const { mode, vimMode } = useStore.getState();

      if (view && mode === 'vim' && /normal/i.test(vimMode)) {
        /**
         * 의존성 타입 꼬임으로 인해 타입 에러 발생
         * codemirror/state 타입 에러 : Two different types with this name exist, but they are unrelated.
         */
        // @ts-ignore
        redo(view);
      }
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('ctrl-or-cmd-r-pressed');
    };
  }, [view]);
}
