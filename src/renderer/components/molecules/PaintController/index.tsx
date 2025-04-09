import { css } from '@emotion/react';

import { ReactComponent as Mouse } from '@/renderer/assets/svgs/mouse.svg';
import { ReactComponent as Hand } from '@/renderer/assets/svgs/hand.svg';
import { ReactComponent as Pencil } from '@/renderer/assets/svgs/pencil.svg';
import { ReactComponent as Undo } from '@/renderer/assets/svgs/undo.svg';

import { useModifyPaint, usePaint, useProblem } from '@/renderer/hooks';

import { TooltipContentWithShortcuts } from '@/renderer/components/atoms/TooltipContentWithShortcuts';

import { Tooltip } from 'react-tooltip';

import { PaintControllerBox, PaintFabricControllerButton, PaintFabricControllerButtonGroupBox } from './index.style';

export function PaintController() {
  const { problem } = useProblem();
  const { paintRef, brushColor, brushWidth, canvasMode, BRUSH_WIDTHS, BRUSH_COLORS } = usePaint();

  const { updatePaintMode, updateBrushColor, updateBrushWidth, undo, redo, backupPaint } = useModifyPaint();

  const handleFabricCanvasModeButtonClick = (newMode: FabricCanvasMode) => () => {
    updatePaintMode(newMode);
  };

  const handleBrushWidthButtonClick = (width: BrushWidth) => () => {
    updateBrushWidth(width);
    updatePaintMode('pen');
  };

  const handlBrushColorButtonClick = (color: BrushColor) => () => {
    updateBrushColor(color);
    updatePaintMode('pen');
  };

  const handleButtonMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    /**
     * 버튼 클릭으로 인한 fabric canvas의 focus blur를 방지
     */
    e.preventDefault();

    paintRef.current?.focus();
  };

  const handleUndoButtonClick = () => {
    undo();
    backupPaint(problem);
  };

  const handleRedoButtonClick = () => {
    redo();
    backupPaint(problem);
  };

  return (
    <>
      <div
        css={css`
          z-index: 1;
        `}
      >
        <Tooltip id="paint-pen-mode" place="right" delayShow={500}>
          <TooltipContentWithShortcuts title="그리기" shortCuts={['P']} />
        </Tooltip>
        <Tooltip id="paint-hand-mode" place="right" delayShow={500}>
          <TooltipContentWithShortcuts title="화면 이동" shortCuts={['M', 'Space']} />
        </Tooltip>
        <Tooltip id="paint-move-mode" place="right" delayShow={500}>
          <TooltipContentWithShortcuts title="요소 선택" shortCuts={['V']} />
        </Tooltip>
      </div>

      <PaintControllerBox>
        <PaintFabricControllerButtonGroupBox>
          <PaintFabricControllerButton
            onClick={handleFabricCanvasModeButtonClick('pen')}
            onMouseDown={handleButtonMouseDown}
            isSelect={canvasMode === 'pen'}
            data-tooltip-id="paint-pen-mode"
          >
            <Pencil width="1.5rem" />
          </PaintFabricControllerButton>
          <PaintFabricControllerButton
            onClick={handleFabricCanvasModeButtonClick('hand')}
            onMouseDown={handleButtonMouseDown}
            isSelect={canvasMode === 'hand'}
            data-tooltip-id="paint-hand-mode"
          >
            <Hand width="1.5rem" />
          </PaintFabricControllerButton>
          <PaintFabricControllerButton
            onClick={handleFabricCanvasModeButtonClick('select')}
            onMouseDown={handleButtonMouseDown}
            isSelect={canvasMode === 'select'}
            data-tooltip-id="paint-move-mode"
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
              isSelect={brushWidth === width}
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
              isSelect={brushColor === color}
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

        <PaintFabricControllerButtonGroupBox>
          <PaintFabricControllerButton onClick={handleUndoButtonClick}>
            <div
              css={css`
                width: 1.5rem;
                aspect-ratio: 1/1;

                display: flex;
                justify-content: center;
                align-items: center;
              `}
            >
              <Undo />
            </div>
          </PaintFabricControllerButton>

          <PaintFabricControllerButton onClick={handleRedoButtonClick}>
            <div
              css={css`
                width: 1.5rem;
                aspect-ratio: 1/1;

                display: flex;
                justify-content: center;
                align-items: center;
              `}
            >
              <Undo
                css={css`
                  transform: scaleX(-1);
                `}
              />
            </div>
          </PaintFabricControllerButton>
        </PaintFabricControllerButtonGroupBox>
      </PaintControllerBox>
    </>
  );
}
