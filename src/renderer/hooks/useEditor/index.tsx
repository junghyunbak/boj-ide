import { useEffect, useRef } from 'react';
import { useCodeMirror, EditorState } from '@uiw/react-codemirror';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useEditorCodeSave } from '@/renderer/hooks/useEditorCodeSave';
import { useEditorExtensions } from '../useEditorExtensions';

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
  const [editorCode, setEditorCode] = useStore(useShallow((s) => [s.code, s.setCode]));
  const [setIsCodeStale] = useStore(useShallow((s) => [s.setIsCodeStale]));
  const [setProblemToCode] = useStore(useShallow((s) => [s.setProblemToCode]));

  const { saveEditorCode } = useEditorCodeSave(true);
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
    onChange: (value) => {
      if (problem) {
        setIsCodeStale(true);
        setProblemToCode(problem.number, value);
      }
    },
  });

  /**
   * 초기화 코드(editorCode)가 변경되면 저장할 수 있도록 상태 변경
   */
  useEffect(() => {
    setIsCodeStale(true);
  }, [editorCode, setIsCodeStale]);

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
    (async () => {
      if (problem) {
        const res = await window.electron.ipcRenderer.invoke('load-code', {
          data: { number: problem.number, language: lang },
        });

        if (res) {
          const {
            data: { code },
          } = res;

          setState(EditorState.create({ ...state }));
          setEditorCode(code);
          setProblemToCode(problem.number, code);
        }
      }
    })();
    // 처음 생성된 codemirror의 state를, 히스토리 초기화에 이용하기 위해 의존성 배열에 추가히자 않음.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem, lang, setState, setProblemToCode, setEditorCode]);

  /**
   * 문제/언어가 변경되면
   *
   * - 기존 문제/언어의 코드를 저장
   */
  useEffect(() => {
    return () => {
      saveEditorCode();
    };
  }, [problem, lang, saveEditorCode]);

  return { editorRef, view };
}
