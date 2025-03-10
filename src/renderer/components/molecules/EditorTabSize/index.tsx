import { useCallback } from 'react';

import { useEditor, useModifySetting, useProblem } from '@/renderer/hooks';

import { TransparentButton } from '@/renderer/components/atoms/buttons/TransparentButton';

export function EditorTabSize() {
  const { editorIndentSpace } = useEditor();
  const { problem } = useProblem();

  const { updateIsSetting } = useModifySetting();

  const handleTabSizeButtonClick = useCallback(() => {
    updateIsSetting(true);
  }, [updateIsSetting]);

  if (!problem) {
    return null;
  }

  return (
    <TransparentButton
      onClick={handleTabSizeButtonClick}
      size="small"
    >{`Spaces: ${editorIndentSpace}`}</TransparentButton>
  );
}
