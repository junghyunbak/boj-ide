import { useEffect, useRef } from 'react';

import { useCodeMirror, EditorState } from '@uiw/react-codemirror';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useEditorExtensions } from '../useEditorExtensions';
import { useEditorController } from '../useEditorController';
import { useIpcEvent } from '../useIpcEvent';

export function useEditor({ width, height }: { width: number; height: number }) {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [lang] = useStore(useShallow((s) => [s.lang]));
  const [indentSpace] = useStore(useShallow((s) => [s.indentSpace]));
  const [editorCode] = useStore(useShallow((s) => [s.code]));

  const { saveEditorCode, initialEditorCode, syncEditorCode } = useEditorController();
  const { extensions, codemirrorTheme } = useEditorExtensions();

  const editorRef = useRef<HTMLDivElement | null>(null);

  const { setContainer, setState, state, view } = useCodeMirror({
    value: editorCode,
    extensions,
    width: `${width}px`,
    height: `${height}px`,
    indentWithTab: false,
    theme: codemirrorTheme,
    basicSetup: {
      tabSize: indentSpace,
      highlightActiveLineGutter: false,
      foldGutter: false,
    },
    onChange: syncEditorCode,
  });

  /**
   * 에디터 초기화
   */
  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current);
    }
  }, [setContainer]);

  /**
   * codemirror -> webview -> App
   *                       ^
   *                        여기서 포커스가 올바르게 복구되지 않는 문제 존재.
   *
   * codemirror -> webview -> App
   *            ^
   *            여기서 실행되는 blur 이벤트에서 포커스를 초기화 함.
   */
  useEffect(() => {
    const $cmContent = document.querySelector('.cm-content');

    if (!($cmContent instanceof HTMLDivElement)) {
      return function cleanup() {};
    }

    const handleCmContentBlur = () => {
      $cmContent.blur();
    };

    $cmContent.addEventListener('blur', handleCmContentBlur);

    return function cleanup() {
      $cmContent.removeEventListener('blur', handleCmContentBlur);
    };
  }, [view]);

  /**
   * 문제/언어가 변경되면
   *
   * - 히스토리 제거
   * - 새로운 문제/언어의 코드를 불러와 초기화
   *
   * 코드 초기화 시 codemirror state가 사용되기 때문에,
   * useEffect에서 invoke의 응답값으로 상태를 초기화 할 경우 순환 실행이 발생하여
   * on 이벤트로 초기화 하도록 구현
   */
  useEffect(() => {
    if (problem) {
      window.electron.ipcRenderer.invoke('load-code', {
        data: { number: problem.number, language: lang },
      });
    }
  }, [problem, lang]);

  useIpcEvent(
    ({ data: { code } }) => {
      initialEditorCode(code);
      setState(EditorState.create({ ...state }));
    },
    [initialEditorCode, setState, state],
    'load-code-result',
  );

  /**
   * 문제/언어가 변경되면
   *
   * - 기존 문제/언어의 코드를 저장
   */
  useEffect(() => {
    return () => {
      saveEditorCode({ silence: true });
    };
  }, [problem, lang, saveEditorCode]);

  return { editorRef, view };
}
