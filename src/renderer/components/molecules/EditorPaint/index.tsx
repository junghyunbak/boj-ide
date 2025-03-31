import {
  usePaint,
  useModifyPaint,
  useEventPaint,
  useSetupPaint,
  useEventSyncLayout,
  useProblem,
} from '@/renderer/hooks';

import { EditorPaintController } from '@/renderer/components/molecules/EditorPaintController';

import { PaintLayout } from './index.style';
import { CaptureCodeButton } from '../CaptureCodeButton';

export function EditorPaint() {
  const { problem } = useProblem();
  const { isExpand, paintRef, canvasRef } = usePaint();

  const { backupPaint, updatePaintLayout } = useModifyPaint();

  useSetupPaint();

  useEventPaint();
  useEventSyncLayout(updatePaintLayout, paintRef);

  const handlePaintBlur = () => {
    backupPaint(problem);
  };

  return (
    <PaintLayout ref={paintRef} isExpand={isExpand} tabIndex={0} onBlur={handlePaintBlur}>
      <canvas ref={canvasRef} />

      <EditorPaintController />
      <CaptureCodeButton />
    </PaintLayout>
  );
}
