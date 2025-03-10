import { useRef } from 'react';

import { useEventEditor, useEventSyncLayout, useModifyEditor, useSetupEditor } from '@/renderer/hooks';

import { EditorCodemirrorBox, EditorLayout } from './index.style';

export function EditorCodemirror() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { resizeEditorLayout } = useModifyEditor();

  const { editorRef, codemirror } = useSetupEditor();

  useEventEditor({ ...codemirror, editorRef });
  useEventSyncLayout(resizeEditorLayout, containerRef);

  return (
    <EditorLayout ref={containerRef}>
      <EditorCodemirrorBox ref={editorRef} />
    </EditorLayout>
  );
}
