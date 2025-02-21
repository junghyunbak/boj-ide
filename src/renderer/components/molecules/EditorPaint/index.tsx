import { css } from '@emotion/react';

import { useFabricCanvas, usePaint, usePaintController } from '@/renderer/hooks';

import { ReactComponent as Mouse } from '@/renderer/assets/svgs/mouse.svg';
import { ReactComponent as Hand } from '@/renderer/assets/svgs/hand.svg';
import { ReactComponent as Pencil } from '@/renderer/assets/svgs/pencil.svg';

import { ReactComponent as Expand } from '@/renderer/assets/svgs/expand.svg';
import { ReactComponent as Shrink } from '@/renderer/assets/svgs/shrink.svg';

import { useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import {
  PaintLayout,
  PaintControllerBox,
  PaintFabricControllerBox,
  PaintFabricControllerButton,
  PaintFabricControllerButtonGroupBox,
  ExpandShrinkButton,
} from './index.style';

const BRUSH_WIDTHS: BrushWidth[] = [2, 4, 8];
const BRUSH_COLORS: BrushColor[] = ['black', 'red', 'blue'];

// [ ]: 요소를 선택하고 delete 키를 입력하면 요소가 삭제되어야한다.
// [ ]: v키를 입력하면 모드가 'select'로 변경되어야한다.
export function EditorPaint() {
  const [isExpand] = useFabricStore(useShallow((s) => [s.isExpand]));
  const [brushWidth] = useFabricStore(useShallow((s) => [s.brushWidth]));
  const [brushColor] = useFabricStore(useShallow((s) => [s.brushColor]));
  const [mode] = useFabricStore(useShallow((s) => [s.mode]));

  const { containerRef } = usePaint();
  const { canvasRef } = useFabricCanvas();

  const {
    handleFabricCanvasModeButtonClick,
    handlBrushColorButtonClick,
    handleBrushWidthButtonClick,
    handleButtonMouseDown,
    handlePaintBlur,
  } = usePaintController();

  return (
    <PaintLayout isExpand={isExpand} tabIndex={0} ref={containerRef} onBlur={handlePaintBlur}>
      <canvas ref={canvasRef} />

      <PaintControllerBox>
        <PaintFabricControllerBox>
          <PaintFabricControllerButtonGroupBox>
            <PaintFabricControllerButton
              onClick={handleFabricCanvasModeButtonClick('pen')}
              onMouseDown={handleButtonMouseDown}
              disabled={mode === 'pen'}
            >
              <Pencil width="1.5rem" />
            </PaintFabricControllerButton>
            <PaintFabricControllerButton
              onClick={handleFabricCanvasModeButtonClick('hand')}
              onMouseDown={handleButtonMouseDown}
              disabled={mode === 'hand'}
            >
              <Hand width="1.5rem" />
            </PaintFabricControllerButton>
            <PaintFabricControllerButton
              onClick={handleFabricCanvasModeButtonClick('select')}
              onMouseDown={handleButtonMouseDown}
              disabled={mode === 'select'}
            >
              <Mouse width="1.5rem" />
            </PaintFabricControllerButton>
          </PaintFabricControllerButtonGroupBox>

          <PaintFabricControllerButtonGroupBox>
            {BRUSH_WIDTHS.map((width, index) => (
              <PaintFabricControllerButton
                key={index}
                onClick={handleBrushWidthButtonClick(width)}
                onMouseDown={handleButtonMouseDown}
                disabled={brushWidth === width}
              >
                <div
                  css={css`
                    width: 1.5rem;
                    aspect-ratio: 1/1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  `}
                >
                  <div
                    css={css`
                      width: 100%;
                      height: ${width}px;
                      background-color: ${brushWidth === width ? 'white' : 'gray'};
                      border-radius: 0.25rem;
                    `}
                  />
                </div>
              </PaintFabricControllerButton>
            ))}
          </PaintFabricControllerButtonGroupBox>

          <PaintFabricControllerButtonGroupBox>
            {BRUSH_COLORS.map((color, index) => (
              <PaintFabricControllerButton
                key={index}
                onClick={handlBrushColorButtonClick(color)}
                onMouseDown={handleButtonMouseDown}
                disabled={brushColor === color}
              >
                <div
                  css={css`
                    width: 1.5rem;
                    aspect-ratio: 1/1;
                    background-color: ${color};
                  `}
                />
              </PaintFabricControllerButton>
            ))}
          </PaintFabricControllerButtonGroupBox>
        </PaintFabricControllerBox>

        <PaintExpandButton />
      </PaintControllerBox>
    </PaintLayout>
  );
}

function PaintExpandButton() {
  const [isExpand] = useFabricStore(useShallow((s) => [s.isExpand]));

  const { handleExpandButtonClick, handleButtonMouseDown } = usePaintController();

  return (
    <ExpandShrinkButton onClick={handleExpandButtonClick} onMouseDown={handleButtonMouseDown}>
      {isExpand ? <Shrink /> : <Expand />}
    </ExpandShrinkButton>
  );
}
