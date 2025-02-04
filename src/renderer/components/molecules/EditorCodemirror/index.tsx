import { useState, useCallback } from 'react';

import { css } from '@emotion/react';

import { useResponsiveLayout, useEditor, useEditorVim } from '@/renderer/hooks';

import { zIndex } from '@/renderer/styles';

export function EditorCodemirror() {
  const [editorWidth, setEditorWidth] = useState(0);
  const [editorHeight, setEditorHeight] = useState(0);

  const resizeEditorLayout = useCallback((width: number, height: number) => {
    setEditorWidth(width);
    setEditorHeight(height);
  }, []);

  const { containerRef } = useResponsiveLayout(resizeEditorLayout);

  const { editorRef, view } = useEditor({
    width: editorWidth,
    height: editorHeight,
  });

  /**
   * 의존성 타입 꼬임으로 인해 타입 에러 발생
   * codemirror/view 타입 에러 : Two different types with this name exist, but they are unrelated.
   */
  // @ts-ignore
  useEditorVim({ editorRef, view });

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;

        .cm-tooltip {
          z-index: ${zIndex.editor.tooltip} !important;
        }
      `}
      ref={containerRef}
    >
      <div ref={editorRef} />
    </div>
  );
}
