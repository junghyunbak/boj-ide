import { css } from '@emotion/react';

import { zIndex } from '@/renderer/styles';

import { usePaint, useModifyPaint, useEventPaint, useSetupPaint, useEventSyncLayout } from '@/renderer/hooks';

export function EditorPaint() {
  const { paintRef, canvasRef } = usePaint();

  const { updatePaintLayout } = useModifyPaint();

  useSetupPaint();

  useEventPaint();
  useEventSyncLayout(updatePaintLayout, paintRef);

  return (
    <div
      css={(theme) => css`
        width: 100%;
        height: 100%;

        background-color: ${theme.colors.bg};
        outline: none;
        overflow: hidden;

        &:focus {
          &::before {
            content: '';
          }
        }

        &::before {
          position: absolute;
          inset: 0;
          z-index: ${zIndex.paint.focusLine};
          pointer-events: none;
          border: 1px solid ${theme.colors.primarybg};
        }
      `}
      ref={paintRef}
      tabIndex={0}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
