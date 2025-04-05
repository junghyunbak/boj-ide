import { useEffect, useRef, useState } from 'react';

import { useStore } from '@/renderer/store';

import { fabric } from 'fabric';

import { blobToBase64, fetchImageAsBase64 } from '@/renderer/utils';

import { usePaint } from '../usePaint';
import { useModifyPaint } from '../useModifyPaint';
import { useEventElement } from '../useEventElement';
import { useEventFabricMouse, useEventFabricWheel } from '../useEventFabric';
import { useProblem } from '../useProblem';

class Copier {
  private canvas: fabric.Canvas;

  private copyObjects: fabric.Object[];

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.copyObjects = [];
  }

  active(objs: fabric.Object[]) {
    this.unactiveAll();

    const selection = new fabric.ActiveSelection(objs, { canvas: this.canvas });

    this.canvas.setActiveObject(selection);
    this.canvas.renderAll();
  }

  activeAll() {
    this.active(this.canvas.getObjects());
  }

  unactiveAll() {
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  removeActiveObjs() {
    this.canvas.remove(...this.canvas.getActiveObjects());
    this.canvas.discardActiveObject();
  }

  copy() {
    this.copyObjects = this.canvas.getActiveObjects();
  }

  cut() {
    this.copy();
    this.removeActiveObjs();
  }

  cloneObj(obj: fabric.Object, selection: fabric.Object | null) {
    return new Promise<fabric.Object>((resolve) => {
      obj.clone((clonedObj: fabric.Object) => {
        const objLeft = obj.left || 0;
        const objTop = obj.top || 0;

        const selectionLeft = selection?.left || 0;
        const selectionTop = selection?.top || 0;

        const selectionWidth = selection?.width || 0;
        const selectionHeight = selection?.height || 0;

        clonedObj.set({
          left: selectionLeft === objLeft ? objLeft - selectionWidth / 2 : selectionLeft + objLeft,
          top: selectionTop === objTop ? objTop - selectionHeight / 2 : selectionTop + objTop,
        });

        resolve(clonedObj);
      });
    });
  }

  async paste() {
    const clonedObjs: fabric.Object[] = [];

    for (const copyObj of this.copyObjects) {
      const activeObj = this.canvas.getActiveObject();

      const clonedObj = await this.cloneObj(copyObj, activeObj);

      this.canvas.add(clonedObj);
      clonedObjs.push(clonedObj);
    }

    this.copyObjects = clonedObjs;

    this.active(clonedObjs);
  }
}

export function useEventPaint() {
  const prevMode = useRef<FabricCanvasMode>('pen');
  const isPressed = useRef(false);
  const isPanning = useRef(false);

  const [copier, setCopier] = useState<Copier | null>(null);

  const { problem } = useProblem();
  const { paintRef, canvas } = usePaint();

  const { redo, undo, updatePaintMode, updateIsCtrlKeyPressed, addImageToCanvas, backupPaint, setCanvasMode } =
    useModifyPaint();

  /**
   * 이미지 drag & drop 이벤트
   */
  useEventElement(
    (e) => {
      e.preventDefault();
    },
    [],
    'dragover',
    paintRef.current,
  );

  useEventElement(
    async (e) => {
      e.preventDefault();

      if (!e.dataTransfer || !canvas) {
        return;
      }

      const { x, y } = canvas.getVpCenter();

      try {
        /**
         * 파일 drop
         */
        const file = e.dataTransfer.files[0];

        if (file && file.type.startsWith('image/')) {
          const base64 = await blobToBase64(file);

          addImageToCanvas(canvas, base64, x, y);
        }

        /**
         * url drop
         */
        const imageUrl = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');

        const blob = await fetchImageAsBase64(imageUrl);

        const base64 = await blobToBase64(blob);

        addImageToCanvas(canvas, base64, x, y);
      } catch (err) {
        console.error('이미지 로드 실패', err);
      }
    },
    [canvas, addImageToCanvas],
    'drop',
    paintRef.current,
  );

  /**
   * 그림판 단축키 이벤트 등록
   */
  useEffect(() => {
    if (canvas) {
      setCopier(new Copier(canvas));
    }
  }, [canvas]);

  useEventElement(
    (e) => {
      e.preventDefault();

      const { ctrlKey, metaKey, key, shiftKey } = e;

      const isCtrlKeyDown = ctrlKey || metaKey;
      const isShiftKeyDown = shiftKey;

      if (isCtrlKeyDown) {
        updateIsCtrlKeyPressed(true);
      }

      switch (key.toLowerCase()) {
        case 'escape': {
          copier?.unactiveAll();

          break;
        }
        case 'delete': {
          copier?.removeActiveObjs();

          break;
        }
        case 'm':
        case 'ㅡ': {
          updatePaintMode('hand');

          break;
        }
        case 'c':
        case 'ㅊ': {
          if (isCtrlKeyDown) {
            copier?.copy();
          }

          break;
        }
        case 'x':
        case 'ㅌ': {
          if (isCtrlKeyDown) {
            copier?.cut();
          }

          break;
        }
        case 'v':
        case 'ㅍ': {
          if (isCtrlKeyDown) {
            copier?.paste();
          }

          updatePaintMode('select');

          break;
        }
        case 'p':
        case 'ㅔ': {
          updatePaintMode('pen');

          break;
        }
        case 'a':
        case 'ㅁ': {
          if (isCtrlKeyDown) {
            copier?.activeAll();
          }

          break;
        }
        case 'z':
        case 'ㅋ': {
          if (isCtrlKeyDown) {
            if (isShiftKeyDown) {
              redo();
            } else {
              undo();
            }
          }

          break;
        }
        default:
          break;
      }
    },
    [copier, updateIsCtrlKeyPressed, updatePaintMode, redo, undo],
    'keydown',
    paintRef.current,
  );

  useEventElement(
    () => {
      updateIsCtrlKeyPressed(false);
    },
    [updateIsCtrlKeyPressed],
    'keyup',
    paintRef.current,
  );

  /**
   * 스페이스바 클릭 시 일시적으로 'hand' 모드로 변경
   */
  useEventElement(
    (e) => {
      if (isPressed.current) {
        return;
      }

      if (e.key === ' ') {
        setCanvasMode((prev) => {
          prevMode.current = prev;
          return 'hand';
        });
      }

      isPressed.current = true;
    },
    [isPressed, setCanvasMode],
    'keydown',
    paintRef.current,
  );

  useEventElement(
    (e) => {
      isPressed.current = false;

      if (e.key === ' ') {
        setCanvasMode(prevMode.current);
      }
    },
    [isPressed, setCanvasMode],
    'keyup',
    paintRef.current,
  );

  /**
   * fabric 캔버스에
   *
   * - 마우스
   * - 휠
   *
   * 이벤트 등록
   */
  useEventFabricMouse(
    () => {
      isPanning.current = true;
    },
    [],
    canvas,
    'mouse:down',
  );

  useEventFabricMouse(
    (event) => {
      const { isHand } = useStore.getState();

      if (!isPanning.current || !isHand || !canvas) {
        return;
      }

      const delta = new fabric.Point(event.e.movementX, event.e.movementY);

      canvas.relativePan(delta);
    },
    [canvas],
    canvas,
    'mouse:move',
  );

  useEventFabricWheel(
    (event) => {
      if (!canvas) {
        return;
      }

      const { isCtrlKeyPressed } = useStore.getState();
      const { deltaY, deltaX } = event.e;

      let zoom = canvas.getZoom();

      zoom *= 0.999 ** deltaY;

      if (zoom > 20) {
        zoom = 20;
      }

      if (zoom < 0.1) {
        zoom = 0.1;
      }

      if (isCtrlKeyPressed) {
        canvas.zoomToPoint({ x: event.e.offsetX, y: event.e.offsetY }, zoom);
      } else {
        canvas.relativePan(new fabric.Point(event.e.movementX - deltaX, event.e.movementY - deltaY));
      }

      event.e.preventDefault();
      event.e.stopPropagation();
    },
    [canvas],
    canvas,
  );

  useEventFabricMouse(
    () => {
      isPanning.current = false;
    },
    [],
    canvas,
    'mouse:up',
  );

  /**
   * 그림판 백업 이벤트
   *
   * fabric 객체가 추가되기 전에 백업이 발생되는 이슈가 있어, setTimeout을 이용해 백업 작업을 다음 이벤트 루프로 넘김
   */
  useEventElement(
    () => {
      setTimeout(() => {
        backupPaint(problem);
      }, 0);
    },
    [backupPaint, problem],
    'keyup',
    paintRef.current,
  );

  useEventElement(
    () => {
      setTimeout(() => {
        backupPaint(problem);
      }, 0);
    },
    [backupPaint, problem],
    'mouseup',
    paintRef.current,
  );
}
