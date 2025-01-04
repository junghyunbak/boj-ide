import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useProblem } from '@/renderer/hooks';

import { EditorSettings } from '@/renderer/components/molecules/EditorSettings';
import { EditorCodemirror } from '@/renderer/components/molecules/EditorCodemirror';
import { EditorPlaceholder } from '@/renderer/components/molecules/EditorPlaceholder';

export function EditorContent() {
  const { problem } = useProblem();

  const [isSetting] = useStore(useShallow((s) => [s.isSetting]));

  const Content = (() => {
    if (isSetting) {
      return <EditorSettings />;
    }

    if (problem) {
      return <EditorCodemirror />;
    }

    return <EditorPlaceholder />;
  })();

  return Content;
}
