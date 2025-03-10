import { useEditor, useEventEditor, useSetupEditor } from '@/renderer/hooks';

import { EditorCodemirrorBox, EditorLayout } from './index.style';

export function EditorCodemirror() {
  const { containerRef, editorRef, codemirror } = useEditor();

  useSetupEditor({ ...codemirror, editorRef });
  useEventEditor({ ...codemirror, editorRef });

  return (
    <EditorLayout ref={containerRef}>
      <EditorCodemirrorBox ref={editorRef} />
    </EditorLayout>
  );
}
