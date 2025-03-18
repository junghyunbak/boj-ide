import { useEffect } from 'react';

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
  const { editorRef, editorCode, editorState, editorLanguage, editorView } = useEditor();
  const { extensions } = useCmExtensions();

  const { saveFile, updateEditorState, updateEditorView, initialEditorCode } = useModifyEditor();

  /**
   * codemirror 상태 초기화 및 재생성
   */
  useEffect(() => {
    const newEditorState = EditorState.create({
      doc: editorCode,
      extensions,
    });

    updateEditorState(newEditorState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    /**
     * editorCode가 변경되는 경우
     *
     * - 문제가 변경되어 파일을 읽어들이는 경우
     * - AI 표준입력 코드 생성으로 인해 코드가 초기화되는 경우
     *
     * 두 경우에 기존 히스토리가 제거되어야 하므로 의존성 배열에 추가
     */
    editorCode,
    updateEditorState,
    /**
     * extensions가 변경될 때 마다 상태가 재생성되면
     * 코드, 히스토리 등 현재 상태가 없어지기 때문에 의존성 배열에서 고의적으로 제거
     */
    // ,extensions
  ]);

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

          initialEditorCode(code);
        }
      }
    })();

    return function cleanup() {
      saveFile({ problem, language: editorLanguage, silence: true });
    };
  }, [problem, editorLanguage, saveFile, initialEditorCode]);

  /**
   * 설정 창이 닫히면 자등으로 뷰에 포커스
   */
  useEffect(() => {
    if (!isSetting && editorView) {
      editorView.focus();
    }
  }, [isSetting, editorView]);
}
