import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { fabric } from 'fabric';
import { color } from '@/styles';
import { useProblem } from '@/renderer/hooks';
import { useStore } from '@/renderer/store';
import { ReactComponent as Mouse } from '@/renderer/assets/svgs/mouse.svg';
import { ReactComponent as Hand } from '@/renderer/assets/svgs/hand.svg';
import { ReactComponent as Pencil } from '@/renderer/assets/svgs/pencil.svg';
import 'fabric-history';

type PaintMode = 'pen' | 'select' | 'hand';

export function EditorPaint() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isHandRef = useRef(false);

  const { problem } = useProblem();

  const problemNumber = problem?.number || '';

  const [mode, setMode] = useState<PaintMode>('pen');
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return () => {};
    }

    const handler = (e: KeyboardEvent) => {
      const { ctrlKey, metaKey, key, shiftKey } = e;

      if (key === 'Delete') {
        if (fabricCanvas) {
          fabricCanvas.remove(...fabricCanvas.getActiveObjects());
          fabricCanvas.discardActiveObject();
        }

        return;
      }

      if (key === 'v') {
        setMode('select');
        return;
      }

      if (key === 'p') {
        setMode('pen');
        return;
      }

      if ((ctrlKey || metaKey) && key === 'a') {
        if (fabricCanvas) {
          const selection = new fabric.ActiveSelection(fabricCanvas.getObjects(), { canvas: fabricCanvas });
          fabricCanvas.setActiveObject(selection);
          fabricCanvas.renderAll();
        }

        e.preventDefault();

        return;
      }

      if ((ctrlKey || metaKey) && shiftKey && key === 'z') {
        if (fabricCanvas && 'redo' in fabricCanvas && fabricCanvas.redo instanceof Function) {
          fabricCanvas.redo();
        }

        return;
      }

      if ((ctrlKey || metaKey) && key === 'z') {
        if (fabricCanvas && 'undo' in fabricCanvas && fabricCanvas.undo instanceof Function) {
          fabricCanvas.undo();
        }
      }
    };

    container.addEventListener('keydown', handler);

    return () => {
      container.removeEventListener('keydown', handler);
    };
  }, [fabricCanvas]);

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
  }, []);

  useEffect(() => {
    if (!fabricCanvas) {
      return;
    }

    switch (mode) {
      case 'select':
        fabricCanvas.isDrawingMode = false;
        fabricCanvas.selection = true;
        fabricCanvas.defaultCursor = 'default';
        isHandRef.current = false;
        break;
      case 'hand':
        fabricCanvas.isDrawingMode = false;
        fabricCanvas.selection = false;
        fabricCanvas.defaultCursor = 'move';
        isHandRef.current = true;
        break;
      case 'pen':
      default:
        fabricCanvas.freeDrawingBrush.width = 1;
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.selection = false;
        isHandRef.current = false;
        break;
    }
  }, [mode, fabricCanvas]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!canvas || !container) {
      return () => {};
    }

    const newFabricCanvas = new fabric.Canvas(canvas);

    setFabricCanvas(newFabricCanvas);

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      newFabricCanvas.setDimensions({
        width,
        height,
      });
    });

    observer.observe(container);

    return () => {
      newFabricCanvas.dispose();
      observer.unobserve(container);
      observer.disconnect();
    };
  }, [problemNumber]);

  useEffect(() => {
    if (!fabricCanvas) {
      return;
    }

    let panning = false;

    const handleMouseDown = () => {
      panning = true;
    };

    const handleMouseMove = (event: fabric.IEvent<MouseEvent>) => {
      if (!panning || !isHandRef.current) {
        return;
      }

      const delta = new fabric.Point(event.e.movementX, event.e.movementY);
      fabricCanvas.relativePan(delta);
    };

    const handleMouseUp = () => {
      panning = false;
    };

    const handleWheelScroll = (opt: fabric.IEvent<WheelEvent>) => {
      const delta = opt.e.deltaY;
      let zoom = fabricCanvas.getZoom();

      zoom *= 0.999 ** delta;

      if (zoom > 20) {
        zoom = 20;
      }

      if (zoom < 0.01) {
        zoom = 0.01;
      }

      fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

      opt.e.preventDefault();
      opt.e.stopPropagation();
    };

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('mouse:wheel', handleWheelScroll);
    fabricCanvas.on('after:render', () => {
      useStore.getState().setProblemToFabricJSON((prev) => {
        const next = { ...prev };

        next[problemNumber] = fabricCanvas.toJSON();

        return next;
      });
    });
  }, [fabricCanvas, problemNumber]);

  useEffect(() => {
    const fabricJSON = useStore.getState().problemToFabricJSON[problemNumber];

    if (!fabricCanvas || !fabricJSON) {
      return;
    }

    /**
     * // BUG: Cannot read properties of null (reading 'clearRect')
     *
     * https://github.com/fabricjs/fabric.js/discussions/10036
     *
     * problemNumber가 변경되면 기존 fabricCanvas가 dispose된다.
     * 하지만 dispose된다고 하더라도 fabricCanvas 객체는 살아있게된다.
     * 유효한 fabricCanvas의 상태가 업데이트 되기전에 해당 훅이 먼저 실행되면
     * 이미 dispose된 객체의 loadFromJSON 메서드를 호출하게 되어 에러가 발생한다.
     *
     * try-catch 문으로 무시해주는 방법으로 일단 해결한다.
     */
    try {
      fabricCanvas.loadFromJSON(fabricJSON, () => {});
    } catch (e) {
      // do-nothing
    }
  }, [fabricCanvas, problemNumber]);

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
    </div>
  );
}
