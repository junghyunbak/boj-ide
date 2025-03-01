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
  const isEditorFocusedRef = useRef<boolean>(false);

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
   * 1. codemirror -> 외부 -> 앱
   * 2. codemirror -> webview -> 앱
   *
   * 2번 흐름의 경우 앱의 포커스를 마지막 포커스로 돌려놓게 되는데,
   *
   * 알 수 없는 내부적인 문제로 인하여, 화면은 새로운 요소가 포커스를 정상적으로 얻은 것 처럼 보이지만
   * 실제로는 이전 포커스 요소에 포커스가 존재하는 문제가 있다.
   *
   * 이를 해결하기 위해 webview로 포커스되기 전 발생하는 blur 이벤트에서 포커스를 명시적으로 제거해준다.
   *
   *
   * [UX 이슈 추가 2025.03.01]
   *
   * 앱을 전환할 경우 항상 codemirror가 포커스를 잃게 되어,
   * codemirror를 사용중이었다면 마우스를 다시 클릭해야하는 불편함이 있어 포커스를 복구하는 로직을 추가 구현했다.
   *
   * (1번 흐름에 해당된다.)
   */
  useEffect(() => {
    const $cmContent = document.querySelector('.cm-content');

    if (!($cmContent instanceof HTMLElement)) {
      return function cleanup() {};
    }

    const handleCmContentBlur = () => {
      isEditorFocusedRef.current = true;
      $cmContent.blur();
    };

    const handleWindowFocus = () => {
      /**
       * [복구 로직 동작 원리]
       *
       * codemirror에 포커스가 존재했을경우 blur 메서드가 필연적으로 실행되므로 포커스 요소가 document.body로 변한다.
       * 포커스 요소가 document.body일 경우에만, codemirror의 이전 포커스 여부를 확인하여 다시 포커스를 돌려놓는다.
       *
       * [setTimeout을 사용한 이유]
       *
       * 마우스 클릭으로 인해 앱이 활성화(focus)될 때, 현재 focus 요소를 가져올 수 없다는 문제가 있다.
       * 0ms의 setTimeout 함수로 래핑해 다음 이벤트 루프로 넘겨 document.activeElement를 올바르게 가져올 수 있도록 한다.
       */
      setTimeout(() => {
        if (document.activeElement === document.body && isEditorFocusedRef.current) {
          $cmContent.focus();
        }

        isEditorFocusedRef.current = false;
      }, 0);
    };

    window.addEventListener('focus', handleWindowFocus);
    $cmContent.addEventListener('blur', handleCmContentBlur);

    return function cleanup() {
      window.removeEventListener('focus', handleWindowFocus);
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
