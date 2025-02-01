import { useEffect, useRef } from 'react';
import { useCodeMirror, EditorState } from '@uiw/react-codemirror';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useEditorController, useEditorExtensions } from '@/renderer/hooks';

/**
 * code mirror 주요 기능과 관련된 로직만 처리
 *
 * - editorRef
 * - view
 *
 * vim, dom 단축키와 같은 로직은 내보내기 한 요소들을 가지고 추가적인 훅에서 처리
 */

// [ ]: 문제/언어 변경 시 히스토리가 존재하지 않아야 함.
export function useEditor({ width, height }: { width: number; height: number }) {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [lang] = useStore(useShallow((s) => [s.lang]));
  const [indentSpace] = useStore(useShallow((s) => [s.indentSpace]));
  const [editorCode] = useStore(useShallow((s) => [s.code]));

  const { saveEditorCode, initialEditorCode, updateEditorCode } = useEditorController();
  const { extensions } = useEditorExtensions();

  const editorRef = useRef<HTMLDivElement | null>(null);

  const { setContainer, setState, state, view } = useCodeMirror({
    value: editorCode,
    extensions,
    width: `${width}px`,
    height: `${height}px`,
    indentWithTab: false,
    basicSetup: {
      tabSize: indentSpace,
    },
    onChange: updateEditorCode,
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
  }, [problem, lang, setState, initialEditorCode]);

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
