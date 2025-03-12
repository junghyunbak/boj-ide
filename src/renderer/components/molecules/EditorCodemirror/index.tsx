import { useRef } from 'react';

import { useEditor, useEventEditor, useEventSyncLayout, useModifyEditor, useSetupEditor } from '@/renderer/hooks';

import { EditorCodemirrorBox, EditorLayout } from './index.style';

export function EditorCodemirror() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { editorRef } = useEditor();

  const { resizeEditorLayout } = useModifyEditor();

  const { codemirror } = useSetupEditor();

  useEventEditor(codemirror);
  useEventSyncLayout(resizeEditorLayout, containerRef);

  return (
    <EditorLayout ref={containerRef}>
      <EditorCodemirrorBox ref={editorRef} />
    </EditorLayout>
  );
}
