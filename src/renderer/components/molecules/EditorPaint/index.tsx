import { MouseEventHandler, useCallback, useEffect, useState } from 'react';

import { css } from '@emotion/react';

import { useProblem, useResponsiveLayout, useFabricCanvas } from '@/renderer/hooks';

import { ReactComponent as Mouse } from '@/renderer/assets/svgs/mouse.svg';
import { ReactComponent as Hand } from '@/renderer/assets/svgs/hand.svg';
import { ReactComponent as Pencil } from '@/renderer/assets/svgs/pencil.svg';

import { ReactComponent as Expand } from '@/renderer/assets/svgs/expand.svg';
import { ReactComponent as Shrink } from '@/renderer/assets/svgs/shrink.svg';

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
  const [fabricCanvasMode, setFabricCanvasMode] = useState<FabricCanvasMode>('pen');
  const [brushWidth, setBrushWidth] = useState<BrushWidth>(4);
  const [brushColor, setBrushColor] = useState<BrushColor>('black');
  const [isExpand, setIsExpand] = useState(false);

  const { problem } = useProblem();

  const problemNumber = problem?.number || '';

  const {
    fabricCanvas,
    canvasRef,
    activeAllFabricSelection,
    unactiveAllFabricSelection,
    removeFabricActiveObject,
    undo,
    redo,
    changeHandMode,
    changePenMode,
    changeSelectMode,
    updateFabricCanvasSize,
    isCtrlKeyPressedRef,
  } = useFabricCanvas(problemNumber);
  const { containerRef } = useResponsiveLayout(updateFabricCanvasSize);

  /**
   * 그림판 단축키 이벤트 등록
   */
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return () => {};
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      const { ctrlKey, metaKey, key, shiftKey } = e;

      const isCtrlKeyDown = ctrlKey || metaKey;
      const isShiftKeyDown = shiftKey;

      if (isCtrlKeyDown) {
        isCtrlKeyPressedRef.current = true;
      }

      switch (key.toLowerCase()) {
        case 'escape':
          unactiveAllFabricSelection();
          break;
        case 'delete':
          removeFabricActiveObject();
          break;
        case 'm':
        case 'ㅡ':
          setFabricCanvasMode('hand');
          break;
        case 'v':
        case 'ㅍ':
          setFabricCanvasMode('select');
          break;
        case 'p':
        case 'ㅔ':
          setFabricCanvasMode('pen');
          break;
        case 'a':
        case 'ㅁ':
          if (isCtrlKeyDown) {
            activeAllFabricSelection();
          }
          break;
        case 'z':
        case 'ㅋ':
          if (isCtrlKeyDown) {
            if (isShiftKeyDown) {
              redo();
            } else {
              undo();
            }
          }
          break;
        default:
          break;
      }
    };

    const handleKeyUp = () => {
      isCtrlKeyPressedRef.current = false;
    };

    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('keyup', handleKeyUp);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    containerRef,
    fabricCanvas,
    removeFabricActiveObject,
    activeAllFabricSelection,
    undo,
    redo,
    unactiveAllFabricSelection,
    isCtrlKeyPressedRef,
  ]);

  /**
   * 스페이스바 클릭 시 일시적으로 'hand' 모드로 변경
   */
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return () => {};
    }

    let prevMode: FabricCanvasMode = 'pen';
    let isPressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPressed) {
        return;
      }

      if (e.key === ' ') {
        setFabricCanvasMode((prev) => {
          prevMode = prev;
          return 'hand';
        });
      }

      isPressed = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      isPressed = false;

      if (e.key === ' ') {
        setFabricCanvasMode(prevMode);
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('keyup', handleKeyUp);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('keyup', handleKeyUp);
    };
  }, [containerRef]);

  /**
   * 모드에 따른 fabric 상태 변경
   */
  useEffect(() => {
    switch (fabricCanvasMode) {
      case 'select':
        changeSelectMode();
        break;
      case 'hand':
        changeHandMode();
        break;
      case 'pen':
      default:
        changePenMode({ brushWidth, brushColor });
        break;
    }
  }, [fabricCanvasMode, brushWidth, brushColor, changeSelectMode, changePenMode, changeHandMode]);

  const handleFabricCanvasModeButtonClick = useCallback((mode: FabricCanvasMode) => {
    return () => {
      setFabricCanvasMode(mode);
    };
  }, []);

  const handleBrushWidthButtonClick = useCallback((width: BrushWidth) => {
    return () => {
      setBrushWidth(width);
    };
  }, []);

  const handlBrushColorButtonClick = useCallback((color: BrushColor) => {
    return () => {
      setBrushColor(color);
    };
  }, []);

  const handleExpandButtonClick = () => {
    setIsExpand(!isExpand);
  };

  const handleButtonMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    /**
     * 버튼 클릭으로 인한 fabric canvas의 focus blur를 방지
     */
    e.preventDefault();

    containerRef.current?.focus();
  };

  return (
    <PaintLayout isExpand={isExpand} tabIndex={0} ref={containerRef}>
      <canvas ref={canvasRef} />

      <PaintControllerBox>
        <PaintFabricControllerBox>
          <PaintFabricControllerButtonGroupBox>
            <PaintFabricControllerButton
              onClick={handleFabricCanvasModeButtonClick('pen')}
              onMouseDown={handleButtonMouseDown}
              disabled={fabricCanvasMode === 'pen'}
            >
              <Pencil width="1.5rem" />
            </PaintFabricControllerButton>
            <PaintFabricControllerButton
              onClick={handleFabricCanvasModeButtonClick('hand')}
              onMouseDown={handleButtonMouseDown}
              disabled={fabricCanvasMode === 'hand'}
            >
              <Hand width="1.5rem" />
            </PaintFabricControllerButton>
            <PaintFabricControllerButton
              onClick={handleFabricCanvasModeButtonClick('select')}
              onMouseDown={handleButtonMouseDown}
              disabled={fabricCanvasMode === 'select'}
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

        <ExpandShrinkButton onClick={handleExpandButtonClick} onMouseDown={handleButtonMouseDown}>
          {isExpand ? <Shrink /> : <Expand />}
        </ExpandShrinkButton>
      </PaintControllerBox>
    </PaintLayout>
  );
}
