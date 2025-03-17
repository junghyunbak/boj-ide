import { useEffect, useMemo } from 'react';

import { useTheme } from '@emotion/react';

import { zIndex } from '@/renderer/styles';

import { EditorState, Prec, type Extension } from '@codemirror/state';
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  rectangularSelection,
  crosshairCursor,
} from '@codemirror/view';
import { bracketMatching, indentOnInput, indentUnit } from '@codemirror/language';
import { createTheme } from '@uiw/codemirror-themes';
import { defaultKeymap, indentMore, history, historyKeymap } from '@codemirror/commands';
import {
  acceptCompletion,
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  closeCompletion,
  completionKeymap,
} from '@codemirror/autocomplete';
import { highlightSelectionMatches, search, searchKeymap } from '@codemirror/search';
import { vim } from '@replit/codemirror-vim';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';

import { useModifyEditor } from '../useModifyEditor';
import { useProblem } from '../useProblem';
import { useEditor } from '../useEditor';

export function useSetupEditor() {
  const { problem } = useProblem();
  const { editorMode, editorRef, editorCode, editorState, editorFontSize, editorIndentSpace, editorLanguage } =
    useEditor();

  const { saveFile, syncEditorCode, updateEditorState, updateEditorView, initialEditorCode } = useModifyEditor();

  const emotionTheme = useTheme();

  const indentString = useMemo(() => ' '.repeat(editorIndentSpace), [editorIndentSpace]);

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
    const spec: ExtractParams<typeof EditorView.theme>[0] = {
      '&': {
        height: '100%',
      },
      /**
       * content
       */
      '.cm-content': {
        fontSize: `${editorFontSize}px`,
        fontFamily: 'hack',
      },
      /**
       * gutter
       */
      '.cm-gutters': {
        fontSize: `${editorFontSize}px`,
        fontFamily: 'hack',
      },
      '.cm-gutter': {
        padding: '0 10px 0 17px',
      },
      /**
       * auto completion
       */
      '.cm-tooltip': {
        zIndex: `${zIndex.editor.tooltip} !important`,
      },
      /**
       * pannel
       */
      '.cm-vim-panel': {
        padding: '5px 10px',
      },
      '.cm-panels': {
        backgroundColor: 'transparent',
        borderTop: `1px solid ${emotionTheme.colors.border}`,
      },
      '.cm-panels input': {
        color: `${emotionTheme.colors.fg} !important`,
        fontFamily: 'hack',
      },
      /**
       * cursor
       */
      '.cm-cursor, .cm-dropCursor': {
        borderLeftColor: `${emotionTheme.colors.fg}`,
      },
      '&:not(.cm-focused) .cm-fat-cursor': {
        background: 'none !important',
      },
    };

    if (emotionTheme.editor.settings.caret) {
      spec['.cm-fat-cursor'] = {
        outline: `solid 1px ${emotionTheme.editor.settings.caret} !important`,
        background: `${emotionTheme.editor.settings.caret} !important`,
      };
    }

    return [
      EditorView.theme(spec),
      createTheme({
        theme: emotionTheme.theme,
        settings: emotionTheme.editor.settings,
        styles: emotionTheme.editor.styles,
      }),
    ];
  }, [editorFontSize, emotionTheme]);

  const keymapExtensions = useMemo<Extension[]>(
    () => [
      keymap.of(defaultKeymap),
      keymap.of(historyKeymap),
      keymap.of(searchKeymap),
      keymap.of(closeBracketsKeymap),
      Prec.highest(
        keymap.of([
          ...completionKeymap.filter(({ key }) => key !== 'Escape'),
          {
            key: 'Escape',
            run: (view) => {
              /**
               * closeCompletion 내부에서 true를 반환하기 때문에 vim Escape 동작이 차단된다.
               *
               * 커스텀하여 false를 반환하도록 수정
               */
              closeCompletion(view);

              return false;
            },
          },
        ]),
      ),
      indentUnit.of(indentString),
      keymap.of([
        {
          key: 'Tab',
          run: acceptCompletion,
        },
        {
          /**
           * [insertTab](https://github.com/codemirror/commands/blob/d6b6d01c470ab6e82c01d084474c7007a5e7c64e/src/commands.ts#L909)
           *
           * insertTab 기본 동작을 그대로 가져가되, tab 대신 공백이 추가되도록 커스텀
           */
          key: 'Tab',
          run: ({ state, dispatch }) => {
            if (state.selection.ranges.some((r) => !r.empty)) {
              return indentMore({ state, dispatch });
            }

            dispatch(
              state.update(state.replaceSelection(indentString), {
                scrollIntoView: true,
                userEvent: 'input',
              }),
            );

            return true;
          },
        },
        {
          key: 'Ctrl-s',
          run: () => {
            saveFile();
            return false;
          },
        },
        {
          key: 'Meta-s',
          run: () => {
            saveFile();
            return false;
          },
        },
      ]),
    ],
    [indentString, saveFile],
  );

  const updateExtension = useMemo<Extension>(
    () =>
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          syncEditorCode(update.state.doc.toString());
        }
      }),
    [syncEditorCode],
  );

  /**
   * codemirror state
   */
  useEffect(() => {
    const newEditorState = EditorState.create({
      doc: editorCode,
      extensions: [
        ...keymapExtensions,
        updateExtension,
        lineNumbers(),
        highlightSpecialChars(),
        history(),
        dropCursor(),
        indentOnInput(),
        drawSelection(),
        bracketMatching(),
        closeBrackets(),
        autocompletion({
          defaultKeymap: false,
        }),
        highlightActiveLine(),
        highlightSelectionMatches(),
        rectangularSelection(),
        search(),
        crosshairCursor(),
        EditorState.allowMultipleSelections.of(true),
        ...codeExtensions,
        ...themeExtensions,
      ],
    });

    updateEditorState(newEditorState);
  }, [editorCode, updateEditorState, codeExtensions, themeExtensions, keymapExtensions, updateExtension]);

  /**
   * codemirror view
   */
  useEffect(() => {
    if (!editorRef.current) {
      return function cleanup() {};
    }

    const editorView = new EditorView({
      state: editorState,
      parent: editorRef.current,
    });

    updateEditorView(editorView);

    return function cleanup() {
      editorView.destroy();
    };
  }, [editorRef, editorCode, editorState, updateEditorView]);

  /**
   * 문제/언어가 변경되면
   *
   * - 기존 코드 저장
   * - 새로운 코드 로딩
   */
  useEffect(() => {
    (async () => {
      if (problem) {
        const {
          data: { code },
        } = await window.electron.ipcRenderer.invoke('load-code', {
          data: { number: problem.number, language: editorLanguage },
        });

        initialEditorCode(code);
      }
    })();

    return function cleanup() {
      saveFile({ problem, language: editorLanguage, silence: true });
    };
  }, [problem, editorLanguage, saveFile, initialEditorCode]);
}
