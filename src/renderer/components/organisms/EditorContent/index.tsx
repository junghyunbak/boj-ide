import { css } from '@emotion/react';
import { useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { EditorSettings } from '@/renderer/components/molecules/EditorSettings';
import { EditorCodemirror } from '@/renderer/components/molecules/EditorCodemirror';
import { EditorPlaceholder } from '@/renderer/components/molecules/EditorPlaceholder';

export function EditorContent() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [isSetting] = useStore(useShallow((s) => [s.isSetting]));

  const containerRef = useRef<HTMLDivElement | null>(null);

  const Content = (() => {
    if (isSetting) {
      return <EditorSettings />;
    }

    if (problem) {
      return <EditorCodemirror containerRef={containerRef} />;
    }

    return <EditorPlaceholder />;
  })();

  return (
    <div
      ref={containerRef}
      css={css`
        width: 100%;
        height: 100%;
      `}
    >
      {Content}
    </div>
  );
}
