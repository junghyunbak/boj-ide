import { useEffect } from 'react';

import { fabric } from 'fabric';
import 'fabric-history';

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
    };
  }, [problem, canvasRef, updateCanvas]);

  /**
   * 새롭게 생성 된 캔버스에 기존 데이터를 로딩한다.
   *
   * problemToFabricJSON를 상태로 불러와 의존성에 추가 한 이유는
   * indexedDB를 저장소로 사용하고 있기 때문에, 비동기로 데이터가 로드되었을 때 이를 감지하고 초기화하기 위함.
   *
   * 단, 그림판 데이터 백업 시에도 problemToFabricJSON 상태가 업데이트 되는데,
   * 이 경우에는 캔버스를 초기화하지 않도록 canvas.isEmpty()로 캔버스의 초기화 여부를 판단함.
   */
  useEffect(() => {
    if (canvas && canvas.isEmpty()) {
      try {
        const fabricJSON = problemToFabricJSON[problem?.number || ''];

        canvas.loadFromJSON(fabricJSON, () => {});

        const [obj] = canvas.getObjects();

        if (obj) {
          const { x, y } = obj.getCenterPoint();

          canvas.absolutePan(new fabric.Point(x - canvas.getWidth() / 2, y - canvas.getHeight() / 2));
        }
      } catch (e) {
        /**
         * // BUG: Cannot read properties of null (reading 'clearRect')
         *
         * dispose된 canvas를 사용할 때 해당 에러 발생. React 생명주기와 관련
         *
         * https://github.com/fabricjs/fabric.js/discussions/10036
         */
      }
    }
  }, [canvas, problem, problemToFabricJSON]);

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
