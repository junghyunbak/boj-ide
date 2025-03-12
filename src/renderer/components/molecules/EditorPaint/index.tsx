import { useCallback } from 'react';

import { usePaint, useModifyPaint, useEventPaint, useSetupPaint, useEventSyncLayout } from '@/renderer/hooks';

import { EditorPaintController } from '@/renderer/components/molecules/EditorPaintController';

import { PaintLayout } from './index.style';

export function EditorPaint() {
  const { isExpand, paintRef, canvasRef } = usePaint();

  const { backupPaint, updatePaintLayout } = useModifyPaint();

  useSetupPaint();

  useEventPaint();
  useEventSyncLayout(updatePaintLayout, paintRef);

  const handlePaintBlur = useCallback(() => {
    backupPaint();
  }, [backupPaint]);

  return (
    <PaintLayout ref={paintRef} isExpand={isExpand} tabIndex={0}>
      <canvas ref={canvasRef} onBlur={handlePaintBlur} />

      <EditorPaintController />
    </PaintLayout>
  );
}
