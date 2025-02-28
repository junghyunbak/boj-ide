import { useMemo } from 'react';

import { useTheme } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { EditorView } from '@uiw/react-codemirror';

import { vim } from '@replit/codemirror-vim';

import { acceptCompletion } from '@codemirror/autocomplete';
import { indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';

import { useEditorController } from '@/renderer/hooks/useEditorController';

import { createTheme } from '@uiw/codemirror-themes';

export function useEditorExtensions() {
  const [editorMode] = useStore(useShallow((s) => [s.mode]));
  const [editorFontSize] = useStore(useShallow((s) => [s.fontSize]));
  const [editorLanguage] = useStore(useShallow((s) => [s.lang]));

  const { saveEditorCode } = useEditorController();

  const theme = useTheme();

  const codemirrorTheme = useMemo(
    () =>
      createTheme({
        theme: theme.theme,
        settings: theme.editor.settings,
        styles: theme.editor.styles,
      }),
    [theme],
  );

  const extensions = useMemo(
    () =>
      [
        /**
         * codemirror 단축키
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
        /**
         * codemirror 테마
         */
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
        /**
         * 에디터 모드
         */
        editorMode === 'vim' && vim(),
        /**
         * 언어 별 코드 하이라이트
         */
        editorLanguage === 'C++14' && cpp(),
        editorLanguage === 'C++17' && cpp(),
        editorLanguage === 'Java11' && java(),
        editorLanguage === 'node.js' && javascript(),
        editorLanguage === 'Python3' && python(),
      ].filter((value) => typeof value === 'object'),
    [editorFontSize, editorLanguage, editorMode, saveEditorCode],
  );

  return { extensions, codemirrorTheme };
}
