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

  const { saveCode, updateEditorState, updateEditorView, getEditorValue, updateProblemToStale } = useModifyEditor();

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
    (async () => {
      if (problem) {
        const result = await window.electron.ipcRenderer.invoke('load-code', {
          data: { number: problem.number, language: editorLanguage },
        });

        if (result) {
          const {
            data: { code },
          } = result;

          const latestCode = getEditorValue(problem, editorLanguage);

          if (latestCode === undefined || latestCode === null || latestCode === code) {
            updateEditorState(createEditorState(code));
            updateProblemToStale(problem, editorLanguage, false);
            return;
          }

          updateEditorState(createEditorState(latestCode));
          updateProblemToStale(problem, editorLanguage, true);
        }
      }
    })();

    return function cleanup() {
      /**
       * 문제 변경 시 파일을 읽어오는 시간이 걸릴 경우, 이전 문제의 코드를 장시간 보여줄 수 있기 때문에
       * 이를 초기화하는 코드를 작성
       */
    };
  }, [problem, editorLanguage, saveCode, getEditorValue, updateProblemToStale, createEditorState, updateEditorState]);

  /**
   * 설정 창이 닫히면 자등으로 뷰에 포커스
   */
  useEffect(() => {
    if (!isSetting && editorView) {
      editorView.focus();
    }
  }, [isSetting, editorView]);
}
