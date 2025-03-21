import { useCallback } from 'react';

import { PaintButton } from '@/renderer/components/atoms/buttons/PaintButton';

import { useLanguage, useLayout, useModifyLayout, useProblem } from '@/renderer/hooks';

export function TogglePaintButton() {
  const { problem } = useProblem();
  const { language } = useLanguage();
  const { isPaintOpen } = useLayout();

  const { updateIsPaintOpen } = useModifyLayout();

  const handleTogglePaintButtonClick = useCallback(() => {
    updateIsPaintOpen(!isPaintOpen);

    window.electron.ipcRenderer.sendMessage('log-toggle-paint', {
      data: { number: problem?.number || 'non-Problem', language },
    });
  }, [language, isPaintOpen, problem, updateIsPaintOpen]);

  return <PaintButton onClick={handleTogglePaintButtonClick} />;
}
