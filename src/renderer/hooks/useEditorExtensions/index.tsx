import { useMemo } from 'react';

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
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

import { useTheme } from '@emotion/react';

import { useEditorController } from '../useEditorController';

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
        settings: {
          background: theme.colors.bg,
          foreground: theme.colors.fg,

          lineHighlight: theme.editor.colors.lineHightlight,

          selection: theme.editor.colors.selection,
          selectionMatch: theme.editor.colors.selection,

          gutterBorder: theme.editor.colors.gutterBorder,
          gutterBackground: theme.editor.colors.gutterBg,
          gutterForeground: theme.editor.colors.gutterFg,
          gutterActiveForeground: theme.colors.primarybg,
        },
        styles: [
          { tag: t.keyword, color: theme.editor.colors.keyword },
          { tag: t.atom, color: theme.editor.colors.atom },
          { tag: t.number, color: theme.editor.colors.number },
          { tag: t.propertyName, color: theme.editor.colors.property },
          { tag: t.attributeName, color: theme.editor.colors.attribute },
          { tag: t.comment, color: theme.editor.colors.comment },
          { tag: t.string, color: theme.editor.colors.string },
          { tag: t.variableName, color: theme.editor.colors.variable },
          { tag: t.definition(t.variableName), color: theme.editor.colors.variable },
          { tag: t.bracket, color: theme.editor.colors.bracket },
          { tag: t.tagName, color: theme.editor.colors.tag },
          { tag: t.link, color: theme.editor.colors.link },
          { tag: t.invalid, color: theme.editor.colors.invalid },
        ],
      }),
    [theme],
  );

  const extensions = useMemo(
    () =>
      [
        /**
         * codemirror 단축키
         */
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
