import { useEffect } from 'react';

import { fabric } from 'fabric';
import 'fabric-history';

import { useStore } from '@/renderer/store';

import { useProblem } from '../useProblem';
import { usePaint } from '../usePaint';
import { useModifyPaint } from '../useModifyPaint';
import { useEventElement } from '../useEventElement';

export function useSetupPaint() {
  const { problem } = useProblem();
  const { canvas, canvasRef, canvasMode, brushWidth, brushColor, problemToFabricJSON, paintRef } = usePaint();

  const { changeHandMode, changeSelectMode, changePenMode, backupPaint, updateCanvas } = useModifyPaint();

  /**
   * - 모드 (select, hand, pen)
   * - 펜 두께
   * - 펜 색상
   *
   * 이 변경될 때 마다 fabric 상태 업데이트
   */
  useEffect(() => {
    switch (canvasMode) {
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
  }, [
    canvasMode,
    brushWidth,
    brushColor,
    changeSelectMode,
    changePenMode,
    changeHandMode,
    canvas, // 캔버스가 초기화 되기 이전에 실행될 수 있으므로, 의존성에 canvas를 꼭 추가해야 함.
  ]);

  /**
   * problem이 변경될 때 마다 새로운 캔버스를 생성하여 초기화한다.
   */
  useEffect(() => {
    if (!canvasRef.current) {
      return function cleanup() {};
    }

    const newCanvas = new fabric.Canvas(canvasRef.current);
    updateCanvas(newCanvas);

    return function cleanup() {
      newCanvas.dispose();
      updateCanvas(null);
    };
  }, [problem, canvasRef, updateCanvas]);

  useEffect(() => {
    if (
      !canvas ||
      /**
       * fabric 데이터가 indexed db로 백업되기 때문에, 비동기로 상태가 업데이트 됨.
       *
       * => 초기 데이터 로드를 위해서는 상태로 사용해서 의존성에 추가해야 함.
       * => 상태로 사용하기 때문에 데이터 백업 시에도 의존성이 변경되므로 캔버스 데이터가 비어있을 때에만 실행되도록 처리.
       */
      !canvas.isEmpty()
    ) {
      return;
    }

    /**
     * problem 객체를 의존성 배열로 이용하게 되면 dispose된 fabric canvas를 사용하게 되어
     * 에러가 발생하므로, 스토어에서 직접 참조해야 함.
     *
     * problem 객체 변경 -> canvas 객체 변경 -> 현재 useEffect 순이므로
     * 스토어에서 직접 problem값을 가져오더라도 최신 problem임이 보장됨.
     */
    const fabricJSON = problemToFabricJSON[useStore.getState().problem?.number || ''];

    setTimeout(() => {
      try {
        canvas.loadFromJSON(fabricJSON, () => {});

        const [obj] = canvas.getObjects();

        if (obj) {
          const { x, y } = obj.getCenterPoint();

          canvas.absolutePan(new fabric.Point(x - canvas.getWidth() / 2, y - canvas.getHeight() / 2));
        }
      } catch (e) {
        /**
         * loadFromJSON 중 canvas 객체가 변경 될 경우 에러가 발생하는 것을 대비
         */
        console.log(e);
      }
    }, 0);
  }, [problemToFabricJSON, canvas]);

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
