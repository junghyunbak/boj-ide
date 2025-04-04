import { useEditor, useEventEditor, useSetupEditor } from '@/renderer/hooks';

import { EditorLayout } from './index.style';

export function Editor() {
  const { editorRef } = useEditor();

  useSetupEditor();

  useEventEditor();

  return <EditorLayout ref={editorRef} />;
}
