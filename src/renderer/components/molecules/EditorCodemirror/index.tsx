import { useEditor, useEventEditor, useSetupEditor } from '@/renderer/hooks';

import { EditorLayout } from './index.style';

export function EditorCodemirror() {
  const { editorRef } = useEditor();

  useSetupEditor();

  useEventEditor();

  return <EditorLayout ref={editorRef} />;
}
