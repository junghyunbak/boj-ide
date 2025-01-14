import { useCallback, useEffect, useState } from 'react';

import { css } from '@emotion/react';

import { color, zIndex } from '@/renderer/styles';

import { useProblem, useResponsiveLayout, useFabricCanvas } from '@/renderer/hooks';

import { ReactComponent as Mouse } from '@/renderer/assets/svgs/mouse.svg';
import { ReactComponent as Hand } from '@/renderer/assets/svgs/hand.svg';
import { ReactComponent as Pencil } from '@/renderer/assets/svgs/pencil.svg';

import { ReactComponent as Expand } from '@/renderer/assets/svgs/expand.svg';
import { ReactComponent as Shrink } from '@/renderer/assets/svgs/shrink.svg';

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
            e.preventDefault();
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

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        position: ${isExpand ? 'absolute' : 'relative'};
        inset: 0;
        z-index: ${isExpand ? zIndex.paint.expanded : zIndex.paint.default};
        background-color: white;
        outline: none;
        box-shadow: inset 0px 0px 0px #00000036;
        transition: box-shadow ease 0.5s;
        &:focus {
          box-shadow: inset 0px 0px 6px #00000036;
          &::before {
            content: none;
          }
        }
        &::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: ${zIndex.paint.dimmed};
          inset: 0;
        }
      `}
      tabIndex={0}
      ref={containerRef}
    >
      <canvas ref={canvasRef} />

      <button
        type="button"
        css={css`
          position: absolute;
          left: 0.5rem;
          bottom: 0.5rem;
          border: none;
          background: none;
          cursor: pointer;
          color: gray;
          padding: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: ${zIndex.paint.expandController};

          svg {
            width: 1rem;
          }
        `}
        onClick={() => {
          setIsExpand(!isExpand);
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <Shrink style={{ display: isExpand ? 'block' : 'none' }} />
        <Expand style={{ display: isExpand ? 'none' : 'block' }} />
      </button>

      <div
        css={css`
          position: absolute;
          left: 0.5rem;
          top: 0.5rem;
          z-index: ${zIndex.paint.fabricController};

          display: flex;
          flex-direction: column;
          gap: 0.5rem;

          button {
            background: none;
            border: 0;
            border-left: 1px solid lightgray;
            border-right: 1px solid lightgray;
            border-top: 1px solid lightgray;
            padding: 0.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            color: gray;
            background-color: white;
            outline: none;
            cursor: pointer;
            &:last-of-type {
              border-bottom: 1px solid lightgray;
            }
            &:disabled {
              background-color: ${color.primaryBg};
              color: white;
            }
          }
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <button
            type="button"
            onClick={handleFabricCanvasModeButtonClick('pen')}
            disabled={fabricCanvasMode === 'pen'}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Pencil width="1.5rem" />
          </button>
          <button
            type="button"
            onClick={handleFabricCanvasModeButtonClick('hand')}
            disabled={fabricCanvasMode === 'hand'}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Hand width="1.5rem" />
          </button>
          <button
            type="button"
            onClick={handleFabricCanvasModeButtonClick('select')}
            disabled={fabricCanvasMode === 'select'}
            onMouseDown={(e) => e.preventDefault()}
          >
            <Mouse width="1.5rem" />
          </button>
        </div>

        <div>
          {BRUSH_WIDTHS.map((width, index) => (
            <button
              key={index}
              type="button"
              onClick={handleBrushWidthButtonClick(width)}
              disabled={brushWidth === width}
              onMouseDown={(e) => e.preventDefault()}
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
            </button>
          ))}
        </div>

        <div>
          {BRUSH_COLORS.map((color, index) => (
            <button
              key={index}
              type="button"
              onClick={handlBrushColorButtonClick(color)}
              onMouseDown={(e) => e.preventDefault()}
              disabled={brushColor === color}
            >
              <div
                css={css`
                  width: 1.5rem;
                  aspect-ratio: 1/1;
                  background-color: ${color};
                `}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
