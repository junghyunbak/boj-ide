import { useStore } from '@/renderer/store';

import { PaintButton } from '@/renderer/components/atoms/buttons/PaintButton';
import { useCallback } from 'react';
import { useLayout, useModifyLayout } from '@/renderer/hooks';

export function TogglePaintButton() {
  const { isPaintOpen } = useLayout();

  const { updateIsPaintOpen } = useModifyLayout();

  const handleTogglePaintButtonClick = useCallback(() => {
    updateIsPaintOpen(!isPaintOpen);

    const { problem, lang } = useStore.getState();

    window.electron.ipcRenderer.sendMessage('log-toggle-paint', {
      // BUG: 공백문자 전달 시 Sentry invalid 태그 에러 발생
      data: { number: problem?.number || '', language: lang },
    });
  }, [isPaintOpen, updateIsPaintOpen]);

  return <PaintButton onClick={handleTogglePaintButtonClick} />;
}
