import { useEffect } from 'react';

import { useCodeMirror } from '@uiw/react-codemirror';

import { useModifyEditor } from '../useModifyEditor';
import { useProblem } from '../useProblem';
import { useEditor } from '../useEditor';

export function useSetupEditor() {
  const { problem } = useProblem();
  const { editorRef, editorCode, extensions, editorWidth, editorHeight, editorIndentSpace, editorLanguage } =
    useEditor();

  const { saveFile, syncEditorCode, getEditorValue, updateEditorState, updateEditorView, updateSetEditorState } =
    useModifyEditor();

  const { state, view, setState, setContainer } = useCodeMirror({
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

  /**
   * 에디터 렌더링
   */
  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current);
    }
  }, [setContainer, editorRef]);

  /**
   * 에디터 상태 전역으로 동기화
   */
  useEffect(() => {
    updateEditorState(state);
    updateEditorView(view);
    updateSetEditorState(setState);
  }, [updateEditorState, state, updateEditorView, view, updateSetEditorState, setState]);

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
}
