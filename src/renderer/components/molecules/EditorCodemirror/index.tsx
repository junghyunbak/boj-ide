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
      css={(theme) => css`
        width: 100%;
        height: 100%;

        .cm-tooltip {
          z-index: ${zIndex.editor.tooltip} !important;
        }

        .cm-gutter {
          padding: 0 10px 0 17px;
        }

        .cm-fat-cursor {
          background: ${theme.editor.colors.cursor} !important;
        }

        .cm-editor:not(.cm-focused) .cm-fat-cursor {
          outline: solid 1px ${theme.editor.colors.cursor} !important;
          background: transparent !important;
        }

        .cm-scroller::-webkit-scrollbar {
          width: 7px;
          height: 7px;
        }

        .cm-scroller::-webkit-scrollbar-thumb {
          background: ${theme.colors.scrollbar};
        }

        .cm-scroller::-webkit-scrollbar-corner {
          background: transparent;
        }

        .cm-panels {
          background-color: transparent;
          border-top: 1px solid ${theme.colors.border};
        }

        .cm-vim-panel {
          padding: 5px 10px;
        }

        .cm-panels input {
          color: ${theme.colors.fg} !important;
          font-family: hack;
        }
      `}
      ref={containerRef}
    >
      <div ref={editorRef} />
    </div>
  );
}
