import { useRef } from 'react';

import { useEditor, useEventEditor, useEventSyncLayout, useModifyEditor, useSetupEditor } from '@/renderer/hooks';

import { EditorCodemirrorBox, EditorLayout } from './index.style';

export function EditorCodemirror() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { editorRef, codemirror } = useEditor();

  const { resizeEditorLayout } = useModifyEditor();

  useSetupEditor({ ...codemirror, editorRef });
  useEventEditor({ ...codemirror, editorRef });
  useEventSyncLayout(resizeEditorLayout, containerRef);

  return (
    <EditorLayout ref={containerRef}>
      <EditorCodemirrorBox ref={editorRef} />
    </EditorLayout>
  );
}
