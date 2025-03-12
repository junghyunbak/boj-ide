import { useRef } from 'react';

import {
  useFabric,
  usePaint,
  useModifyPaint,
  useEventPaint,
  useSetupFabric,
  useEventFabric,
  useEventSyncLayout,
  useModifyFabric,
} from '@/renderer/hooks';

import { PaintLayout } from './index.style';

import { EditorPaintController } from '../EditorPaintController';

// [ ]: 요소를 선택하고 delete 키를 입력하면 요소가 삭제되어야한다.
// [ ]: v키를 입력하면 모드가 'select'로 변경되어야한다.
export function EditorPaint() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { isExpand } = usePaint();
  const { canvasRef } = useFabric();

  const { handlePaintBlur } = useModifyPaint();
  const { updateFabricCanvasSize } = useModifyFabric();

  useSetupFabric(canvasRef);

  useEventPaint();
  useEventFabric();
  useEventSyncLayout(updateFabricCanvasSize, containerRef);

  return (
    <PaintLayout isExpand={isExpand} tabIndex={0} ref={containerRef} onBlur={handlePaintBlur}>
      <canvas ref={canvasRef} />

      <EditorPaintController />
    </PaintLayout>
  );
}
