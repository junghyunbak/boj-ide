import { css } from '@emotion/react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { EditorSettings } from '@/renderer/components/molecules/EditorSettings';
import { EditorCodemirror } from '@/renderer/components/molecules/EditorCodemirror';
import { EditorPlaceholder } from '@/renderer/components/molecules/EditorPlaceholder';

export function EditorContent() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
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
