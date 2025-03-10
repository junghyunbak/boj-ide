import { useEffect } from 'react';

import { useCodeMirror } from '@uiw/react-codemirror';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyEditor } from '../useModifyEditor';
import { useProblem } from '../useProblem';

export function useSetupEditor({
  editorRef,
  setContainer,
}: ReturnType<typeof useCodeMirror> & { editorRef: React.MutableRefObject<HTMLDivElement | null> }) {
  const { problem } = useProblem();

  const [lang] = useStore(useShallow((s) => [s.lang]));

  const { saveEditorCode } = useModifyEditor();

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
        data: { number: problem.number, language: lang },
      });
    }

    return () => {
      saveEditorCode({ silence: true });
    };
  }, [problem, lang, saveEditorCode]);
}
