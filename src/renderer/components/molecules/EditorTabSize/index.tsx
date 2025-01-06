import { useProblem } from '@/renderer/hooks';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { TransparentButton } from '@/renderer/components/atoms/buttons/TransparentButton';

export function EditorTabSize() {
  const [indentSpace] = useStore(useShallow((s) => [s.indentSpace]));
  const [setIsSetting] = useStore(useShallow((s) => [s.setIsSetting]));
  const { problem } = useProblem();

  const handleTabSizeButtonClick = () => {
    setIsSetting(true);
  };

  if (!problem) {
    return null;
  }

  return (
    <TransparentButton onClick={handleTabSizeButtonClick} size="small">{`Spaces: ${indentSpace}`}</TransparentButton>
  );
}
