import { useMemo } from 'react';

import { useTheme } from '@emotion/react';

import { Extension, EditorView } from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { vim } from '@replit/codemirror-vim';
import { acceptCompletion } from '@codemirror/autocomplete';
import { indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyEditor } from '../useModifyEditor';

export function useEditor() {
  const [editorIndentSpace] = useStore(useShallow((s) => [s.indentSpace]));
  const [editorCode] = useStore(useShallow((s) => [s.code]));
  const [editorWidth] = useStore(useShallow((s) => [s.editorWidth]));
  const [editorHeight] = useStore(useShallow((s) => [s.editorHeight]));
  const [editorMode] = useStore(useShallow((s) => [s.mode]));
  const [editorFontSize] = useStore(useShallow((s) => [s.fontSize]));
  const [editorLanguage] = useStore(useShallow((s) => [s.lang]));

  const emotionTheme = useTheme();

  const { saveEditorCode } = useModifyEditor();

  const shortcutExtensions = useMemo<Extension[]>(() => {
    return [
      /**
       * 의존성 타입 꼬임으로 인해 타입 에러 발생
       * codemirror/state 타입 에러 : Two different types with this name exist, but they are unrelated.
       */
      // @ts-ignore
      keymap.of([{ key: 'Tab', run: acceptCompletion }, indentWithTab]),
      keymap.of([
        {
          key: 'Ctrl-s',
          run: () => {
            saveEditorCode();
            return false;
          },
        },
      ]),
      keymap.of([
        {
          key: 'Meta-s',
          run: () => {
            saveEditorCode();
            return false;
          },
        },
      ]),
    ];
  }, [saveEditorCode]);

  const codeExtensions = useMemo<Extension[]>(() => {
    return [
      editorMode === 'vim' && vim(),
      editorLanguage === 'C++14' && cpp(),
      editorLanguage === 'C++17' && cpp(),
      editorLanguage === 'Java11' && java(),
      editorLanguage === 'node.js' && javascript(),
      editorLanguage === 'Python3' && python(),
    ].filter((value) => typeof value === 'object');
  }, [editorLanguage, editorMode]);

  const themeExtensions = useMemo<Extension[]>(() => {
    return [
      EditorView.theme({
        '.cm-content': {
          fontSize: `${editorFontSize}px`,
          fontFamily: 'hack',
        },
        '.cm-gutters': {
          fontSize: `${editorFontSize}px`,
          fontFamily: 'hack',
        },
      }),
      createTheme({
        theme: emotionTheme.theme,
        settings: emotionTheme.editor.settings,
        styles: emotionTheme.editor.styles,
      }),
    ];
  }, [editorFontSize, emotionTheme]);

  const extensions = [...shortcutExtensions, ...codeExtensions, ...themeExtensions];

  return {
    editorCode,
    editorFontSize,
    editorHeight,
    editorWidth,
    editorIndentSpace,
    extensions,
    editorLanguage,
    editorMode,
  };
}
