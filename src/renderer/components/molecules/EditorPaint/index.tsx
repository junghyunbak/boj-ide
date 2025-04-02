import { usePaint, useModifyPaint, useEventPaint, useSetupPaint, useEventSyncLayout } from '@/renderer/hooks';

import { EditorPaintController } from '@/renderer/components/molecules/EditorPaintController';

import { PaintLayout } from './index.style';
import { CaptureCodeButton } from '../CaptureCodeButton';

export function EditorPaint() {
  const { isExpand, paintRef, canvasRef } = usePaint();

  const { updatePaintLayout } = useModifyPaint();

  useSetupPaint();

  useEventPaint();
  useEventSyncLayout(updatePaintLayout, paintRef);

  return (
    <PaintLayout ref={paintRef} isExpand={isExpand} tabIndex={0}>
      <canvas ref={canvasRef} />

      <EditorPaintController />
      <CaptureCodeButton />
    </PaintLayout>
  );
}
