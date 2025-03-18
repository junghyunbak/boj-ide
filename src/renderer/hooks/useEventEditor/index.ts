import { useEffect, useRef } from 'react';

import { Vim, getCM } from '@replit/codemirror-vim';
import { redo } from '@codemirror/commands';

import { useStore } from '@/renderer/store';

import { useModifyEditor } from '../useModifyEditor';
import { useEventIpc } from '../useEventIpc';
import { useEditor } from '../useEditor';
import { useEventElement } from '../useEventElement';
import { useEventWindow } from '../useEventWindow';
import { useModifyVim } from '../useModifyVim';

export function useEventEditor() {
  const curFocusRef = useRef<Element | null>(null);
  const lastFocusRef = useRef<Element | null>(null);

  const { editorView } = useEditor();

  const { saveFile, getEditorValue } = useModifyEditor();
  const { updateVimMode } = useModifyVim();

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
      return function cleanup() {};
    }

    const cm = getCM(editorView);

    if (!cm) {
      return () => {};
    }

    const handleVimModeChange = (data: any) => {
      if ('mode' in data && typeof data.mode === 'string') {
        updateVimMode(data.mode);
      }
    };

    cm.on('vim-mode-change', handleVimModeChange);

    return function cleanup() {
      cm.off('vim-mode-change', handleVimModeChange);
    };
  }, [updateVimMode, editorView]);

  /**
   * Ctrl + R 단축키를 누르면 코드를 실행하는 이벤트 등록
   *
   * mac의 경우 기존 ctrl+r 에 cmd+r까지 redo가 동작하게 됨.
   * */
  useEventIpc(
    () => {
      const { mode, vimMode } = useStore.getState();

      if (editorView && mode === 'vim' && /normal/i.test(vimMode)) {
        /**
         * 의존성 타입 꼬임으로 인해 타입 에러 발생
         * codemirror/state 타입 에러 : Two different types with this name exist, but they are unrelated.
         */
        redo(editorView);
      }
    },
    [editorView],
    'ctrl-or-cmd-r-pressed',
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

  useEventWindow(
    () => {
      if (curFocusRef.current !== document.activeElement) {
        curFocusRef.current = document.activeElement;
      }
    },
    [],
    'click',
  );

  useEventWindow(
    () => {
      lastFocusRef.current = curFocusRef.current;
    },
    [],
    'blur',
  );

  useEventWindow(
    () => {
      setTimeout(() => {
        const $view = editorView?.contentDOM;

        const isNoFocus = document.activeElement === document.body;

        if ($view && $view === lastFocusRef.current && isNoFocus) {
          $view.focus();
        }
      }, 50);
    },
    [editorView],
    'focus',
  );
}
