import { useEffect, useRef } from 'react';

import { useCodeMirror, EditorState } from '@uiw/react-codemirror';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useEditorExtensions } from '../useEditorExtensions';
import { useEditorController } from '../useEditorController';

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
   */
  useEffect(() => {
    if (problem) {
      window.electron.ipcRenderer.invoke('load-code', {
        data: { number: problem.number, language: lang },
      });
    }
  }, [problem, lang]);

  useEffect(() => {
    // invoke 반환값을 사용하지 않고, 채널을 만들어 초기화하는 이유는 useEffect 순환 실행을 피하기 위함.
    window.electron.ipcRenderer.on('load-code-result', ({ data: { code } }) => {
      initialEditorCode(code);
      setState(EditorState.create({ ...state }));
    });

    return function cleanup() {
      window.electron.ipcRenderer.removeAllListeners('load-code-result');
    };
  }, [state, setState, initialEditorCode]);

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
