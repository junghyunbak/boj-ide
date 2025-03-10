import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { PaintButton } from '@/renderer/components/atoms/buttons/PaintButton';
import { useCallback } from 'react';

export function TogglePaintButton() {
  const [isPaintOpen, setIsPaintOpen] = useStore(useShallow((s) => [s.isPaintOpen, s.setIsPaintOpen]));

  const handleTogglePaintButtonClick = useCallback(() => {
    setIsPaintOpen(!isPaintOpen);

    const { problem, lang } = useStore.getState();

    window.electron.ipcRenderer.sendMessage('log-toggle-paint', {
      // BUG: 공백문자 전달 시 Sentry invalid 태그 에러 발생
      data: { number: problem?.number || '', language: lang },
    });
  }, [isPaintOpen, setIsPaintOpen]);

  return <PaintButton onClick={handleTogglePaintButtonClick} />;
}
