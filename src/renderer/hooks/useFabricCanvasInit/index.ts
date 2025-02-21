import { useEffect } from 'react';

import { useStore, useFabricStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { fabric } from 'fabric';

export function useFabricCanvasInit() {
  const [problem] = useStore(useShallow((s) => [s.problem]));

  /**
   * idb persist를 사용하고 있어 상태로 참조해야만 한다.
   */
  const [problemToFabricJSON] = useFabricStore(useShallow((s) => [s.problemToFabricJSON, s.setProblemToFabricJSON]));
  const [canvas] = useFabricStore(useShallow((s) => [s.canvas]));

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
