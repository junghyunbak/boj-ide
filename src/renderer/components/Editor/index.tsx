import { css } from '@emotion/react';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { EditorPlaceholder } from './EditorPlaceholder';
import { EditorCodemirror } from './EditorCodemirror';

export function Editor() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [lang] = useStore(useShallow((s) => [s.lang]));

  const containerRef = useRef<HTMLDivElement | null>(null);

  /**
   * 문제, 확장자가 변경되면 소스코드를 로딩, 기존의 코드를 저장
   */
  useEffect(() => {
    if (!problem) {
      return () => {};
    }

    window.electron.ipcRenderer.sendMessage('load-code', { data: { number: problem.number, language: lang } });

    return () => {
      window.electron.ipcRenderer.sendMessage('save-code', {
        data: { number: problem.number, language: lang, code: useStore.getState().code, silence: true },
      });
    };
  }, [problem, lang]);

  return (
    <div
      ref={containerRef}
      css={css`
        width: 100%;
        height: 100%;
      `}
    >
      {!problem ? <EditorPlaceholder /> : <EditorCodemirror containerRef={containerRef} />}
    </div>
  );
}
