import { useEffect } from 'react';

import { StateEffect } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { useModifyEditor } from '../useModifyEditor';
import { useProblem } from '../useProblem';
import { useEditor } from '../useEditor';
import { useCmExtensions } from './useCmExtensions';
import { useSetting } from '../useSetting';
import { useModifyStale } from '../useModifyStale';

export function useSetupEditor() {
  const { problem } = useProblem();
  const { isSetting } = useSetting();
  const { editorRef, editorState, editorLanguage, editorView } = useEditor();
  const { extensions } = useCmExtensions();

  const { updateEditorState, updateEditorView, getEditorValue, setEditorValue, createEditorState } = useModifyEditor();
  const { updateProblemToStale } = useModifyStale();

  /**
   * codemirror 상태 초기화 및 재생성
   */
  useEffect(() => {
    const newEditorState = createEditorState('');

    updateEditorState(newEditorState);
  }, [createEditorState, updateEditorState]);

  /**
   * extensions 변경 시 업데이트
   */
  useEffect(() => {
    if (editorView) {
      editorView.dispatch({ effects: StateEffect.reconfigure.of(extensions) });
    }
  }, [extensions, editorView]);

  /**
   * codemirror 뷰 생성 및 제거
   */
  useEffect(() => {
    if (!editorRef.current) {
      return function cleanup() {};
    }

    const newEditorView = new EditorView({
      state: editorState,
      parent: editorRef.current,
    });

    newEditorView.contentDOM.setAttribute('data-testid', 'cm-editor');

    updateEditorView(newEditorView);

    return function cleanup() {
      newEditorView.destroy();
    };
  }, [editorRef, editorState, updateEditorView]);

  /**
   * 설정 창이 닫히면 자등으로 뷰에 포커스
   */
  useEffect(() => {
    if (!isSetting && editorView) {
      editorView.focus();
    }
  }, [isSetting, editorView]);

  /**
   * 문제, 언어 변경 시
   *
   * - 기존 코드 저장
   * - 새로운 코드 로딩
   */
  useEffect(() => {
    if (!problem) {
      return;
    }

    (async () => {
      const response = await window.electron.ipcRenderer.invoke('load-code', {
        data: { number: problem.number, language: editorLanguage },
      });

      if (!response) {
        return;
      }

      const {
        data: { code },
      } = response;

      const latestCode = getEditorValue(problem, editorLanguage);

      if (typeof latestCode === 'string') {
        updateEditorState(createEditorState(latestCode));

        updateProblemToStale(problem, editorLanguage, latestCode !== code);
      } else {
        setEditorValue(problem, editorLanguage, code);

        updateEditorState(createEditorState(code));
      }
    })();
  }, [
    problem,
    editorLanguage,
    getEditorValue,
    updateProblemToStale,
    createEditorState,
    updateEditorState,
    setEditorValue,
  ]);
}
