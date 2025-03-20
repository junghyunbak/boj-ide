import { useCallback, useEffect } from 'react';

import { EditorState, StateEffect } from '@codemirror/state';
import { EditorView } from '@codemirror/view';

import { useModifyEditor } from '../useModifyEditor';
import { useProblem } from '../useProblem';
import { useEditor } from '../useEditor';
import { useCmExtensions } from './useCmExtensions';
import { useSetting } from '../useSetting';

export function useSetupEditor() {
  const { problem } = useProblem();
  const { isSetting } = useSetting();
  const { editorRef, editorState, editorLanguage, editorView } = useEditor();
  const { extensions } = useCmExtensions();

  const { updateEditorState, updateEditorView, getEditorValue, updateProblemToStale, setEditorValue } =
    useModifyEditor();

  const createEditorState = useCallback(
    (initialCode: string) => {
      const newEditorState = EditorState.create({
        doc: initialCode,
        extensions,
      });

      return newEditorState;
    },
    [extensions],
  );

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

    updateEditorView(newEditorView);

    return function cleanup() {
      newEditorView.destroy();
    };
  }, [editorRef, editorState, updateEditorView]);

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

      // TEST: 작성중이던 코드가 존재하면 이를 사용한다.
      // TEST: 작성중이던 코드가 존재하면 불러온 코드와 다를 경우에만 코드를 stale한 상태로 변경한다.
      // TEST: 작성중이던 코드가 존재하지 않으면 불러온 데이터를 사용한다.
      // TEST: 작성중이던 코드가 존재하지 않으면 fresh한 상태로 업데이트 한다.
      // TEST: 불러온 데이터로 문제 번호/언어 별 코드를 변경시켜야 한다.

      if (typeof latestCode === 'string') {
        updateEditorState(createEditorState(latestCode));
        updateProblemToStale(problem, editorLanguage, true);
      } else {
        updateEditorState(createEditorState(code));
        updateProblemToStale(problem, editorLanguage, false);
        setEditorValue(problem, editorLanguage, code);
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

  /**
   * 설정 창이 닫히면 자등으로 뷰에 포커스
   */
  useEffect(() => {
    if (!isSetting && editorView) {
      editorView.focus();
    }
  }, [isSetting, editorView]);
}
