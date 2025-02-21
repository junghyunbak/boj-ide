import { useEffect } from 'react';

import { useStore, useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { fabric } from 'fabric';

export function useFabricCanvasInit() {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  const [problemToFabricJSON] = useFabricStore(useShallow((s) => [s.problemToFabricJSON, s.setProblemToFabricJSON]));
  const [canvas] = useFabricStore(useShallow((s) => [s.canvas]));

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
}
