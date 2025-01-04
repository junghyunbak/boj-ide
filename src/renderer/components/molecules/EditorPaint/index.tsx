import { useEffect, useState } from 'react';

import { css } from '@emotion/react';

import { color } from '@/renderer/styles';

import { useProblem, useResponsiveLayout, useFabricCanvas } from '@/renderer/hooks';

import { ReactComponent as Mouse } from '@/renderer/assets/svgs/mouse.svg';
import { ReactComponent as Hand } from '@/renderer/assets/svgs/hand.svg';
import { ReactComponent as Pencil } from '@/renderer/assets/svgs/pencil.svg';

const BRUSH_WIDTHS: BrushWidth[] = [2, 4, 8];
const PEN_COLORS: PenColor[] = ['black', 'red', 'blue'];

// [ ]: 요소를 선택하고 delete 키를 입력하면 요소가 삭제되어야한다.
// [ ]: v키를 입력하면 모드가 'select'로 변경되어야한다.
export function EditorPaint() {
  const [mode, setMode] = useState<PaintMode>('pen');
  const [brushWidth, setBrushWidth] = useState<BrushWidth>(2);
  const [penColor, setPenColor] = useState<PenColor>('black');

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

      const isCtrlKeyClick = ctrlKey || metaKey;
      const isShiftKeyClick = shiftKey;

      switch (key) {
        case 'Escape':
          unactiveAllFabricSelection();
          break;
        case 'Delete':
          removeFabricActiveObject();
          break;
        case 'v':
          setMode('select');
          break;
        case 'p':
          setMode('pen');
          break;
        case 'a':
          if (isCtrlKeyClick) {
            activeAllFabricSelection();
            e.preventDefault();
          }
          break;
        case 'z':
          if (isCtrlKeyClick) {
            if (isShiftKeyClick) {
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

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    containerRef,
    fabricCanvas,
    removeFabricActiveObject,
    activeAllFabricSelection,
    undo,
    redo,
    unactiveAllFabricSelection,
  ]);

  /**
   * 스페이스바 클릭 시 일시적으로 'hand' 모드로 변경
   */
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return () => {};
    }

    let prevMode: PaintMode = 'pen';
    let isPressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPressed) {
        return;
      }

      if (e.key === ' ') {
        setMode((prev) => {
          prevMode = prev;
          return 'hand';
        });
      }

      isPressed = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      isPressed = false;

      if (e.key === ' ') {
        setMode(prevMode);
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
    switch (mode) {
      case 'select':
        changeSelectMode();
        break;
      case 'hand':
        changeHandMode();
        break;
      case 'pen':
      default:
        changePenMode({ brushWidth, penColor });
        break;
    }
  }, [mode, brushWidth, penColor, changeSelectMode, changePenMode, changeHandMode]);

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        position: relative;
        outline: none;
      `}
      tabIndex={0}
      ref={containerRef}
    >
      <canvas ref={canvasRef} />
      <div
        css={css`
          position: absolute;
          left: 0.5rem;
          top: 0.5rem;

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
          <button type="button" onClick={() => setMode('pen')} disabled={mode === 'pen'}>
            <Pencil width="1.5rem" />
          </button>
          <button type="button" onClick={() => setMode('hand')} disabled={mode === 'hand'}>
            <Hand width="1.5rem" />
          </button>
          <button type="button" onClick={() => setMode('select')} disabled={mode === 'select'}>
            <Mouse width="1.5rem" />
          </button>
        </div>

        <div>
          {BRUSH_WIDTHS.map((width, index) => (
            <button key={index} type="button" onClick={() => setBrushWidth(width)} disabled={brushWidth === width}>
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
          {PEN_COLORS.map((color, index) => (
            <button key={index} type="button" onClick={() => setPenColor(color)} disabled={penColor === color}>
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
