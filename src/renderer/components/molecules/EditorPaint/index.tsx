import { useFabricCanvas, usePaint, usePaintController } from '@/renderer/hooks';

import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { PaintLayout } from './index.style';

import { EditorPaintController } from '../EditorPaintController';

// [ ]: 요소를 선택하고 delete 키를 입력하면 요소가 삭제되어야한다.
// [ ]: v키를 입력하면 모드가 'select'로 변경되어야한다.
export function EditorPaint() {
  const [isExpand] = useFabricStore(useShallow((s) => [s.isExpand]));

  const { containerRef } = usePaint();
  const { canvasRef } = useFabricCanvas();
  const { handlePaintBlur } = usePaintController();

  return (
    <PaintLayout isExpand={isExpand} tabIndex={0} ref={containerRef} onBlur={handlePaintBlur}>
      <canvas ref={canvasRef} />

      <EditorPaintController />
    </PaintLayout>
  );
}
