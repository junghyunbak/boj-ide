import { useRef } from 'react';

import 'fabric';
import 'fabric-history';

export function useFabric() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return {
    canvasRef,
  };
}
