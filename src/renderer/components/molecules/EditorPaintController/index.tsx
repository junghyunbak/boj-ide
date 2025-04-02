import { useCallback } from 'react';

import { css } from '@emotion/react';

import { ReactComponent as Mouse } from '@/renderer/assets/svgs/mouse.svg';
import { ReactComponent as Hand } from '@/renderer/assets/svgs/hand.svg';
import { ReactComponent as Pencil } from '@/renderer/assets/svgs/pencil.svg';

import { ReactComponent as Expand } from '@/renderer/assets/svgs/expand.svg';
import { ReactComponent as Shrink } from '@/renderer/assets/svgs/shrink.svg';

import { useModifyPaint, usePaint } from '@/renderer/hooks';

import {
  PaintControllerBox,
  PaintFabricControllerBox,
  PaintFabricControllerButton,
  PaintFabricControllerButtonGroupBox,
  ExpandShrinkButton,
} from './index.style';

export function EditorPaintController() {
  const { isExpand, paintRef, brushColor, brushWidth, canvasMode, BRUSH_WIDTHS, BRUSH_COLORS } = usePaint();
  const { updatePaintMode, updateBrushColor, updateBrushWidth, updateIsExpand } = useModifyPaint();

  const handleFabricCanvasModeButtonClick = useCallback(
    (newMode: FabricCanvasMode) => {
      return () => {
        updatePaintMode(newMode);
      };
    },
    [updatePaintMode],
  );

  const handleBrushWidthButtonClick = useCallback(
    (width: BrushWidth) => {
      return () => {
        updateBrushWidth(width);
      };
    },
    [updateBrushWidth],
  );

  const handlBrushColorButtonClick = useCallback(
    (color: BrushColor) => {
      return () => {
        updateBrushColor(color);
      };
    },
    [updateBrushColor],
  );

  const handleButtonMouseDown = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      /**
       * 버튼 클릭으로 인한 fabric canvas의 focus blur를 방지
       */
      e.preventDefault();

      paintRef.current?.focus();
    },
    [paintRef],
  );

  const handleExpandButtonClick = useCallback(() => {
    updateIsExpand(!isExpand);
  }, [updateIsExpand, isExpand]);

  return (
    <PaintControllerBox>
      <PaintFabricControllerBox>
        <PaintFabricControllerButtonGroupBox>
          <PaintFabricControllerButton
            onClick={handleFabricCanvasModeButtonClick('pen')}
            onMouseDown={handleButtonMouseDown}
            disabled={canvasMode === 'pen'}
          >
            <Pencil width="1.5rem" />
          </PaintFabricControllerButton>
          <PaintFabricControllerButton
            onClick={handleFabricCanvasModeButtonClick('hand')}
            onMouseDown={handleButtonMouseDown}
            disabled={canvasMode === 'hand'}
          >
            <Hand width="1.5rem" />
          </PaintFabricControllerButton>
          <PaintFabricControllerButton
            onClick={handleFabricCanvasModeButtonClick('select')}
            onMouseDown={handleButtonMouseDown}
            disabled={canvasMode === 'select'}
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
                  css={(theme) => css`
                    width: 100%;
                    height: ${width}px;
                    background-color: ${theme.colors.fg};
                    border-radius: 3px;
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

      <ExpandShrinkButton onClick={handleExpandButtonClick} onMouseDown={handleButtonMouseDown}>
        {isExpand ? <Shrink /> : <Expand />}
      </ExpandShrinkButton>
    </PaintControllerBox>
  );
}
