import { PaintButton } from '@/renderer/components/atoms/buttons/PaintButton';
import { useCallback } from 'react';
import { useEditor, useLayout, useModifyLayout, useProblem } from '@/renderer/hooks';

export function TogglePaintButton() {
  const { isPaintOpen } = useLayout();
  const { problem } = useProblem();
  const { editorLanguage } = useEditor();

  const { updateIsPaintOpen } = useModifyLayout();

  const handleTogglePaintButtonClick = useCallback(() => {
    updateIsPaintOpen(!isPaintOpen);

    window.electron.ipcRenderer.sendMessage('log-toggle-paint', {
      data: { number: problem?.number || 'non-Problem', language: editorLanguage },
    });
  }, [editorLanguage, isPaintOpen, problem?.number, updateIsPaintOpen]);

  return <PaintButton onClick={handleTogglePaintButtonClick} />;
}
