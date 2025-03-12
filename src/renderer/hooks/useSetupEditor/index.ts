import { useEffect, useRef } from 'react';

import { useCodeMirror } from '@uiw/react-codemirror';

import { useModifyEditor } from '../useModifyEditor';
import { useProblem } from '../useProblem';
import { useEditor } from '../useEditor';

export function useSetupEditor() {
  const { problem } = useProblem();
  const { editorRef, editorCode, extensions, editorWidth, editorHeight, editorIndentSpace, editorLanguage } =
    useEditor();

  const { saveFile, syncEditorCode, getEditorValue } = useModifyEditor();

  const codemirror = useCodeMirror({
    value: editorCode,
    extensions,
    width: `${editorWidth}px`,
    height: `${editorHeight}px`,
    indentWithTab: false,
    theme: 'none',
    basicSetup: {
      tabSize: editorIndentSpace,
      highlightActiveLineGutter: false,
      foldGutter: false,
    },
    onChange: syncEditorCode,
  });

  const { setContainer } = codemirror;

  /**
   * 에디터 초기화
   */
  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current);
    }
  }, [editorRef, setContainer]);

  /**
   * 문제/언어가 변경되면
   *
   * - 기존 코드 저장
   * - 새로운 코드 로딩
   */
  useEffect(() => {
    if (problem) {
      window.electron.ipcRenderer.invoke('load-code', {
        data: { number: problem.number, language: editorLanguage },
      });
    }

    return function cleanup() {
      saveFile({ problem, language: editorLanguage, silence: true });
    };
  }, [problem, editorLanguage, saveFile, getEditorValue]);

  return {
    codemirror,
    editorRef,
  };
}
